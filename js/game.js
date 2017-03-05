/*!
 * PACMAN
 * game.js - v0.0.2
 * Compiled Wed, 15 Feb 2017 21:03:23 UTC
 *
 * game.js is licensed under the IDONTKNOW License.
 *
*/

'use strict';
/* #GAME SCRIPTS START# */

//Aliases
let Container = PIXI.Container;
let autoDetectRenderer = PIXI.autoDetectRenderer;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let TextureCache = PIXI.utils.TextureCache;
let Sprite = PIXI.Sprite;

//Define a few globals here
const GAME_WIDTH = 608, //960
    GAME_HEIGHT = 800, //540
    TILE_SIZE = 32,
    OFFSET = 2,
    SPEED = 1,
    ORANGEBALLVALUE = 10;
    
let renderer;
let stage, menuScene, gameScene;
let stats;

let id, btnStart;
let left, right, up, down, esc;
var box, pinkBall, orangeBall, iceCube, dablik, lisak, pistolnik, princezna;

//set the game's current state to 'play'
let state = playing;

let level1 = [
  "bbbbbbbbbbbbbbbbbbb",
  "ba.......b.......ab",
  "b.bb.bbb.b.bbb.bb.b",
  "b.bb.bbb.b.bbb.bb.b",
  "b.................b",
  "b.bb.b.bbbbb.b.bb.b",
  "b....b...b...b....b",
  "bbbb.bbbnbnbbb.bbbb",
  "nnnb.bnnnnnnnb.bnnn",
  "bbbb.bnbb_bbnb.bbbb",
  "nnnn.nnbnnnbnn.nnnn",
  "bbbb.bnbbbbbnb.bbbb",
  "nnnb.bnnnnnnnb.bnnn",
  "bbbb.bnbbbbbnb.bbbb",
  "b........b........b",
  "b.bb.bbb.b.bbb.bb.b",
  "b..b.....n.....b..b",
  "bb.b.b.bbbbb.b.b.bb",
  "b....b...b...b....b",
  "b.bbbbbb.b.bbbbbb.b",
  "ba...............ab",
  "bbbbbbbbbbbbbbbbbbb"
]

let pacman, pacmanLife1, pacmanLife2;
let boxes = [], ghosts = [], orangeBalls = [], pinkBalls = [];
let moveRight = true, moveLeft = true, moveUp = true, moveDown = true;
let rightPressed = false, leftPressed = false, upPressed = false, downPressed = false;
let orientationX, orientationY, pacmanOrientationX, pacmanOrientationY;
let playerName, playerScore, playerNameText, playerScoreText;

let frames = ["pacman-open.png", "pacman-close.png"];;
let frameIndex, frameTime, delta, lasttime, currtime;
const FRAMERATE = 0.13;
let lifeCounter = 2;

