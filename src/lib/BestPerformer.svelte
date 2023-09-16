<script lang="ts">
  import { onMount } from 'svelte';
  import type { Organism } from '$lib/neat';

  export let organism: Organism | undefined;
  export let size = 100;

  const GAP = 25;
  const RADIUS = GAP / 4;

  let canvas: HTMLCanvasElement;
  $: {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (organism && ctx) {
        ctx.clearRect(0, 0, size, size);

        const layers = organism.network.layers;
        const x_start = ((size - GAP) / 2) - (layers.length * 10);
        const locations: Array<Array<Array<number>>> = [];
        for (let i = 0; i < layers.length; i++) {
          const nodes = layers[i].nodes;
          const y_start = ((size + GAP) / 2) - (nodes.length * (GAP / 2));
          locations[i] = [];
          for (let j = 0; j < nodes.length; j++) {
            locations[i][j] = [x_start + (i * GAP), y_start + (j * GAP)];
            ctx.beginPath();
            ctx.arc(...locations[i][j], RADIUS, 0, 2 * Math.PI);

            const bias = nodes[j].bias;
            ctx.fillStyle = `rgb(${255 - (255 * bias)}, ${255 * bias}, 0)`;
            ctx.fill();

            const ancestors = locations[i - 1] ?? [];
            for (let k = 0; k < ancestors.length; k++) {
              ctx.beginPath();
              ctx.moveTo(...ancestors[k]);
              ctx.lineTo(...locations[i][j]);

              ctx.strokeStyle = `rgba(0, 0, 0, ${(nodes[j].weights[k] + 1) / 2})`;
              ctx.lineWidth = 3;
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  onMount(() => {
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  });
</script>

<canvas bind:this={canvas} />