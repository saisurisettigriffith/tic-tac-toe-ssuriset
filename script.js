

// script.js

// Import the Box2D library
const b2 = require('box2dweb');

// Wait for the DOM to load before executing the script
window.onload = function () {
  // Set up canvas for display
  const canvas = document.getElementById('box2dCanvas');
  const ctx = canvas.getContext('2d');

  // Create a world with gravity
  const gravity = new b2.b2Vec2(0, 10); // Gravity pointing downwards
  const world = new b2.b2World(gravity, true);

  // Scaling factor for converting Box2D units to pixels
  const scale = 30;

  // Create the ground body definition
  const groundBodyDef = new b2.b2BodyDef();
  groundBodyDef.position.Set(0, 13); // Position the ground 13 units below the origin

  // Create the ground body
  const groundBody = world.CreateBody(groundBodyDef);

  // Define the ground shape as a box
  const groundBox = new b2.b2PolygonShape();
  groundBox.SetAsBox(25, 0.5); // Ground is a box (25 units wide, 0.5 unit tall)

  // Attach the shape to the ground body
  groundBody.CreateFixture2(groundBox, 0);

  // Function to create a dynamic box
  function createBox(x, y, width, height) {
    const boxBodyDef = new b2.b2BodyDef();
    boxBodyDef.type = b2.b2Body.b2_dynamicBody;
    boxBodyDef.position.Set(x, y);

    const boxBody = world.CreateBody(boxBodyDef);

    const dynamicBox = new b2.b2PolygonShape();
    dynamicBox.SetAsBox(width, height);

    const fixtureDef = new b2.b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    fixtureDef.restitution = 0.5;

    boxBody.CreateFixture(fixtureDef);
    return boxBody;
  }

  // Function to create a dynamic circle
  function createCircle(x, y, radius) {
    const circleBodyDef = new b2.b2BodyDef();
    circleBodyDef.type = b2.b2Body.b2_dynamicBody;
    circleBodyDef.position.Set(x, y);

    const circleBody = world.CreateBody(circleBodyDef);

    const dynamicCircle = new b2.b2CircleShape(radius);

    const fixtureDef = new b2.b2FixtureDef();
    fixtureDef.shape = dynamicCircle;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    fixtureDef.restitution = 0.7;

    circleBody.CreateFixture(fixtureDef);
    return circleBody;
  }

  // Create multiple boxes and circles
  const bodies = [];
  bodies.push(createBox(0, 10, 1, 1));
  bodies.push(createBox(-3, 12, 1, 2));
  bodies.push(createBox(3, 15, 1.5, 0.5));
  bodies.push(createCircle(-5, 16, 1));
  bodies.push(createCircle(5, 18, 1.2));

  // Simulation step settings
  const timeStep = 1.0 / 60.0; // Time step (60 FPS)
  const velocityIterations = 6; // Box2D recommends 6 velocity iterations
  const positionIterations = 2; // Box2D recommends 2 position iterations

  // Run the simulation and display the results
  function update() {
    // Step the world to update physics
    world.Step(timeStep, velocityIterations, positionIterations);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    const groundPos = groundBody.GetPosition();
    ctx.fillStyle = 'brown';
    ctx.fillRect((groundPos.x * scale) - (25 * scale), canvas.height - ((groundPos.y * scale) + (0.5 * scale)), 50 * scale, 1 * scale);

    // Draw the dynamic bodies
    bodies.forEach(body => {
      const position = body.GetPosition();
      const angle = body.GetAngle();
      const fixture = body.GetFixtureList();
      const shape = fixture.GetShape();

      ctx.save();
      ctx.translate(position.x * scale, canvas.height - position.y * scale);
      ctx.rotate(angle);

      if (shape instanceof b2.b2CircleShape) {
        ctx.beginPath();
        // Ensure the center of the circle is correctly positioned
        ctx.arc(0, 0, shape.GetRadius() * scale, 0, 2 * Math.PI);
        ctx.fillStyle = 'red'; // Color to fill the circle
        ctx.fill();
      }
      

      if (shape instanceof b2.b2PolygonShape) {
        ctx.beginPath();
        const vertexCount = shape.GetVertexCount();
        const vertices = shape.m_vertices;
        ctx.moveTo(vertices[0].x * scale, -vertices[0].y * scale);
        for (let i = 1; i < vertexCount; i++) {
          ctx.lineTo(vertices[i].x * scale, -vertices[i].y * scale);
        }
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
      } else if (shape instanceof b2.b2CircleShape) {
        ctx.beginPath();
        ctx.arc(0, 0, shape.GetRadius() * scale, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }

      ctx.restore();
    });

    // Request the next frame
    requestAnimationFrame(update);
  }

  // Start the animation
  update();

  console.log('Simulation running!');
};
