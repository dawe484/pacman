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
let GAME_WIDTH = 608, //960
    GAME_HEIGHT = 800, //540
    TILE_SIZE = 32,
    RATIO = 4,
    SPEED = 2;
    
let renderer;
let stage, menuScene, gameScene;
let stats;

let id, btnStart;
let left, right, up, down;
let pacmanOpen, pacmanClose, dablik, lisak, pistolnik, princezna;

//set the game's current state to 'play'
let state = play;

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

  ////ON THE TOP OF OUR SCENE WE PUT A FPS COUNTER FROM MR.DOOB - stats.js ////
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  if (window.devicePixelRatio >= 2) {
    // loader.add("monster", "monster@2x.json");
  } else {
    loader
      .add([
        "assets/images/pacmanImages.json"//,
        //"js/highscore.json"
      ])
      .load(setup);
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
    
    //let json = PIXI.loader.;
    
    // Create 'menuScene'
    btnStart = new Sprite(id["button.png"]);

    menuScene.addChild(btnStart);
    
    setGameScene();
    
    stage.addChild(menuScene, gameScene);
    
    gameLoop();
  }
}

// Runs the current game 'state' in a loop and render the sprites
function gameLoop() {

  stats.begin();
  // monitored code goes here

  // Update the current game state:
  state();

  // Render the stage - Tell the 'renderer' to render the 'stage'
  renderer.render(stage);

  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  stats.end();
}

// All the game logic goes here
// This is your game loop, where you can move sprites and add your game logic
function play() {

  btnStart.click = btnStart.tap = () => {
    
  };
  
  //Capture the keyboard arrow keys, space key
  left = keyboard(37),
  up = keyboard(38),
  right = keyboard(39),
  down = keyboard(40),
    
  // Right arrow key `press` method
  right.press = () => {
    pacmanOpen.vy = 0;
    pacmanOpen.vx = SPEED;
  };

  // Left arrow key `press` method
  left.press = () => {
    pacmanOpen.vy = 0;
    pacmanOpen.vx = -SPEED;
  };

  // Up arrow key `press` method
  up.press = () => {
    pacmanOpen.vx = 0;
    pacmanOpen.vy = -SPEED;
  };
  
  // Down arrow key `press` method
  down.press = () => {
    pacmanOpen.vx = 0;
    pacmanOpen.vy = SPEED;
  };
  
  pacmanOpen.x += pacmanOpen.vx;
  pacmanOpen.y += pacmanOpen.vy;
  //console.log('x:', pacmanOpen.x, 'vx:', pacmanOpen.vx);
  
  //Check for a collision between the snowman and the game window
  contain(pacmanOpen, {x: TILE_SIZE, y: 3*TILE_SIZE+4, 
                       width: GAME_WIDTH-TILE_SIZE, height: GAME_HEIGHT-(2*TILE_SIZE)
                      });
  
  //Decide whether the game has been won or lost
  
  //Change the game `state` to `end` when the game is finsihed
  
}

//All the code that should run at the end of the game goes here
function end() {

}