// Init function
function init() {
  let rendererOptions = {
    antialias: false,
    transparent: false,
    resolution: window.devicePixelRatio
  };

  //Create a PIXI stage and renderer
  renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, rendererOptions);
  renderer.backgroundColor = 0x000000; //0x202020;

  if (renderer instanceof PIXI.CanvasRenderer) {
    console.log("Render: Canvas");
    console.log("Device pixel ratio:", window.devicePixelRatio);
  } else {
    console.log("Render: WebGL");
    console.log("Device pixel ratio:", window.devicePixelRatio);
  }

  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  //Create a container object called the 'stage'
  stage = new Container();

  resize();
  
  ////ON THE TOP OF OUR SCENE WE PUT A FPS COUNTER FROM MR.DOOB - stats.js ////
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  //Listen for and adapt to changes to the screen size user changing the window or rotating their device
  window.addEventListener("resize", resize);
  
  if (window.devicePixelRatio >= 2) {
    // loader.add("monster", "monster@2x.json");
  } else {
    loader
      .add([
        "assets/images/pacmanImages.json"//,
      ])
      .load(setup);
  }

  function resize() {
    let ratio = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    stage.scale.x = stage.scale.y = ratio;
    renderer.resize(Math.ceil(GAME_WIDTH * ratio),Math.ceil(GAME_HEIGHT * ratio));
  }
  
  //This 'setup' function will run when the image has loaded
  //Create your game objects here
  function setup() {
    console.log("All files loaded");

    //Create the `menuScene` group
    menuScene = new Container();
    gameScene = new Container();
    
    menuScene.visible = false;
        
    id = PIXI.loader.resources["assets/images/pacmanImages.json"].textures;
        
    // Create 'menuScene'
    btnStart = new Sprite(id["button.png"]);

    menuScene.addChild(btnStart);
    
    //console.log(level1.length)
    for (let i = 0; i < level1.length; i++) {
      //console.log(level1[i]);
      //console.log(level1[i].length);
      for (let c = 0; c < level1[i].length; c++) {
        //console.log(level1[i][c])
        if (level1[i][c] == 'b') {
          box = new Sprite(id["krabice.png"]);
          box.anchor.x = 0.5;
          box.anchor.y = 0.5;
          box.position.x = c * TILE_SIZE + TILE_SIZE/2;
          box.position.y = i * TILE_SIZE + (2*TILE_SIZE) + TILE_SIZE/2;
          gameScene.addChild(box);
          boxes.push(box);
        }
        if (level1[i][c] == 'a') {
          pinkBall = new Sprite(id["pink-ball.png"]);
          pinkBall.anchor.x = 0.5;
          pinkBall.anchor.y = 0.5;
          pinkBall.position.x = c * TILE_SIZE + TILE_SIZE/2;
          pinkBall.position.y = i * TILE_SIZE + (2*TILE_SIZE) + TILE_SIZE/2;
          gameScene.addChild(pinkBall);
          pinkBalls.push(pinkBall);
        }
        if (level1[i][c] == '.') {
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.anchor.x = 0.5;
          orangeBall.anchor.y = 0.5;
          orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2;
          orangeBall.position.y = i * TILE_SIZE + (2*TILE_SIZE) + TILE_SIZE/2;
          gameScene.addChild(orangeBall);
          orangeBalls.push(orangeBall);
        }
        if (level1[i][c] == '_') {
          iceCube = new Sprite(id["ledova-kostka.png"]);
          iceCube.anchor.x = 0.5;
          iceCube.anchor.y = 0.5;
          iceCube.position.x = c * TILE_SIZE + TILE_SIZE/2;
          iceCube.position.y = i * TILE_SIZE + (2*TILE_SIZE) + TILE_SIZE/2;
          gameScene.addChild(iceCube);
        }
      }
    }
    
    console.log(orangeBalls.length);
    console.log(orangeBalls);
    console.log(orangeBalls.pop());
    
    frameIndex = 0;
    
    // Create pacman
    pacman = new Sprite(id[frames[frameIndex]]);
    frameTime = FRAMERATE;
    pacman.anchor.set(0.5);
    pacman.position.set(9*TILE_SIZE + TILE_SIZE/2, 18*TILE_SIZE + TILE_SIZE/2);
    pacman.vx = 0;
    pacman.vy = 0;
    pacmanOrientationX = pacman.scale.x = 1;
    pacmanOrientationY = pacman.scale.y = 1;
    
    // Create the red ghost called 'Dablik'
    dablik = new Sprite(id["dablik.png"]);
    dablik.anchor.set(0.5);
    dablik.position.set(9*TILE_SIZE + TILE_SIZE/2, 10*TILE_SIZE + TILE_SIZE/2);
    dablik.vx = 0;
    dablik.vy = 0;
    ghosts.push(dablik);
    
    // Create the blue ghost called 'Pistolnik'
    pistolnik = new Sprite(id["pistolnik.png"]);
    pistolnik.anchor.set(0.5);
    pistolnik.position.set(8*TILE_SIZE + TILE_SIZE/2, 12*TILE_SIZE + TILE_SIZE/2);
    pistolnik.vx = 0;
    pistolnik.vy = 0;
    ghosts.push(pistolnik);
    
    // Create the blue ghost called 'Princezna'
    princezna = new Sprite(id["princezna.png"]);
    princezna.anchor.set(0.5);
    princezna.position.set(9*TILE_SIZE + TILE_SIZE/2, 12*TILE_SIZE + TILE_SIZE/2);
    princezna.vx = 0;
    princezna.vy = 0;
    ghosts.push(princezna);
    
    // Create the blue ghost called 'Lisak'
    lisak = new Sprite(id["lisak.png"]);
    lisak.anchor.set(0.5);
    lisak.position.set(10*TILE_SIZE + TILE_SIZE/2, 12*TILE_SIZE + TILE_SIZE/2);
    lisak.vx = 0;
    lisak.vy = 0;
    ghosts.push(lisak);
    
    // Create pacman first life icon
    pacmanLife1 = new Sprite(id["pacman-open.png"]);
    pacmanLife1.anchor.set(0.5);
    pacmanLife1.position.set(TILE_SIZE + TILE_SIZE/2, 24*TILE_SIZE + TILE_SIZE/2);
    
    // Create pacman second life icon
    pacmanLife2 = new Sprite(id["pacman-open.png"]);
    pacmanLife2.anchor.set(0.5);
    pacmanLife2.position.set(2*TILE_SIZE + TILE_SIZE/2, 24*TILE_SIZE + TILE_SIZE/2);
    
    // Create font style
    let style = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 28,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 440,
      fill: "white"
    });

    playerNameText = new PIXI.Text("1UP", style);
    playerScore = 0;
    playerScoreText = new PIXI.Text(playerScore.toString(), style);
    //let score = new PIXI.Text("SCORE", style);
    //let scoreNumber = new PIXI.Text("0000", style);

    playerNameText.position.set(2*TILE_SIZE, 6);
    playerScoreText.position.set(2*TILE_SIZE, 32);
    //score.position.set(GAME_WIDTH-2*TILE_SIZE-score.width, 6);
    //scoreNumber.position.set(GAME_WIDTH-2*TILE_SIZE-scoreNumber.width, 32);
    
    gameScene.addChild(pacman, dablik, pistolnik, princezna, lisak, pacmanLife1, pacmanLife2, playerNameText, playerScoreText);
    
    stage.addChild(menuScene, gameScene);
    
    //Move the pacman
    //Capture the keyboard arrow keys, space key
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    esc = keyboard(27);

    // Right arrow key `press` method
    right.press = () => {
      pacman.vx = SPEED;
      pacman.vy = 0;
      rightPressed = true;
      if (rightPressed) {
        leftPressed = false;
        if (pacmanOrientationX < 0) {
          pacmanOrientationX = pacman.scale.x *= -1;
        }
      }
      if (upPressed && rightPressed) {
        upPressed = false;
        pacman.rotation = 0;
      }
      if (downPressed && rightPressed) {
        downPressed = false;
        pacman.rotation = 0;
      }
    }

    // Left arrow key `press` method
    left.press = () => {
      pacman.vx = -SPEED;
      pacman.vy = 0;
      leftPressed = true;
      if (leftPressed) {
        rightPressed = false;
        if (pacmanOrientationX > 0) {
          pacmanOrientationX = pacman.scale.x *= -1;
        }
      }
      if (upPressed && leftPressed) {
        upPressed = false;
        pacman.rotation = 0;
      }
      if (downPressed && leftPressed) {
        downPressed = false;
        pacman.rotation = 0;
      }
    }
    
    // Up arrow key `press` method
    up.press = () => {
      pacman.vx = 0;
      pacman.vy = -SPEED;
      upPressed = true;
      if (upPressed && rightPressed) {
        rightPressed = false;
        pacman.rotation = -1.55;
      }
      if (upPressed && leftPressed) {
        leftPressed = false;
        pacman.rotation = 1.55;
      }
      if (upPressed && downPressed) {
        downPressed = false;
        //pacman.rotation = -1.62;
        pacmanOrientationX = pacman.scale.x *= -1;
      }
    }

    // Down arrow key `press` method
    down.press = () => {
      pacman.vx = 0;
      pacman.vy = SPEED;
      downPressed = true;
      if (downPressed && rightPressed) {
        rightPressed = false;
        pacman.rotation = 1.55;
      }
      if (downPressed && leftPressed) {
        leftPressed = false;
        pacman.rotation = -1.55;
      }
      if (downPressed && upPressed) {
        upPressed = false;
        //pacman.rotation = 1.62;
        pacmanOrientationX = pacman.scale.x *= -1;
      }
    }

    // ESC key `press` method
    esc.press = () => {
      pacman.vx = 0;
      pacman.vy = 0;
    }
    
    lasttime = new Date().getTime();
    gameLoop();
  }
}

