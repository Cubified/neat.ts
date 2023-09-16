<script lang="ts">
  import { onMount } from 'svelte';

  import Matter from 'matter-js';

  import Stats from '$lib/Stats.svelte';
  import { NEAT } from '$lib/neat';

  let container: HTMLDivElement;
  let neat = new NEAT(4, 30, [2, 4, 1]);
  let currentSpecies = '';

  onMount(async () => {
    const engine = Matter.Engine.create();
    engine.timing.timeScale = 1.0;

    let width = Math.min(window.innerWidth, 800);
    let height = (600 / 800) * width;
    const renderer = Matter.Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        showAngleIndicator: false,
        wireframes: false,
      }
    });
    renderer.context.textAlign = 'center';
    window.addEventListener('resize', () => {
      width = Math.min(window.innerWidth, 800);
      height = (600 / 800) * width;

      renderer.options.width = width;
      renderer.options.height = height;
      renderer.canvas.width = width;
      renderer.canvas.height = height;
      renderer.context.textAlign = 'center';
    });

    Matter.Render.run(renderer);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    Matter.Render.lookAt(renderer, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    ]);

    const collisionFilter = {
      group: -1,
      mask: 1,
      category: 2,
    };

    for (;;) {
      await neat.compete((org) =>
        new Promise((resolve) => {
          const render = {
            strokeStyle: '#ffffff',
            lineWidth: 3,
            fillStyle: '#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0'),
            opacity: 0.4,
          };

          const cart = Matter.Bodies.rectangle(400, 570, 20, 20, {
            render,
            collisionFilter,
            friction: 0,
            frictionStatic: 0,
          });
          const pendulum = Matter.Bodies.circle(400, 500, 5, {
            render,
            collisionFilter,
          });
          const pole = Matter.Constraint.create({
            bodyA: cart,
            bodyB: pendulum,
            render,
          });
          Matter.Composite.add(engine.world, [cart, pendulum, pole]);

          Matter.Body.translate(pendulum, { x: (Math.random() - 0.5) * 2, y: 0 });

          const start = performance.now();
          const done = () => {
            Matter.Composite.remove(engine.world, [cart, pendulum, pole]);
            Matter.Events.off(engine, 'beforeUpdate', callback);

            clearTimeout(timeout);
            resolve(performance.now() - start);
          };
          const timeout = setTimeout(done, 10 * 1000);
          const callback = () => {
            renderer.context.fillText(
              org.name,
              (width / 800) * cart.position.x,
              (height / 600) * (cart.position.y + 20)
            );

            const result = org.network.evaluate([
              cart.position.x / 800,
              pendulum.position.x / 800,
            ])[0];
            Matter.Body.translate(cart, { x: 800 * (result - 0.5), y: 0 });

            if (pendulum.position.y >= cart.position.y || cart.position.x <= 0 || cart.position.x >= 800) done();
          };
          Matter.Events.on(engine, 'beforeUpdate', callback);
        }),
        (species) => { currentSpecies = species.name; }
      );
      neat = neat;
      neat.breed();
    }
  });
</script>

<h1>NEAT Demo: Pole Balancing</h1>

<div class="flex">
  <div class="view">
    <div bind:this={container} />
    <p>Generation: <b>{ neat.generation }</b><br />Species: <b>{ currentSpecies }</b></p>
  </div>
  <Stats { neat } />
</div>

<style>
  h1 {
    text-align: center;
  }
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 600px;
    gap: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media only screen and (max-width: 800px) {
    .flex {
      display: block;
      padding: 0;
    }
  }
  .view {
    text-align: center;
  }
</style>

<svelte:head>
  <style>
    body {
      max-width: unset;
    }
  </style>
  <title>NEAT Demo: Pole Balancing</title>
</svelte:head>
