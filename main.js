var SCORE = 0;


// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Events = Matter.Events,
    Constraint = Matter.Constraint, 
    Vector = Matter.Vector;

var defaultCategory = 0x0001,
    flipperCategory = 0x0002,
    ballCategory = 0x0004,
    markersCategory = 0x0008;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0.3;
// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 600,
        height: 800,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true,
        wireframes: false,
    }
});

// create two boxes and a ground
var ball = Bodies.circle(300, 50, 10, {friction: 0.0, restitution: 0.7, collisionFilter: {category: ballCategory, mask: flipperCategory | defaultCategory}});
// Body.rotate(boxA, 20*Math.PI / 180);
var ground = Bodies.rectangle(400, 410, 810, 60, { isStatic: true });

var rightFlipper = Bodies.rectangle(450, 690, 140, 20, {collisionFilter: {
    category: flipperCategory,
    mask: ballCategory|markersCategory
}});

var leftFlipper = Bodies.rectangle(150, 690, 140, 20, {collisionFilter: {
    category: flipperCategory,
    mask: ballCategory|markersCategory
}});

var santa = Bodies.rectangle(300, 300, 60, 75, {
    isStatic: true,
    render: {
        strokeStyle: '#ff0000',
        sprite: {
            texture: 'santa.png',
            xScale: 0.25,
            yScale: 0.25,
        }
    }});

setScore(0);

// add all of the bodies to the world
Composite.add(engine.world, [
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),//top
    Bodies.rectangle(600, 300, 50, 660, { isStatic: true }),//right
    Bodies.rectangle(0, 300, 50, 700, { isStatic: true }),//left
    
    ball, santa,
    // Right Flipper
    rightFlipper,
    Bodies.rectangle(520, 650, 160, 20, {isStatic: true, angle: -30*Math.PI/180, collisionFilter: {category: defaultCategory}}),
    Bodies.rectangle(430, 760, 10, 100, {isStatic: true, angle: -70 * Math.PI / 180, collisionFilter: {category: markersCategory}}),
    Bodies.rectangle(430, 590, 10, 100, {
        isStatic: true, 
        angle: 20 * Math.PI / 180, 
        collisionFilter: {category: markersCategory},
        render: {
            strokeStyle: '#000000'
       }
    }),
    Constraint.create({ 
        bodyA: rightFlipper, 
        pointA: {x: 40, y:0},
        pointB: Vector.clone(rightFlipper.position),
        stiffness: 1,
        length: 0
    }),

    // Left Flipper
    leftFlipper,
    Constraint.create({ 
        bodyA: leftFlipper, 
        pointA: {x: -40, y:0},
        pointB: Vector.clone(leftFlipper.position),
        stiffness: 1,
        length: 0
    }),
    Bodies.rectangle(80, 650, 160, 20, {isStatic: true, angle: 30*Math.PI/180, collisionFilter: {category: defaultCategory}}),
    Bodies.rectangle(170, 760, 10, 100, {isStatic: true, angle: 70 * Math.PI / 180, collisionFilter: {category: markersCategory}}),
    Bodies.rectangle(170, 590, 10, 100, {
        isStatic: true, 
        angle: -20 * Math.PI / 180, 
        collisionFilter: {category: markersCategory},
        render: {
            strokeStyle: '#000000'
       }
    }),

    // obstacles
    Bodies.rectangle(150, 300, 200, 10, {isStatic: true, angle: 30*Math.PI/180, restitution: 10.5}),
    Bodies.rectangle(300, 100, 100, 10, {isStatic: true, angle: 30*Math.PI/180, restitution: 10.5}),
    Bodies.rectangle(500, 200, 100, 10, {isStatic: true, angle: -30*Math.PI/180, restitution: 10.5}),
    Bodies.rectangle(400, 400, 160, 10, {isStatic: true, angle: -30*Math.PI/180, restitution: 10.5}),
]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
var rightFlipperState = 0.0, rightFlipperDirection = 0;

window.addEventListener('keydown', function(event){
    console.log(event);
    if(event.code == 'KeyX'){
        Body.applyForce(rightFlipper, rightFlipper.position, {x:0.0, y:-0.5});
    }

    if(event.code == 'KeyZ'){
        Body.applyForce(leftFlipper, leftFlipper.position, {x:0.0, y:-0.5});
    }

});

window.addEventListener('keyup', function(event){
    // console.log('up', event);
    if(event.code == 'KeyX')
        rightFlipperDirection = -1;
});

Events.on(render, 'beforeRender', function() {
    if(ball.position.y > 1000)
        Body.setPosition(ball, {x: 300, y: 50})
    if (Matter.Collision.collides(santa, ball) != null) {
        setScore(1);
    }
        
});

// Events.on(engine, "collisionActive", function(item){
//     let id = santa.id, santaHit = false;

//     item.pairs.forEach(p => {
//         if(p.bodyA.id == id || p.bodyB.id == id)
//             santaHit=true;
// });
//     console.log(santaHit)
// });

function setScore(diff) {
    SCORE += diff;
    let out = document.querySelector('#value');
    
    let text = '';
    for(let i=0;i<SCORE;i++)
        text += '🎅';
    out.innerText = text;
    
    if(SCORE == 5) {
        alert("Congratulation!");
        alert("You messed up santa!");
        alert("Merry Christmas and a Happy New Year!")
    }

    Body.setPosition(santa, {
        x: Math.random()*500+ 50,
        y: Math.random()*500+50,
    })    
}