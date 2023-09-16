<script lang="ts">
  import { onMount } from 'svelte';
	import Stats from '$lib/Stats.svelte';

  import Matter from 'matter-js';
  import type { IEventCollision, Engine } from 'matter-js';

  import { NEAT } from '$lib/neat';

  let container: HTMLDivElement;
  let neat = new NEAT(4, 30, [3, 4, 1]);
  let currentSpecies = '';

  onMount(async () => {
    const engine = Matter.Engine.create();
    engine.timing.timeScale = 1.0;

    let width = Math.min(window.innerWidth, 400);
    let height = (600 / 400) * width;
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
      width = Math.min(window.innerWidth, 400);
      height = (600 / 400) * width;

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
      max: { x: 400, y: 600 }
    });

    const render_opts = {
      strokeStyle: '#ffffff',
      lineWidth: 3,
      opacity: 0.4,
    };
    const top_wall = Matter.Bodies.rectangle(400, -200, 50, 1000, {
      isStatic: true,
      collisionFilter: { mask: 2 | 1, category: 1 },
      render: { ...render_opts, fillStyle: 'red' },
    });
    const bottom_wall = Matter.Bodies.rectangle(400, 1000, 50, 1000, {
      isStatic: true,
      collisionFilter: { mask: 2 | 1, category: 1 },
      render: { ...render_opts, fillStyle: 'blue' },
    });

    Matter.Events.on(engine, 'beforeUpdate', () => {
      Matter.Body.translate(top_wall, { x: -2, y: 0 });
      Matter.Body.translate(bottom_wall, { x: -2, y: 0 });

      if (top_wall.position.x <= -25) {
        const pos = (300 * Math.random()) - 400;
        Matter.Body.setPosition(top_wall, {
          x: 425,
          y: pos,
        });
        Matter.Body.setPosition(bottom_wall, {
          x: 425,
          y: pos + 1200,
        });
      }
    });

    Matter.Composite.add(engine.world, [
      top_wall,
      bottom_wall,
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

          const player = Matter.Bodies.rectangle(200, top_wall.position.y + 600, 20, 20, {
            render,
            collisionFilter,
          });
          Matter.Composite.add(engine.world, player);

          const start = performance.now();
          const done = () => {
            Matter.Composite.remove(engine.world, player);
            Matter.Events.off(engine, 'beforeUpdate', callback);
            Matter.Events.off(engine, 'collisionStart', collide);

            // clearTimeout(timeout);
            resolve(performance.now() - start);
          };
          // const timeout = setTimeout(done, 10 * 1000);
          const callback = () => {
            renderer.context.fillStyle = 'white';
            renderer.context.fillText(
              org.name,
              (width / 400) * player.position.x,
              (height / 600) * player.position.y + 20
            );

            const result = org.network.evaluate([
              player.position.y / 600,
              top_wall.position.x / 400,
              top_wall.position.y / 600,
            ])[0];
            if (result > 0.5) {
              Matter.Body.applyForce(player, player.position, { x: 0, y: -0.01 });
            }

            if (player.position.y <= 0 || player.position.y >= 600) done();
          };
          const collide = (event: IEventCollision<Engine>) => {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
              const pair = pairs[i];
              if (pair.bodyA === player || pair.bodyB === player) {
                done();
              }
            }
          };
          Matter.Events.on(engine, 'beforeUpdate', callback);
          Matter.Events.on(engine, 'collisionStart', collide);
        }),
        (species) => { currentSpecies = species.name; }
      );
      neat = neat;
      neat.breed();
    }
  });
</script>

<h1>NEAT Demo: Flappy Bird</h1>

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
  @media only screen and (max-width: 600px) {
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
  <title>NEAT Demo: Flappy Bird</title>
</svelte:head>
