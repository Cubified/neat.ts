<h1>NEAT Demos</h1>
<br />
<div class="flex">
  <div class="item">
    <img src="pole.gif" alt="Pole balancing demo" width="400" height="300" />
    <a href="pole_balancing">Pole Balancing</a>
  </div>
  <div class="item">
    <img src="bird.gif" alt="Flappy Bird demo" width="400" height="300" />
    <a href="flappy_bird">Flappy Bird</a>
  </div>
  <div class="item">
    <img src="walker.gif" alt="Walker demo" width="400" height="300" />
    <a href="walker">Biped Walker</a>
  </div>
</div>

<div class="footer">
  <a href="https://github.com/Cubified/neat.ts">
    Built with SvelteKit and Typescript.
  </a>
  <br />
  <a href="https://andrewlrussell.com">andrewlrussell.com</a>
</div>

<style>
  h1 {
    text-align: center;
  }
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    gap: 1rem;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }
  img {
    height: 300px;
    width: auto;
  }

  .footer {
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100vw;
  }
</style>

<svelte:head>
  <style>
    body {
      max-width: unset;
    }
  </style>
  <title>NEAT Demos</title>
</svelte:head>