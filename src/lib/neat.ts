import { adjectives, nouns, names } from '$lib/words';

const MUTATION_CHANCE = 0.125;
const flip_coin = (x = 0.5) => (Math.random() < x);
const rand_weight = () => (2 * (Math.random() - 0.5));
const rand_int = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
const rand_choice = (arr: Array<string>) => arr[rand_int(0, arr.length)];
const rand_organism = () => rand_choice(names).toLowerCase();
const rand_species = () => `${rand_choice(adjectives)} ${rand_choice(nouns)}`;

const relu = (x: number) => Math.max(0, x);
// const sigmoid = (x: number) => (Math.exp(x) / (Math.exp(x) + 1));
// const softplus = (x: number) => Math.log(1 + Math.exp(x)) / Math.log(Math.E);
// const ALL_ACTIVATIONS = [sigmoid, relu, softplus];

class Node {
  weights: Array<number>;
  bias: number;

  constructor(n_weights: number, with_bias: boolean) {
    this.weights = new Array(n_weights);
    for (let i = 0; i < n_weights; i++) {
      this.weights[i] = rand_weight();
    }
    this.bias = with_bias ? rand_weight() : 0;
  }
}

type Activation = (x: number) => number;
class Layer {
  nodes: Array<Node>;
  activation: Activation;

  constructor(
    n_children: number,
    n_connections: number,
    with_bias: boolean,
    activation: Activation
  ) {
    this.nodes = new Array(n_children);
    for (let i = 0; i < n_children; i++) {
     this.nodes[i] = new Node(n_connections, with_bias);
    }
    this.activation = activation;
  }
  feed_forward(inputs: Array<number>): Array<number> {
    const out = new Array(this.nodes.length)
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      let val = node.bias;
      for (let j = 0; j < node.weights.length; j++) {
        val += inputs[j] * node.weights[j];
      }
      out[i] = this.activation(val);
    }
    return out;
  }
}

class Network {
  layers: Array<Layer>;

  constructor(layer_counts: Array<number>, activations: Array<Activation>) {
    this.layers = new Array(layer_counts.length);
    for (let i = 0; i < layer_counts.length; i++) {
      this.layers[i] = new Layer(
        layer_counts[i],
        layer_counts[i - 1] ?? 0,
        i > 0,
        activations[i],
      );
    }
  }
  evaluate(inputs: Array<number>): Array<number> {
    for (let i = 1; i < this.layers.length; i++) {
      inputs = this.layers[i].feed_forward(inputs);
    }
    return inputs;
  }
  crossover(b: Network): Network {
    const encoding = new Encoding();

    if (flip_coin()) {
      // Randomly select activation functions
      for (let i = 0; i < this.layers.length; i++) {
        let parent = this.layers;
        if (flip_coin()) parent = b.layers;
        encoding.activations.push(parent[i].activation);
      }
    } else {
      // Choose slice point for activation functions
      const end = rand_int(0, this.layers.length);

      encoding.activations = [
        ...this.layers.slice(0, end).map((x) => x.activation),
        ...b.layers.slice(end).map((x) => x.activation),
      ]
    }

    if (flip_coin()) {
      // Randomly select genes
      for (let i = 0; i < this.layers.length; i++) {
        encoding.layer_counts.push(this.layers[i].nodes.length);
        for (let j = 0; j < this.layers[i].nodes.length; j++) {
          for (let k = 0; k < this.layers[i].nodes[j].weights.length; k++) {
            let parent = this.layers;
            if (flip_coin()) parent = b.layers;
            encoding.raw.push(parent[i].nodes[j].weights[k]);
          }

          let parent = this.layers;
          if (flip_coin()) parent = b.layers;
          encoding.raw.push(parent[i].nodes[j].bias);
        }
      }
    } else {
      // Choose slice point for genes
      const encoded_a = new Encoding(this);
      const encoded_b = new Encoding(b);
      const end = rand_int(0, encoded_a.raw.length);

      encoding.layer_counts = this.layers.map((x) => x.nodes.length);
      encoding.raw = [
        ...encoded_a.raw.slice(0, end),
        ...encoded_b.raw.slice(end),
      ];
    }

    return encoding.decode();
  }
  mutate() {
    const encoding = new Encoding(this);
    for (let i = 0; i < encoding.raw.length; i++) {
      if (flip_coin(MUTATION_CHANCE)) {
        switch (rand_int(0, 2)) {
          case 0:
            // Set mutation
            encoding.raw[i] = rand_weight();
            break;
          case 1:
            // Add mutation
            encoding.raw[i] += rand_weight();
            break;
          case 2:
            // Disable mutation
            encoding.raw[i] = 0;
            break;
          case 3:
            // Invert mutation
            encoding.raw[i] *= -1;
            break;
        }
      }
    }
    return encoding.decode();
  }
}

