<script lang="ts">
  import type { NEAT, Species, Organism, Network } from '$lib/neat';
	import BestPerformer from '$lib/BestPerformer.svelte';

  export let neat: NEAT;
  export let n_view = 4;

  interface HistoryItem {
    generation: number;
    species: Species;
  }
  let history: Array<HistoryItem> = [];
  let left = 1;

  $: {
    history.unshift({
      generation: neat.generation,
      species: neat.species[0],
    });
    history = history;
  }
</script>

<div class="parent">
  <table>
    <tr>
      <th>Generation</th>
      <th>Best Species</th>
      <th>Best Organism</th>
      <th>Best Fitness</th>
      <th>Network</th>
    </tr>
    {#each history.slice(left, left + n_view) as item}
      <tr>
        <td>{ item.generation }</td>
        <td>{ item.species.name }</td>
        <td>{ item.species.fittest_organism.name }</td>
        <td>{ item.species.fittest_organism.fitness.toFixed(0) }</td>
        <td>
          <BestPerformer organism={item.species.fittest_organism} />
        </td>
      </tr>
    {/each}
  </table>

  <div class="row">
    <button
      disabled={left <= 1}
      on:click={() => {
        if (left > 1) left -= n_view;
      }}
    >
      Later
    </button>
    <div class="spacer"></div>
    <button
      disabled={left >= history.length - 1}
      on:click={() => {
        if (left < history.length - 1) left += n_view;
      }}
    >
      Earlier
    </button>
  </div>
</div>

<style>
  .parent {
    width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .row {
    display: flex;
  }
  .spacer {
    width: 16px;
    flex: 1;
  }

  button:disabled {
    background: gray !important;
    cursor: default !important;
    opacity: 0.5;
    border: none;
  }

  table {
    width: 600px;
    height: 600px;
    table-layout: fixed;
  }
</style>