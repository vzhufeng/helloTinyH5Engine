const { Engine, Render, Bodies, World, Runner, Events } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 1;

const options = {
  width: 800,
  height: 600,
  showAngleIndicator: true
};

const render = Render.create({
  element: document.body,
  engine: engine,
  options: options
});

Engine.run(engine);
Render.run(render);

const world = engine.world;

World.add(world, [
  // walls
  Bodies.rectangle(400, 0, 800, 5, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 5, { isStatic: true }),
  Bodies.rectangle(800, 300, 5, 600, { isStatic: true }),
  Bodies.rectangle(0, 300, 5, 600, { isStatic: true })
]);

const rect = Bodies.rectangle(200, 550, 50, 50, {
  restitution: 0,
  friction: 0,
  frictionStatic: 0,
});
const rect2 = Bodies.rectangle(600, 550, 50, 50);
let circle;

World.add(world, [rect, rect2]); //

document.addEventListener("keydown", e => {
  const { x: posX, y: posY } = rect.position;

  // console.log(e.keyCode);
  console.log(posX, posY);
  Matter.Common.info(rect);
  // d
  if (e.keyCode === 68) {
    if (posY > 570) {
      Matter.Body.setVelocity(rect, { x: 5, y: 0 });
    }
  }
  // a
  if (e.keyCode === 65) {
    if (posY > 570) {
      Matter.Body.setVelocity(rect, { x: -5, y: 0 });
    }
  }
  // j
  if (e.keyCode === 74) {
    circle = Bodies.circle(posX + 25, posY, 5, {
      restitution: 0.5
    });
    World.add(world, [circle]);
    Matter.Body.setVelocity(circle, { x: 10, y: 5 });
  }
  // 空格
  if (e.keyCode === 32) {
    if (posY > 570) {
      Matter.Body.setVelocity(rect, { x: 0, y: -15 });
    }
  }
});