class Encoding {
  layer_counts: Array<number>;
  activations: Array<Activation>;
  raw: Array<number>;

  constructor(network?: Network) {
    if (!network) {
      this.layer_counts = [];
      this.activations = [];
      this.raw = [];
      return;
    }

    this.raw = [];
    this.layer_counts = network.layers.map((x) => x.nodes.length);
    this.activations = network.layers.map((x) => x.activation);
    for (let i = 0; i < network.layers.length; i++) {
      const layer = network.layers[i];
      for (let j = 0; j < layer.nodes.length; j++) {
        const node = layer.nodes[j];
        this.raw.push(...node.weights, node.bias);
      }
    }
  }
  decode(): Network {
    const network = new Network(this.layer_counts, this.activations);
    let idx = 0;
    for (let i = 0; i < network.layers.length; i++) {
      const layer = network.layers[i];
      for (let j = 0; j < layer.nodes.length; j++) {
        const node = layer.nodes[j];
        for (let k = 0; k < node.weights.length; k++) {
          node.weights[k] = this.raw[idx++];
        }
        node.bias = this.raw[idx++];
      }
    }
    return network;
  }
}

class Organism {
  name: string;
  fitness: number;
  network: Network;

  constructor(layer_counts: Array<number>, activations: Array<Activation>) {
    this.name = rand_organism();
    this.fitness = 0;
    this.network = new Network(
      layer_counts,
      activations,
    );
  }
}

class Species {
  name: string;
  fittest_organism: Organism;
  population: Array<Organism>;

  constructor(n_members: number, layer_counts: Array<number>, activations: Array<Activation>) {
    this.population = [];
    for (let i = 0; i < n_members; i++) {
      this.population[i] = new Organism(layer_counts, activations);
    }
    this.name = rand_species();
    this.fittest_organism = this.population[0];
  }
}

class NEAT {
  generation: number;
  species: Array<Species>;
  ancestors: Array<Array<Species>>;

  species_size: number;
  layer_counts: Array<number>;
  activations: Array<Activation>;

  constructor(
    species_count: number,
    species_size: number,
    layer_counts: Array<number>,
    activations?: Array<Activation>,
  ) {
    this.generation = 0;
    this.species = [];
    this.ancestors = [];
    this.species_size = species_size;
    this.layer_counts = layer_counts;
    this.activations = activations ?? layer_counts.map(() => relu);
    for (let i = 0; i < species_count; i++) {
      this.species[i] = new Species(species_size, layer_counts, this.activations);
    }
  }

  async compete(fn: (o: Organism) => Promise<number>, onNewSpecies?: (s: Species) => void, parallel = true) {
    for (let i = 0; i < this.species.length; i++) {
      const species = this.species[i];
      if (onNewSpecies) onNewSpecies(species);

      const promises = [];
      for (let j = 0; j < species.population.length; j++) {
        const promise = fn(species.population[j]);
        if (parallel) {
          promises[j] = promise;
        } else {
          species.population[j].fitness = await promise;
        }
      }

      if (parallel) {
        const fitnesses = await Promise.all(promises);
        for (let j = 0; j < fitnesses.length; j++) {
          species.population[j].fitness = fitnesses[j];
        }
      }

      species.population.sort((a, b) => (b.fitness - a.fitness));
      species.fittest_organism = species.population[0];
    }
    this.species.sort((a, b) => (b.fittest_organism.fitness - a.fittest_organism.fitness));
  }
  breed() { 
    const new_gen: Array<Species> = [];
    for (let i = 0; i < this.species.length; i++) {
      const species = this.species[Math.floor(i / 2)];
      new_gen[i] = new Species(this.species_size, this.layer_counts, this.activations);

      const len = Math.floor(species.population.length / 4);
      for (let j = 0; j < species.population.length; j++) {
        const a = species.population[rand_int(0, len)].network;
        let b;
        do {
          b = species.population[rand_int(0, len)].network;
        } while (a === b);
        new_gen[i].population[j].network = a.crossover(b).mutate();
      }
    }
    this.ancestors[this.generation++] = this.species;
    this.species = new_gen;
  }
}

export { NEAT, Species, Organism, Network };