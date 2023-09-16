# neat.ts

A NEAT ([Neuroevolution of Augmenting Topologies](https://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf)) implementation written in TypeScript, with a UI built with SvelteKit.

Includes 3 demos:  [Pole balancing (inverted pendulum)](https://cubified.github.io/neat.ts/pole_balancing), [Flappy Bird](https://cubified.github.io/neat.ts/flappy_bird), and [bipedal walker](https://cubified.github.io/neat.ts/walker).

## Demos/Screenshots:

- Pole balancing:

![Pole balancing demo](https://github.com/Cubified/neat.ts/blob/main/static/pole.gif)

- Flappy Bird:

![Flappy Bird demo](https://github.com/Cubified/neat.ts/blob/main/static/bird.gif)

- Bipedal walker:

![Bipedal walker demo](https://github.com/Cubified/neat.ts/blob/main/static/walker.gif)

---

- User interface:

![UI](https://github.com/Cubified/neat.ts/blob/main/static/demo.png)

## Overview

This project evolves fixed-size feed-forward neural networks via natural selection and random mutation of weights/biases.

This is a slight change from the approach that Stanley and Miikkulainen describe in their paper, which mutates by adding edges and vertices to a child graph.

In practice, this change likely negatively impacts learning rate.  However, the included demos are simple enough that this approach solves them relatively quickly.

## High-Level Documentation

### [Node](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L17)

A single vertex in a network.  Stores a bias and an array of weights corresponding to each ancestor vertex.

### [Layer](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L31)

A single layer in a network.  Stores an array of nodes, and provides a function for feeding an array of inputs forward through the graph.

### [Network](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L61)

A directed graph.  Provides functions for crossing over (breeding) with another parent and mutating.  A mutation can be one of four types:  Set (i.e. `weight = val`), add (i.e. `weight += val`), disable (i.e. `weight = 0`), and invert (i.e. `weight *= -1`).

### [Encoding](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L160)

A linearized encoding of a Network.  Helps with crossover and mutation.

### [Organism](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L201)

A single member of a species.  Contains a name, a fitness, and a network.

### [Species](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L216)

A collection of organisms.  Contains a name, as well as helpful information regarding the best performing member of the species.

### [NEAT](https://github.com/Cubified/neat.ts/blob/main/src/lib/neat.ts#L231)

The main class for performing learning.  To create a custom demo, first construct a new class with `new NEAT(...)`.  Then in a continuous loop, call `neat.compete(() => { ... })` and `neat.breed()`.