<script lang="ts">
  import { onMount } from 'svelte';

  import Matter from 'matter-js';

  import Stats from '$lib/Stats.svelte';
  import { NEAT } from '$lib/neat';

  let container: HTMLDivElement;
  let neat = new NEAT(4, 30, [12, 16, 4]);
  let currentSpecies = '';

  onMount(async () => {
    const engine = Matter.Engine.create();
    engine.timing.timeScale = 2.0;

    const bodies: Array<Matter.Body> = [];
    Matter.Events.on(engine, 'beforeUpdate', () => {
      let left = bodies.reduce((prev, next) => Math.max(prev, next.position.x), 400);
      Matter.Render.lookAt(renderer, {
        min: { x: left - 400, y: 0 },
        max: { x: left + 400, y: 600 }
      });

      const n_blocks = 800 / 24;
      const block_w = 800 / n_blocks;
      const start = -renderer.bounds.min.x % (2 * block_w);
      renderer.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < n_blocks; i += 2) {
        renderer.context.fillRect(
          (width / 800) * (start + (i * block_w)),
          (height / 600) * (floor.position.y - 24),
          block_w,
          block_w
        );
      }
    });

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

    const floor_w = 100000000;
    const floor = Matter.Bodies.rectangle(floor_w / 2, 600, floor_w, 50, {
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
            chamfer: 0.1 as Matter.IChamfer,
          });
          const left_shin = Matter.Bodies.rectangle(100, 500, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
            chamfer: 0.1 as Matter.IChamfer,
          });
          const right_thigh = Matter.Bodies.rectangle(150, 450, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
            chamfer: 0.1 as Matter.IChamfer,
          });
          const right_shin = Matter.Bodies.rectangle(150, 500, 20, 70, {
            render,
            collisionFilter,
            friction: 1,
            frictionStatic: 1000,
            density: 1,
            chamfer: 0.1 as Matter.IChamfer,
          });
          const body = Matter.Bodies.rectangle(125, 400, 50, 50, {
            render,
            collisionFilter,
            density: 1,
            frictionAir: 0.05,
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
          bodies.push(body);

          const done = () => {
            Matter.Composite.remove(engine.world, parent);
            Matter.Events.off(engine, 'beforeUpdate', callback);
            Matter.Events.off(engine, 'collisionStart', collide);
            bodies.splice(bodies.indexOf(body), 1);

            clearTimeout(timeout);
            resolve(body.position.x);
          };
          const timeout = setTimeout(done, 60 * 1000);
          const callback = () => {
            renderer.context.fillStyle = 'white';
            renderer.context.fillText(
              org.name,
              (width / 800) * (body.position.x - renderer.bounds.min.x),
              (height / 600) * (body.position.y - 40),
            );

            const center = body.position;
            const cmp = (bod: Matter.Body) => [
              (((bod.position.x - center.x) / 200) + 1) / 2,
              (((bod.position.y - center.y) / 200) + 1) / 2
            ];
            const clamp = (min: number, max: number, x: number) => Math.max(min, Math.min(max, x));
            const ang = (bod: Matter.Body) => clamp(0, 1, ((bod.angle / (2 * Math.PI)) + 1) / 2);
            const result = org.network.evaluate([
              ...cmp(left_shin),
              ...cmp(left_thigh),
              ...cmp(right_shin),
              ...cmp(right_thigh),
              ang(left_shin),
              ang(left_thigh),
              ang(right_shin),
              ang(right_thigh),
            ]);
            Matter.Body.translate(body, { x: 4, y: 0 });
            [left_shin, left_thigh, right_shin, right_thigh].forEach((x, i) => {
              Matter.Body.setAngularVelocity(
                x, clamp(-0.25, 0.25, (result[i] - 0.5) / 50)
              );
            });

            if (body.position.x < 0) done();
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
  @media only screen and (max-width: 1400px) {
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