// Runs the current game 'state' in a loop and render the sprites
function gameLoop() {

  stats.begin();
  // monitored code goes here

  // Update the current game state:
  state();

  // Determine seconds elapsed since last frame
  currtime = new Date().getTime();
  delta = (currtime-lasttime)/1000;
  //console.log(delta);
  
  // Animate pacman
  frameTime -= delta;
  //console.log('frametime',frameTime);
  if (frameTime <= 0) {
    frameIndex++;
    if (frameIndex >= frames.length) {
      frameIndex = 0;
    }
    pacman.texture = PIXI.Texture.fromFrame(frames[frameIndex]);
    frameTime = FRAMERATE;
  }
  
  // Render the stage - Tell the 'renderer' to render the 'stage'
  renderer.render(stage);

  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  
  lasttime = currtime;

  stats.end();
}

// All the game logic goes here
// This is your game loop, where you can move sprites and add your game logic
function playing() {

//  pacmanOpen.x += pacmanOpen.vx;
//  pacmanOpen.y += pacmanOpen.vy;
  pacman.x += pacman.vx;
  pacman.y += pacman.vy;
  
  let pacmanHitBox = false;
  let pacmanHitOrangeBall = false;
  let pacmanHitPinkBall = false;
  let pacmanHitGhost = false;
  
  //Move the ghosts
    
//  //Check for a collision between the pacman and the boxes
//  boxes.forEach( (box) => {
//    
//    if (hitTestRectangle(pacmanOpen, box)) {
//      pacmanHitBox = true;
//    }
//    
//    if (pacmanHitBox) {
//      pacmanHitBox = false;
//      pacmanOpen.vx = 0;
//      pacmanOpen.vy = 0;
//      
//      if (rightPressed) {
//        rightPressed = false;
////        moveRight = false;
////        moveLeft = true;
////        moveUp = true;
////        moveDown = true;
//        pacmanOpen.x -= OFFSET;
//      }
//      
//      if (leftPressed) {
//        leftPressed = false;
////        moveRight = true;
////        moveLeft = false;
////        moveUp = true;
////        moveDown = true;
//        pacmanOpen.x += OFFSET;
//      }
//      
//      if (upPressed) {
//        upPressed = false;
////        moveRight = true;
////        moveLeft = true;
////        moveUp = false;
////        moveDown = true;
//        pacmanOpen.y += OFFSET;
//      }
//      
//      if (downPressed) {
//        downPressed = false;
////        moveRight = true;
////        moveLeft = true;
////        moveUp = true;
////        moveDown = false;
//        pacmanOpen.y -= OFFSET;
//      }
//    }
//  });
  
  //Check for a collision between the ghosts and the boxes
  
  //Check for a collision between the ghost and the pacman
  ghosts.forEach( (ghost) => {
    if (hitTestRectangle(pacman, ghost)) {
      pacmanHitGhost = true;
    }
    
    if (pacmanHitGhost) {
      pacmanHitGhost = false;
      if (lifeCounter === 2) {
        gameScene.removeChild(pacmanLife2);
        lifeCounter -= 1;
      }
      if (lifeCounter === 1) {
        gameScene.removeChild(pacmanLife1);
        lifeCounter -= 1;
      }
      // mizi zivoty naraz, udelat jako s orangeBall
    }
    
  });
    
  //Check for a collision between the balls and the pacman
  orangeBalls.forEach( (orangeBall) => {
    
    if (hitTestRectangle(pacman, orangeBall)) {
      //console.log('orange ball');
      pacmanHitOrangeBall = true;
      //console.log(pacmanHitOrangeBall);
    }
    
    if (pacmanHitOrangeBall) {
      pacmanHitOrangeBall = false;
      gameScene.removeChild(orangeBall);
      let i = orangeBalls.indexOf(orangeBall);
      //console.log(i);
      if (i != -1) {
        stage.removeChild(playerScoreText)
        orangeBalls.splice(i, 1);
        playerScore += ORANGEBALLVALUE;
        //console.log(playerScore);
        playerScoreText.text = playerScore;
      }
    }  
  });
  
  pinkBalls.forEach( (pinkBall) => {
    
    if (hitTestRectangle(pacman, pinkBall)) {
      pacmanHitPinkBall = true;
    }
    
    if (pacmanHitPinkBall) {
      pacmanHitPinkBall = false;
      gameScene.removeChild(pinkBall);
    }
  });
  
  //Decide whether the game has been won or lost
  
  //Change the game `state` to `end` when the game is finsihed
  
}

//All the code that should run at the end of the game goes here
function end() {

}

/* Helper functions */

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

//The `contain` function
function contain(sprite, container) {
  var collision = undefined;
  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  //Return the `collision` value
  return collision;
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
  //console.log(combinedHalfWidths, combinedHalfHeights);

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //console.log('combinedHalfWidths', Math.abs(vx))
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //console.log('combinedHalfHeights', Math.abs(vy))
      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}
/* #GAME SCRIPTS END# */
