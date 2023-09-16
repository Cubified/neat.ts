<script lang="ts">
  import { onMount } from 'svelte';

  import Matter from 'matter-js';

  import Stats from '$lib/Stats.svelte';
  import { NEAT } from '$lib/neat';

  let container: HTMLDivElement;
  let neat = new NEAT(4, 30, [8, 16, 4]);
  let currentSpecies = '';

  onMount(async () => {
    const engine = Matter.Engine.create();
    engine.timing.timeScale = 2.0;

    const renderer = Matter.Render.create({
      element: container,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: false,
        wireframes: false,
      }
    });
    renderer.context.textAlign = 'center';

    Matter.Render.run(renderer);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    Matter.Render.lookAt(renderer, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    const floor = Matter.Bodies.rectangle(400, 600, 800, 50, {
      isStatic: true,
      friction: 1,
      frictionStatic: 1000,
    });
    Matter.Composite.add(engine.world, floor);

    for (;;) {
      let idx = 1;
      await neat.compete((org) =>
        new Promise((resolve) => {
          const render = {
            strokeStyle: '#ffffff',
            lineWidth: 3,
            fillStyle: '#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0'),
            opacity: 0.4,
          };
          const collisionFilter = {
            group: -idx,
            mask: (1 << idx) | 1,
            category: 1 << idx,
          };
          idx++;

          const left_thigh = Matter.Bodies.rectangle(100, 450, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
          });
          const left_shin = Matter.Bodies.rectangle(100, 500, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
          });
          const right_thigh = Matter.Bodies.rectangle(150, 450, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
          });
          const right_shin = Matter.Bodies.rectangle(150, 500, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
          });
          const body = Matter.Bodies.rectangle(125, 400, 75, 50, {
            render,
            collisionFilter,
            density: 1,
          });
          const left_knee = Matter.Constraint.create({
            bodyA: left_shin,
            bodyB: left_thigh,
            pointA: {
              x: 0,
              y: -35,
            },
            pointB: {
              x: 0,
              y: 35,
            },
            stiffness: 1,
            length: 0,
            render,
          });
          const right_knee = Matter.Constraint.create({
            bodyA: right_shin,
            bodyB: right_thigh,
            pointA: {
              x: 0,
              y: -35,
            },
            pointB: {
              x: 0,
              y: 35,
            },
            stiffness: 1,
            length: 0,
            render,
          });
          const groin = Matter.Constraint.create({
            bodyA: left_thigh,
            bodyB: right_thigh,
            pointA: {
              x: 0,
              y: -35,
            },
            pointB: {
              x: 0,
              y: -35,
            },
            stiffness: 1,
            length: 0,
            render,
          });
          const left_hip = Matter.Constraint.create({
            bodyA: body,
            bodyB: left_thigh,
            pointB: {
              x: 0,
              y: -35,
            },
            stiffness: 1,
            length: 0,
            render,
          });
          const right_hip = Matter.Constraint.create({
            bodyA: body,
            bodyB: right_thigh,
            pointB: {
              x: 0,
              y: -35,
            },
            stiffness: 1,
            length: 0,
            render,
          });

          const parent = Matter.Composite.create();
          Matter.Composite.add(parent, [
            left_thigh,
            right_thigh,
            left_shin,
            right_shin,
            left_knee,
            right_knee,
            groin,
            body,
            left_hip,
            right_hip,
          ]);
          Matter.Composite.add(engine.world, parent);

          const done = () => {
            Matter.Composite.remove(engine.world, parent);
            Matter.Events.off(engine, 'beforeUpdate', callback);
            Matter.Events.off(engine, 'collisionStart', collide);

            clearTimeout(timeout);
            resolve(body.position.x);
          };
          const timeout = setTimeout(done, 5 * 1000);
          const callback = () => {
            renderer.context.fillStyle = 'white';
            renderer.context.fillText(org.name, body.position.x, body.position.y - 40);

            const result = org.network.evaluate([
              left_shin.position.x / 800,
              left_shin.position.y / 800,
              left_thigh.position.x / 800,
              left_thigh.position.y / 800,
              right_shin.position.x / 800,
              right_shin.position.y / 800,
              right_thigh.position.x / 800,
              right_thigh.position.y / 800,
            ]);
            Matter.Body.setAngularVelocity(
              left_shin, (result[0] - 0.5) / 20
            );
            Matter.Body.setAngularVelocity(
              left_thigh, (result[1] - 0.5) / 20
            );
            Matter.Body.setAngularVelocity(
              right_shin, (result[2] - 0.5) / 20
            );
            Matter.Body.setAngularVelocity(
              right_thigh, (result[3] - 0.5) / 20
            );

            if (body.position.x < 0 || body.position.y > left_thigh.position.y || body.position.y > right_thigh.position.y) done();
          };
          const collide = (event: any) => {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
              const pair = pairs[i];
              if ((pair.bodyA === floor || pair.bodyB === floor) && (pair.bodyA === body || pair.bodyB === body)) {
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

<h1>NEAT Demo: Biped Walker</h1>

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
  <title>NEAT Demo: Biped Walker</title>
</svelte:head>