function setGameScene() {
  // box around game scene
  let spacing = TILE_SIZE;
  // first line of boxes
  for (let i = 0; i < GAME_WIDTH/TILE_SIZE; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 2*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - 'y' line of boxes 1x6
  for (let i = 0; i < 6; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 0;
    box1.position.y = y + (3*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - group of boxes 2x2
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let box2 = new Sprite(id["krabice.png"]);
    box2.width = box2.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (2*TILE_SIZE);
    box1.position.y = 4*TILE_SIZE;
    box2.position.x = x + (2*TILE_SIZE);
    box2.position.y = 5*TILE_SIZE;
    gameScene.addChild(box1, box2);
  }
  // left - group of boxes 3x2
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let box2 = new Sprite(id["krabice.png"]);
    box2.width = box2.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (5*TILE_SIZE);
    box1.position.y = 4*TILE_SIZE;
    box2.position.x = x + (5*TILE_SIZE);
    box2.position.y = 5*TILE_SIZE;
    gameScene.addChild(box1, box2);
  }
  // boxes - 1x3 - middle axis 'y' line
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 9*TILE_SIZE;
    box1.position.y = y + (3*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - group of boxes 3x2
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let box2 = new Sprite(id["krabice.png"]);
    box2.width = box2.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (11*TILE_SIZE);
    box1.position.y = 4*TILE_SIZE;
    box2.position.x = x + (11*TILE_SIZE);
    box2.position.y = 5*TILE_SIZE;
    gameScene.addChild(box1, box2);
  }
  // right - group of boxes 2x2
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let box2 = new Sprite(id["krabice.png"]);
    box2.width = box2.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 4*TILE_SIZE;
    box2.position.x = x + (15*TILE_SIZE);
    box2.position.y = 5*TILE_SIZE;
    gameScene.addChild(box1, box2);
  }
  // right - 'y' line of boxes 1x6
  for (let i = 0; i < 6; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = GAME_WIDTH-TILE_SIZE;
    box1.position.y = y + (3*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 2x1
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (2*TILE_SIZE);
    box1.position.y = 7*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - line of boxes 1x5 - 'y' part of letter 'T' rotate left
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 5*TILE_SIZE;
    box1.position.y = y + (7*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 2x1 - 'x' part of letter 'T' rotate left
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (6*TILE_SIZE);
    box1.position.y = 9*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - line of boxes 5x1 - 'x' part of letter 'T'
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (7*TILE_SIZE);
    box1.position.y = 7*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - line of boxes 1x2 - 'y' part of letter 'T'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 9*TILE_SIZE;
    box1.position.y = y + (8*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - line of boxes 1x5 - 'y' part of letter 'T' rotate right
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 13*TILE_SIZE;
    box1.position.y = y + (7*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - line of boxes 2x1 - 'x' part of letter 'T' rotate right
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (11*TILE_SIZE);
    box1.position.y = 9*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 2x1
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 7*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 9*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 9*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - one box 1x1
  let box1 = new Sprite(id["krabice.png"]);
  box1.width = box1.height = TILE_SIZE;
  box1.position.x = 3*TILE_SIZE;
  box1.position.y = 10*TILE_SIZE;
  gameScene.addChild(box1);
  // right - one box 1x1
  let box2 = new Sprite(id["krabice.png"]);
  box2.width = box2.height = TILE_SIZE;
  box2.position.x = 15*TILE_SIZE;
  box2.position.y = 10*TILE_SIZE;
  gameScene.addChild(box2);
  // left - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 11*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - box for ghost - upper 'x' left line 2x1
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (7*TILE_SIZE);
    box1.position.y = 11*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - box for ghost - upper 'x' right line 2x1
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (10*TILE_SIZE);
    box1.position.y = 11*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - one left box 1x1
  let box3 = new Sprite(id["krabice.png"]);
  box3.width = box3.height = TILE_SIZE;
  box3.position.x = 7*TILE_SIZE;
  box3.position.y = 12*TILE_SIZE;
  gameScene.addChild(box3);
  // middle - one right box 1x1
  let box4 = new Sprite(id["krabice.png"]);
  box4.width = box4.height = TILE_SIZE;
  box4.position.x = 11*TILE_SIZE;
  box4.position.y = 12*TILE_SIZE;
  gameScene.addChild(box4);
  // middle - box for ghost - lower 'x' line 5x1
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (7*TILE_SIZE);
    box1.position.y = 13*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 11*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 13*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 13*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - one left box 1x1
  let box5 = new Sprite(id["krabice.png"]);
  box5.width = box5.height = TILE_SIZE;
  box5.position.x = 3*TILE_SIZE;
  box5.position.y = 14*TILE_SIZE;
  gameScene.addChild(box5);
  // right - one left box 1x1
  let box6 = new Sprite(id["krabice.png"]);
  box6.width = box6.height = TILE_SIZE;
  box6.position.x = 15*TILE_SIZE;
  box6.position.y = 14*TILE_SIZE;
  gameScene.addChild(box6);
  // left - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 15*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 4x1
  for (let i = 0; i < 4; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 15*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - 'y' line of boxes 1x3
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 5*TILE_SIZE;
    box1.position.y = y + (13*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - 'y' line of boxes 1x3
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 13*TILE_SIZE;
    box1.position.y = y + (13*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // middle - line of boxes 5x1 - 'x' part of letter 'T'
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (7*TILE_SIZE);
    box1.position.y = 15*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - line of boxes 1x2 - 'y' part of letter 'T'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 9*TILE_SIZE;
    box1.position.y = y + (16*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 2x1 - 'x' part of letter 'L'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (2*TILE_SIZE);
    box1.position.y = 17*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // left - line of boxes 1x2 - 'y' part of letter 'L'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 3*TILE_SIZE;
    box1.position.y = y + (18*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 3x1
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (5*TILE_SIZE);
    box1.position.y = 17*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 3x1
  for (let i = 0; i < 3; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (11*TILE_SIZE);
    box1.position.y = 17*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 2x1 - 'x' part of letter 'L'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (15*TILE_SIZE);
    box1.position.y = 17*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 1x2 - 'y' part of letter 'L'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 15*TILE_SIZE;
    box1.position.y = y + (18*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 1x7
  for (let i = 0; i < 7; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 0;
    box1.position.y = y + (16*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - one left box 1x1
  let box7 = new Sprite(id["krabice.png"]);
  box7.width = box7.height = TILE_SIZE;
  box7.position.x = TILE_SIZE;
  box7.position.y = 19*TILE_SIZE;
  gameScene.addChild(box7);
  // middle - line of boxes 5x1 - 'x' part of letter 'T'
  for (let i = 0; i < 5; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (7*TILE_SIZE);
    box1.position.y = 19*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // middle - line of boxes 1x2 - 'y' part of letter 'T'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 9*TILE_SIZE;
    box1.position.y = y + (20*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - one left box 1x1
  let box8 = new Sprite(id["krabice.png"]);
  box8.width = box8.height = TILE_SIZE;
  box8.position.x = 17*TILE_SIZE;
  box8.position.y = 19*TILE_SIZE;
  gameScene.addChild(box8);
  // right - line of boxes 1x7
  for (let i = 0; i < 7; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 18*TILE_SIZE;
    box1.position.y = y + (16*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 1x2 - 'y' part of upside down letter 'T'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 5*TILE_SIZE;
    box1.position.y = y + (19*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // left - line of boxes 6x1 - 'x' part of upside down letter 'T'
  for (let i = 0; i < 6; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (2*TILE_SIZE);
    box1.position.y = 21*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // right - line of boxes 1x2 - 'y' part upside down letter 'T'
  for (let i = 0; i < 2; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let y = spacing * i;
    box1.position.x = 13*TILE_SIZE;
    box1.position.y = y + (19*TILE_SIZE);
    gameScene.addChild(box1);
  }
  // right - line of boxes 6x1 - 'x' part of upside down letter 'T'
  for (let i = 0; i < 6; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x + (11*TILE_SIZE);
    box1.position.y = 21*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // last line of boxes
  for (let i = 0; i < GAME_WIDTH/TILE_SIZE; i++) {
    let box1 = new Sprite(id["krabice.png"]);
    box1.width = box1.height = TILE_SIZE;
    let x = spacing * i;
    box1.position.x = x;
    box1.position.y = 23*TILE_SIZE;
    gameScene.addChild(box1);
  }
  // one ice cube 1x1
  let box9 = new Sprite(id["ledova-kostka.png"]);
  box9.width = box9.height = TILE_SIZE;
  box9.position.x = 9*TILE_SIZE;
  box9.position.y = 11*TILE_SIZE;
  gameScene.addChild(box9);
  
  // Create font style
  let style = new PIXI.TextStyle({
    fontFamily: 'Consolas',
    fontSize: 28,
    fontWeight: 'bold',
    wordWrap: true,
    wordWrapWidth: 440,
    fill: "white"
  });

  let playerName = new PIXI.Text("1UP", style);
  let playerScore = new PIXI.Text("0000", style);
  let score = new PIXI.Text("SCORE", style);
  let scoreNumber = new PIXI.Text("0000", style);

  playerName.position.set(2*TILE_SIZE, 6);
  playerScore.position.set(2*TILE_SIZE, 32);
  score.position.set(GAME_WIDTH-2*TILE_SIZE-score.width, 6);
  scoreNumber.position.set(GAME_WIDTH-2*TILE_SIZE-scoreNumber.width, 32);
  
  pacmanOpen = new Sprite(id["pacman-open.png"]);
  pacmanOpen.width = pacmanOpen.width/RATIO;
  pacmanOpen.height = pacmanOpen.height/RATIO;
  pacmanOpen.position.set(9*TILE_SIZE+1, 18*TILE_SIZE+6);
  pacmanOpen.vx = 0;
  pacmanOpen.vy = 0;
  
  gameScene.addChild(playerName, playerScore, score, scoreNumber, pacmanOpen);
}

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
/* #GAME SCRIPTS END# */
