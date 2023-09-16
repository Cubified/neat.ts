<div class="main">
  <h1>NEAT Demos</h1>
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
  <div class="spacer"></div>
  <div class="footer">
    <a href="https://github.com/Cubified/neat.ts">
      Built with SvelteKit and Typescript.
    </a>
    <br />
    <a href="https://andrewlrussell.com">andrewlrussell.com</a>
  </div>
</div>

<style>
  h1 {
    text-align: center;
    margin-bottom: 2rem;
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
  @media only screen and (max-width: 900px) {
    .flex {
      display: block;
    }
    .item {
      margin-bottom: 2rem;
    }
  }
  img {
    height: 300px;
    width: auto;
  }

  .main {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .spacer {
    flex: 1;
  }
  .footer {
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
