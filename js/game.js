/*
 * PACMAN - author: David Krénar
 * sound source: http://www.classicgaming.cc/\nclassics/pac-man/sounds
 * sprite source: ghosts - http://opengameart.org/content/ghosts
 *                box, balls - http://opengameart.org/content/winter-platformer-game-tileset
 */

'use strict';
/* #GAME SCRIPTS START# */

//Aliases
const Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Text = PIXI.Text,
      TextStyle = PIXI.TextStyle;

//Define a few globals here
const GAME_WIDTH = 608,
      GAME_HEIGHT = 800,
      TILE_SIZE = 32,
      OFFSET = 1,
      PACMAN_OFFSET = 2,
      GHOST_SPEED = 1,
      GHOST_VALUE = 200,
      ORANGEBALL_VALUE = 10,
      PINKBALL_VALUE = 50;

const level0 = [
  "bbbbbbbbbbbb",
  "b..........b",
  "bbbbbbbbbbbb"
];

const level1 = [
  "bbbbbbbbbbbbbbbbbbb", //19 - original 28
  "ba..v...vbv...v..ab",
  "b.bb.bbb.b.bbb.bb.b",
  "b.bb.bbb.b.bbb.bb.b",
  "bv..v.vav.v.vav..vb",
  "b.bb.b.bbbbb.b.bb.b",
  "bv.avbv.vbv.vbv..vb",
  "bbbb.bbbnbnbbb.bbbb",
  "nnnb.bwnayanwbabnnn",
  "bbbb.bnbb_bbnb.bbbb",
  "nnnnvnwbnnnbwnvnnnn",
  "bbbb.bnbbbbbnb.bbbb",
  "nnnbabwnnnnnwb.bnnn",
  "bbbb.bnbbbbbnbabbbb",
  "bv..v.v.vbv.v.v..vb",
  "babb.bbb.babbb.bb.b",
  "bvvbv.v.vnv.v.vbvvb",
  "bb.b.babbbbb.bab.bb",
  "bvv.vbv.vbv.vbv.vvb",
  "b.bbbbbb.b.bbbbbb.b",
  "ba......v.v......ab",
  "bbbbbbbbbbbbbbbbbbb"
    //25 - original 36 (most of these tiles are not accessible to Pac-Man or the ghosts)
];

let SPEED = 1;

let renderer, stage, menuScene, gameScene, gameOverScene, helpScene, stats, id, style, styleTitle;

let pacmanTitle, pacmanMenu, btnStart, btnStartOver, btnHelp, btnHelpOver, btnMusic, btnMusicOver, 
    btnMusicDisabled, btnMusicOverDisabled, btnSound, btnSoundOver, btnSoundDisabled, 
    btnSoundOverDisabled, btnClose, btnCloseOver, btnPlay, btnPlayOver, restartGameTooltip;
let left, right, up, down, esc;
let pacman, pacmanLife1, pacmanLife2, box, pinkBall, orangeBall, iceCube, devil, fox, cowboy, princess,
    yellowCube, greenCube;

//set the game's current state to 'menu'
let state = playing;

let orangeBallsMenu = [], boxes = [], ghosts = [], orangeBalls = [], pinkBalls = [], yellowCubes = [], greenCubes = [];
//let moveRight = true, moveLeft = true, moveUp = true, moveDown = true;
let rightPressed = false, leftPressed = false, upPressed = false, downPressed = false;
let orientationX, pacmanOrientationX;
let playerName, playerScore, playerNameText, playerScoreText, message, playMessage;

const frames = ["pacman-open.png", "pacman-close.png"];
let frameIndex, frameTime, delta, lasttime, currtime;
const FRAMERATE = 0.13;
let lifeCounter = 0;

let moves = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

let direction, path;

// Audio
let musicPacmanBeginning, soundPacmanMunch, soundPacmanIntermission, soundPacmanEatGhost, soundPacmanDeath;

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

  if (window.innerHeight <= GAME_HEIGHT) {
    resize();
  }
  
  ////ON THE TOP OF OUR SCENE WE PUT A FPS COUNTER FROM MR.DOOB - stats.js ////
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  //Listen for and adapt to changes to the screen size user changing the window or rotating their device
//  window.addEventListener("resize", resize);
  
  if (window.devicePixelRatio >= 4) {
    // loader.add("monster", "monster@2x.json");
  } else {
    loader
      .add([
        "assets/images/pacmanImages.json"
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
    
    // Initialize sounds here
    // music in game menu
    musicPacmanBeginning = new Howl({
      src: ['./assets/audio/pacman_beginning.wav'],
      //autoplay: true,
      volume: 0.2,
      loop: true
    });
    
    // sound when pacman eat a ball
    soundPacmanMunch = new Howl({
      src: ['./assets/audio/pacman_chomp.wav'],
      rate: 1.2,
      volume: 0.1
    });
    
    // sound when pacman hit a ghost and die
    soundPacmanDeath = new Howl({
      src: ['./assets/audio/pacman_death.wav'],
      volume: 0.2
    });
    
    // sound when pacman hit a ghost and eat him
    soundPacmanEatGhost = new Howl({
      src: ['./assets/audio/pacman_eatghost.wav'],
      volume: 0.2
    });
    
    // sound when pacman eat big pink ball
    soundPacmanIntermission = new Howl({
      src: ['./assets/audio/pacman_intermission.wav'],
      volume: 0.2
    });
    
    menuScene = new Container();
    gameScene = new Container();
    gameOverScene = new Container();
    helpScene = new Container();
    
    menuScene.visible = true;
    gameScene.visible = false;
    gameOverScene.visible = false;
    helpScene.visible = false;
    
    //Play the sound in 'menuScene'
    //musicPacmanBeginning.play();
    
    id = PIXI.loader.resources["assets/images/pacmanImages.json"].textures;
    
    // Create font style
    style = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 28,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 440,
      fill: "white"
    });
    
    styleTitle = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 52,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 440,
      fill: "#ffcc00"
    });
    
    // Create 'menuScene'
    pacmanTitle = new PIXI.Text("PACMAN 2017", styleTitle);
    //pacmanTitle.anchor.set(0.5);
    pacmanTitle.position.set(GAME_WIDTH/2-pacmanTitle.width/2, 7*TILE_SIZE);
    
    btnStartOver = new Sprite(id["button_over.png"]);
    //btnStartOver.anchor.set(0.5);
    btnStartOver.position.set(GAME_WIDTH/2-btnStartOver.width/2, GAME_HEIGHT - 7*TILE_SIZE);
    btnStartOver.interactive = true;
    btnStartOver.buttonMode = true;
    btnStartOver.visible = false;
    
    btnStart = new Sprite(id["button.png"]);
    //btnStart.anchor.set(0.5);
    btnStart.position.set(GAME_WIDTH/2-btnStart.width/2, GAME_HEIGHT - 7*TILE_SIZE);
    btnStart.interactive = true;
    btnStart.buttonMode = true;
    btnStart.mouseover = function onButtonOver() {
      let overStyle = new PIXI.TextStyle({
        fontFamily: 'Consolas',
        fontSize: 28,
        fontWeight: 'bold',
        wordWrap: true,
        wordWrapWidth: 440,
        fill: "#ffcc00"
      });
      btnStartOver.visible = true;
      btnStart.visible = false;
      playMessage.setStyle(overStyle);
    };
    
    btnStartOver.mouseout = function onButtonOut() {
      btnStartOver.visible = false;
      btnStart.visible = true;
      playMessage.setStyle(style);
    };
    
    btnStartOver.click = function onButtonClick() {
      state = playing;
      pacman.vx = 0;
      pacman.vy = 0;
    }
    
    playMessage = new PIXI.Text("PLAY", style);
    //playMessage.anchor.set(0.5);
    playMessage.position.set(GAME_WIDTH/2-playMessage.width/2, GAME_HEIGHT - 7*TILE_SIZE+10);

    btnHelpOver = new Sprite(id["questionMark_over.png"]);
    //btnHelpOver.anchor.set(0.5);
    btnHelpOver.position.set(GAME_WIDTH - 2*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHelpOver.interactive = true;
    btnHelpOver.buttonMode = true;
    btnHelpOver.visible = false;
    
    btnHelp = new Sprite(id["questionMark.png"]);
    //btnHelp.anchor.set(0.5);
    btnHelp.position.set(GAME_WIDTH - 2*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHelp.interactive = true;
    btnHelp.buttonMode = true;
    
    btnHelp.mouseover = function onButtonOver() {
      btnHelpOver.visible = true;
      btnHelp.visible = false;
    };
    
    btnHelpOver.mouseout = function onButtonOut() {
      btnHelpOver.visible = false;
      btnHelp.visible = true;
    };
    
    btnHelpOver.click = function onButtonClick() {
      state = help;
    }
    
    btnMusicOverDisabled = new Sprite(id["music_over_disabled.png"]);
    //btnMusicOverDisabled.anchor.set(0.5);
    btnMusicOverDisabled.position.set(GAME_WIDTH - 4*TILE_SIZE-2, GAME_HEIGHT - 3*TILE_SIZE-0.5);
    btnMusicOverDisabled.interactive = true;
    btnMusicOverDisabled.buttonMode = true;
    btnMusicOverDisabled.visible = false;
    
    btnMusicDisabled = new Sprite(id["music_disabled.png"]);
    //btnMusicDisabled.anchor.set(0.5);
    btnMusicDisabled.position.set(GAME_WIDTH - 4*TILE_SIZE-2, GAME_HEIGHT - 3*TILE_SIZE-0.5);
    btnMusicDisabled.interactive = true;
    btnMusicDisabled.buttonMode = true;
    btnMusicDisabled.visible = false;
    
    btnMusicOver = new Sprite(id["music_over.png"]);
    //btnMusicOver.anchor.set(0.5);
    btnMusicOver.position.set(GAME_WIDTH - 4*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnMusicOver.interactive = true;
    btnMusicOver.buttonMode = true;
    btnMusicOver.visible = false;
    
    btnMusic = new Sprite(id["music.png"]);
    //btnMusic.anchor.set(0.5);
    btnMusic.position.set(GAME_WIDTH - 4*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnMusic.interactive = true;
    btnMusic.buttonMode = true;
    //btnMusic.visible = false;
    
    btnMusic.mouseover = function onButtonOver() {
      btnMusicOver.visible = true;
      btnMusic.visible = false;
    };
    
    btnMusicOver.mouseout = function onButtonOut() {
      btnMusicOver.visible = false;
      btnMusic.visible = true;
    };
    
    btnMusicDisabled.mouseover = function onButtonOverDisable() {
      btnMusicOverDisabled.visible = true;
      btnMusicDisabled.visible = false;
    };
    
    btnMusicOverDisabled.mouseout = function onButtonOutDisable() {
      btnMusicOverDisabled.visible = false;
      btnMusicDisabled.visible = true;
    };
    
    btnMusicOver.click = function onButtonClick() {
      if (musicPacmanBeginning.playing()) {
        musicPacmanBeginning.stop();
        btnMusicOver.visible = false;
        btnMusicOverDisabled.visible = true;
      }
    };
    
    btnMusicOverDisabled.click = function onButtonClick() {
      if (musicPacmanBeginning.playing() == false) {
        musicPacmanBeginning.play();
        btnMusicOverDisabled.visible = false;
        btnMusicOver.visible = true;
      }
    };
    
    btnSoundOverDisabled = new Sprite(id["sound_over_disabled.png"]);
    //btnSoundOverDisabled.anchor.set(0.5);
    btnSoundOverDisabled.position.set(GAME_WIDTH - 6*TILE_SIZE-2.5, GAME_HEIGHT - 3*TILE_SIZE-1);
    btnSoundOverDisabled.interactive = true;
    btnSoundOverDisabled.buttonMode = true;
    btnSoundOverDisabled.visible = false;
    
    btnSoundDisabled = new Sprite(id["sound_disabled.png"]);
    //btnSoundDisabled.anchor.set(0.5);
    btnSoundDisabled.position.set(GAME_WIDTH - 6*TILE_SIZE-2.5, GAME_HEIGHT - 3*TILE_SIZE-1);
    btnSoundDisabled.interactive = true;
    btnSoundDisabled.buttonMode = true;
    btnSoundDisabled.visible = false;
    
    btnSoundDisabled.mouseover = function onButtonOver() {
      btnSoundOverDisabled.visible = true;
      btnSoundDisabled.visible = false;
    };
    
    btnSoundOverDisabled.mouseout = function onButtonOut() {
      btnSoundOverDisabled.visible = false;
      btnSoundDisabled.visible = true;
    };
    
    btnSoundOver = new Sprite(id["sound_over.png"]);
    //btnSoundOver.anchor.set(0.5);
    btnSoundOver.position.set(GAME_WIDTH - 6*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSoundOver.interactive = true;
    btnSoundOver.buttonMode = true;
    btnSoundOver.visible = false;
    
    btnSound = new Sprite(id["sound.png"]);
    //btnSound.anchor.set(0.5);
    btnSound.position.set(GAME_WIDTH - 6*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSound.interactive = true;
    btnSound.buttonMode = true;
    
    btnSound.mouseover = function onButtonOver() {
      btnSoundOver.visible = true;
      btnSound.visible = false;
    };
    
    btnSoundOver.mouseout = function onButtonOut() {
      btnSoundOver.visible = false;
      btnSound.visible = true;
    };
    
    btnSoundOver.click = function onButtonClick() {
      //if (musicPacmanBeginning.playing()) {
        //musicPacmanBeginning.stop();
        btnSoundOver.visible = false;
        btnSoundOverDisabled.visible = true;
      //}
    };
    
    btnSoundOverDisabled.click = function onButtonClick() {
      //if (musicPacmanBeginning.playing() == false) {
        //musicPacmanBeginning.play();
        btnSoundOverDisabled.visible = false;
        btnSoundOver.visible = true;
      //}
    };
    
    for (let i = 0; i < level0.length; i++) {
      for (let c = 0; c < level0[i].length; c++) {
        if (level0[i][c] == 'b') {
          box = new Sprite(id["krabice.png"]);
          //box.anchor.set(0.5);
          box.position.x = c * TILE_SIZE + 4*TILE_SIZE-TILE_SIZE/2;
          box.position.y = i * TILE_SIZE + 10*TILE_SIZE+TILE_SIZE/2;
          menuScene.addChild(box);
          //console.log(box.position.x, box.position.y)
        }
        if (level0[i][c] == '.') {
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.position.x = c * TILE_SIZE + 4*TILE_SIZE-orangeBall.width/2;
          orangeBall.position.y = i * TILE_SIZE + 11*TILE_SIZE-orangeBall.width/2;
          //orangeBall.anchor.set(0.5);
          orangeBallsMenu.push(orangeBall);
          menuScene.addChild(orangeBall);
        }
      }
    }
    
    frameIndex = 0;
    
    // Create pacman
    pacmanMenu = new Sprite(id[frames[frameIndex]]);
    frameTime = FRAMERATE;
    pacmanMenu.anchor.set(0.5);
    pacmanMenu.position.set(5*TILE_SIZE, 12*TILE_SIZE); //x+2, y+3
    pacmanMenu.vx = SPEED;
    //pacmanMenu.vy = 0;
    pacmanMenu.scale.set(1)
    //pacmanOrientationX = pacmanMenu.scale.x = 1;
    
    menuScene.addChild(pacmanTitle, btnStart, btnStartOver, playMessage, btnHelp, btnHelpOver, btnMusic, btnMusicOver, 
                       btnMusicDisabled, btnMusicOverDisabled, btnSound, btnSoundOver, btnSoundDisabled, 
                       btnSoundOverDisabled, pacmanMenu);
    //End 'menuScene'
    
    // Create 'helpScene'
    btnCloseOver = new Sprite(id["close_over.png"]);
    //btnCloseOver.anchor.set(0.5);
    btnCloseOver.position.set(GAME_WIDTH - 2*TILE_SIZE, 3*TILE_SIZE);
    btnCloseOver.interactive = true;
    btnCloseOver.buttonMode = true;
    btnCloseOver.visible = false;
    
    btnClose = new Sprite(id["close.png"]);
    //btnClose.anchor.set(0.5);
    btnClose.position.set(GAME_WIDTH - 2*TILE_SIZE, 3*TILE_SIZE);
    btnClose.interactive = true;
    btnClose.buttonMode = true;
    btnClose.mouseover = function onButtonOver() {
      btnCloseOver.visible = true;
      btnClose.visible = false;
    };
    
    btnCloseOver.mouseout = function onButtonOut() {
      btnCloseOver.visible = false;
      btnClose.visible = true;
    };
    
    btnCloseOver.click = function onButtonClick() {
      state = menu;
    }
    
    let helpTitle = new PIXI.Text("School project to subject 'Innovation Course for the IT Specialists'", style);
    helpTitle.position.set(2*TILE_SIZE, 4*TILE_SIZE);
    
    let helpAuthor = new PIXI.Text("Author: David Krénar", style);
    helpAuthor.position.set(2*TILE_SIZE, 8*TILE_SIZE);
    
    let helpSources = new PIXI.Text("Sources:", style);
    helpSources.position.set(2*TILE_SIZE, 10*TILE_SIZE);
    
    let helpSourcesSound = new PIXI.Text("Sound: http://www.classicgaming.cc/\nclassics/pac-man/sounds", style);
    helpSourcesSound.position.set(3*TILE_SIZE, 11*TILE_SIZE);
    
    let helpSourcesImage = new PIXI.Text("Image: http://opengameart.org/content/\nghosts\nhttp://opengameart.org/content/\nwinter-platformer-game-tileset", style);
    helpSourcesImage.position.set(3*TILE_SIZE, 14*TILE_SIZE);
    
    helpScene.addChild(btnClose, btnCloseOver, helpTitle, helpAuthor, helpSources, helpSourcesSound, helpSourcesImage);
    // End 'helpScene'
    
    // Create 'gameScene'
    for (let i = 0; i < level1.length; i++) {
      for (let c = 0; c < level1[i].length; c++) {
        if (level1[i][c] == 'b') {
          box = new Sprite(id["krabice.png"]);
          box.position.x = c * TILE_SIZE;
          box.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          gameScene.addChild(box);
          boxes.push(box);
        }
        if (level1[i][c] == 'a') {
          greenCube = new Sprite(id["green_cube.png"]);
          greenCube.position.x = c * TILE_SIZE;
          greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          greenCubes.push(greenCube);
          pinkBall = new Sprite(id["pink-ball.png"]);
          pinkBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - pinkBall.width/2;
          pinkBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - pinkBall.height/2;
          gameScene.addChild(greenCube, pinkBall);
          pinkBalls.push(pinkBall);
        }
        if (level1[i][c] == 'y') {
          yellowCube = new Sprite(id["yellow_cube.png"]);
          yellowCube.position.x = c * TILE_SIZE;
          yellowCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          gameScene.addChild(yellowCube);
          yellowCubes.push(yellowCube);
        }
        if (level1[i][c] == 'x') {
          yellowCube = new Sprite(id["yellow_cube.png"]);
          yellowCube.position.x = c * TILE_SIZE;
          yellowCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
          orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
          orangeBalls.push(orangeBall);
          gameScene.addChild(yellowCube, orangeBall);
        }
        if (level1[i][c] == '.') {
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
          orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
          gameScene.addChild(orangeBall);
          orangeBalls.push(orangeBall);
        }
        if (level1[i][c] == 'v') {
          greenCube = new Sprite(id["green_cube.png"]);
          greenCube.position.x = c * TILE_SIZE;
          greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          greenCubes.push(greenCube);
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
          orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
          orangeBalls.push(orangeBall);
          gameScene.addChild(greenCube, orangeBall);
        }
        if (level1[i][c] == 'w') {
          greenCube = new Sprite(id["green_cube.png"]);
          greenCube.position.x = c * TILE_SIZE;
          greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          gameScene.addChild(greenCube);
          greenCubes.push(greenCube);
        }
        if (level1[i][c] == '_') {
          iceCube = new Sprite(id["krabice.png"]);
          iceCube.position.x = c * TILE_SIZE;
          iceCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
          gameScene.addChild(iceCube);
          boxes.push(iceCube);
          iceCube.visible = false;
        }
      }
    }
        
    frameIndex = 0;
    
    // Create pacman
    pacman = new Sprite(id[frames[frameIndex]]);
    frameTime = FRAMERATE;
    pacman.position.set(9*TILE_SIZE+3, 18*TILE_SIZE+3);
    pacman.vx = 0;
    pacman.vy = 0;
    pacman.scale.set(0.8);
    pacman.eatGhost = false;
    //pacmanOrientationX = pacman.scale.x = 0.8;
    
    // Create the red ghost called 'devil'
    devil = new Sprite(id["dablik.png"]);
    devil.position.set(9*TILE_SIZE, 10*TILE_SIZE);
    devil.vx = -GHOST_SPEED;
    devil.vy = 0;
    devil.path = moves.LEFT;
    ghosts.push(devil);
    
    // Create the blue ghost called 'princess'
    princess = new Sprite(id["princezna.png"]);
    princess.position.set(9*TILE_SIZE, 12*TILE_SIZE);
    princess.vx = -GHOST_SPEED;
    princess.vy = 0;
    princess.path = moves.LEFT;
    ghosts.push(princess);
    
    // Create the blue ghost called 'cowboy'
    cowboy = new Sprite(id["pistolnik.png"]);
    cowboy.position.set(8*TILE_SIZE, 12*TILE_SIZE);
    cowboy.vx = -GHOST_SPEED;
    cowboy.vy = 0;
    cowboy.path = moves.LEFT;
    ghosts.push(cowboy);
    
    // Create the blue ghost called 'fox'
    fox = new Sprite(id["lisak.png"]);
    fox.position.set(10*TILE_SIZE, 12*TILE_SIZE);
    fox.vx = -GHOST_SPEED;
    fox.vy = 0;
    fox.path = moves.LEFT;
    ghosts.push(fox);
    
    // Create pacman first life icon
    pacmanLife1 = new Sprite(id["pacman-open.png"]);
    pacmanLife1.position.set(TILE_SIZE, 24*TILE_SIZE+3);
    pacmanLife1.scale.set(0.8);
    
    // Create pacman second life icon
    pacmanLife2 = new Sprite(id["pacman-open.png"]);
    pacmanLife2.position.set(2*TILE_SIZE, 24*TILE_SIZE+3);
    pacmanLife2.scale.set(0.8);

    playerNameText = new PIXI.Text("1UP", style);
    playerScore = 0;
    playerScoreText = new PIXI.Text(playerScore.toString(), style);
    //let score = new PIXI.Text("SCORE", style);
    //let scoreNumber = new PIXI.Text("0000", style);

    playerNameText.position.set(2*TILE_SIZE, 6);
    playerScoreText.position.set(2*TILE_SIZE, 32);
    //score.position.set(GAME_WIDTH-2*TILE_SIZE-score.width, 6);
    //scoreNumber.position.set(GAME_WIDTH-2*TILE_SIZE-scoreNumber.width, 32);
    
    gameScene.addChild(pacman, iceCube, devil, princess, cowboy, fox, pacmanLife1, pacmanLife2, playerNameText, playerScoreText);
    // End 'gameScene'
    
    // Create 'gameOverScene'
    message = new Text("The End!", {font: "64px Futura", fill: "#ffcc00"});

    let textstyle = new TextStyle({
//      fontFamily: 'MoolBoran',
      fontSize: 16,
      fill: "#ffcc00"
    });
    
    message.x = GAME_WIDTH/2 - message.width/2;
    message.y = GAME_HEIGHT/2 - message.height/2;
    
    btnPlayOver = new Sprite(id["play_over.png"]);
    btnPlayOver.position.set(GAME_WIDTH - 4*TILE_SIZE, GAME_HEIGHT - 4*TILE_SIZE);
    btnPlayOver.interactive = true;
    btnPlayOver.buttonMode = true;
    btnPlayOver.visible = false;
    
    btnPlay = new Sprite(id["play.png"]);
    btnPlay.position.set(GAME_WIDTH - 4*TILE_SIZE, GAME_HEIGHT - 4*TILE_SIZE);
    btnPlay.interactive = true;
    btnPlay.buttonMode = true;
    
    restartGameTooltip = new Text("PLAY AGAIN", textstyle);
    restartGameTooltip.position.set(btnPlayOver.x+btnPlayOver.width/2, btnPlayOver.y-28);
    restartGameTooltip.visible = false;
    
    btnPlay.mouseover = function onButtonOver() {
      btnPlayOver.visible = true;
      btnPlay.visible = false;
      restartGameTooltip.visible = true;
    };
    
    btnPlayOver.mouseout = function onButtonOut() {
      btnPlayOver.visible = false;
      btnPlay.visible = true;
      restartGameTooltip.visible = false;
    };
    
    btnPlayOver.click = function onButtonClick() {
      location.reload(); // game restart  = reload browser window
    }
    
    gameOverScene.addChild(message, btnPlay, btnPlayOver, restartGameTooltip);
    // End 'gameOverScene'
    
    // STAGE
    stage.addChild(menuScene, gameScene, gameOverScene, helpScene);
    
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
      leftPressed = false;
      upPressed = false;
      downPressed = false;
//      if (rightPressed) {
//        leftPressed = false;
////        if (pacmanOrientationX < 0) {
////          pacmanOrientationX = pacman.scale.x *= -1;
////        }
//      }
//      if (upPressed && rightPressed) {
//        upPressed = false;
//        //pacman.rotation = 0;
//      }
//      if (downPressed && rightPressed) {
//        downPressed = false;
//        //pacman.rotation = 0;
//      }
    }

    // Left arrow key `press` method
    left.press = () => {
      pacman.vx = -SPEED;
      pacman.vy = 0;
      leftPressed = true;
      rightPressed = false;
      upPressed = false;
      downPressed = false;
    }
    
    // Up arrow key `press` method
    up.press = () => {
      pacman.vx = 0;
      pacman.vy = -SPEED;
      upPressed = true;
      rightPressed = false;
      leftPressed = false;
      downPressed = false;
    }

    // Down arrow key `press` method
    down.press = () => {
      pacman.vx = 0;
      pacman.vy = SPEED;
      downPressed = true;
      rightPressed = false;
      leftPressed = false;
      upPressed = false;
    }

    // ESC key `press` method
    esc.press = () => {
      pacman.vx = 0;
      pacman.vy = 0;
      devil.vx = 0;
      devil.vy = 0;
      princess.vx = 0;
      princess.vy = 0;
      cowboy.vx = 0;
      cowboy.vy = 0;
      fox.vx = 0;
      fox.vy = 0;
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
  
  // Animate pacman
  frameTime -= delta;
  if (frameTime <= 0) {
    frameIndex++;
    if (frameIndex >= frames.length) {
      frameIndex = 0;
    }
    pacman.texture = PIXI.Texture.fromFrame(frames[frameIndex]);
    pacmanMenu.texture = PIXI.Texture.fromFrame(frames[frameIndex]);
    frameTime = FRAMERATE;
  }
  
  // Render the stage - Tell the 'renderer' to render the 'stage'
  renderer.render(stage);

  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  
  lasttime = currtime;

  stats.end();
}

// Logic in 'menuScene'
function menu() {
  helpScene.visible = false;
  gameOverScene.visible = false;
  menuScene.visible = true;
  
  let pacmanHitOrangeBall = false;
  let pacmanHitBox = contain(pacmanMenu, {x: 5*TILE_SIZE,
                                          y: 12*TILE_SIZE,
                                          width: 15*TILE_SIZE, 
                                          height: 13*TILE_SIZE
                                         });

  if (pacmanHitBox === "left" || pacmanHitBox === "right") {
    pacmanMenu.vx *= -SPEED;
    pacmanMenu.scale.x *= -1;
//    pacmanMenu.scale.x = -1;
    orangeBallsMenu.forEach( (orangeBall) => {
      orangeBall.visible = true;
    });
//    orangeBall.visible = true;
  }
  
  pacmanMenu.x += pacmanMenu.vx;
  
  //Check for a collision between the balls and the pacman
  orangeBallsMenu.forEach( (orangeBall) => {
    
    if (hitTestRectangle(pacmanMenu, orangeBall)) {
      pacmanHitOrangeBall = true;
    }
    
    if (pacmanHitOrangeBall) {
      pacmanHitOrangeBall = false;
      orangeBall.visible = false;
    }
  });
}

// Logic in 'helpScene'
function help() {
  menuScene.visible = false;
  helpScene.visible = true;
}

// All the game logic goes here
// This is your game loop, where you can move sprites and add your game logic
// Logic in 'gameScene'
function playing() {

  musicPacmanBeginning.stop();
  gameOverScene.visible = false;
  menuScene.visible = false;
  gameScene.visible = true;
  
  pacman.x += pacman.vx;
  pacman.y += pacman.vy;
    
  if (pacman.x === -26 && (pacman.y === 384 || pacman.y === 385 || pacman.y === 386 || pacman.y === 387 || 
                           pacman.y === 388 || pacman.y === 389 || pacman.y === 390 || pacman.y === 391)
     ) {
    pacman.position.set(GAME_WIDTH+10, pacman.y);
  } else if (pacman.x === GAME_WIDTH+10 && (pacman.y === 384 || pacman.y === 385 || pacman.y === 386 || 
                                            pacman.y === 387 || pacman.y === 388 || pacman.y === 389 || 
                                            pacman.y === 390 || pacman.y === 391)
            ) {
    pacman.position.set(-26, pacman.y);
  }
  
  let pacmanHitBox = false;
  let pacmanHitOrangeBall = false;
  let pacmanHitPinkBall = false;
  let pacmanHitGhost = false;
  let ghostHitBox = false;
  
  
  //Move the ghosts
  moveGhost(devil);
  
  if (playerScore >= 300) {
    moveGhost(princess);
  }
  
  if (playerScore >= 600) {
    moveGhost(cowboy);
  }
  
  if (playerScore >= 900) {
    moveGhost(fox);
  }
  
//  devil.x += devil.vx;
//  devil.y += devil.vy;
//  
//  if (devil.x === -26 && devil.y === 384) {
//    devil.position.set(GAME_WIDTH+10, devil.y);
//  } else if (devil.x === GAME_WIDTH+10 && devil.y === 384) {
//    devil.position.set(-26, devil.y)
//  
//  greenCubes.forEach( (greenCube) => {
//    if (hitObjects(devil, greenCube)) {}
//  });
  
  if (hitTestRectangle(pacman, iceCube)) {
    pacman.vx = 0;
    pacman.vy = 0;
  }
  
  //Check for a collision between the pacman and the boxes
  boxes.forEach( (box) => {
    
    if (hitTestRectangle(pacman, box)) {
      pacmanHitBox = true;
    }
    
    if (pacmanHitBox) {
      pacmanHitBox = false;
      pacman.vx = 0;
      pacman.vy = 0;
      
      //pacman control
      if (rightPressed) {
        rightPressed = false;
        pacman.x -= PACMAN_OFFSET;
      }
      
      if (leftPressed) {
        leftPressed = false;
        pacman.x += PACMAN_OFFSET;
      }
      
      if (upPressed) {
        upPressed = false;
        pacman.y += PACMAN_OFFSET;
      }
      
      if (downPressed) {
        downPressed = false;
        pacman.y -= PACMAN_OFFSET;
      }
    }
  });
  
  //Check for a collision between the ghosts and the boxes
  boxes.forEach( (box) => {
    
    ghosts.forEach( (ghost) => {
      
      if (hitTestRectangle(ghost, box)) {
        ghostHitBox = true;
      }

      if (ghostHitBox) {
        ghostHitBox = false;
  //      console.log(path, 'hit box')
        ghost.vx = 0;
        ghost.vy = 0;

        if (ghost.path == moves.UP) {
          ghost.y += OFFSET
        }

        if (ghost.path == moves.RIGHT) {
          ghost.x -= OFFSET        
        }

        if (ghost.path == moves.DOWN) {
          ghost.y -= OFFSET
        }

        if (ghost.path == moves.LEFT) {
          ghost.x += OFFSET
        }
      }
      
    });
    
  });
  
  //Check for a collision between the ghost and the pacman
  ghosts.forEach( (ghost) => {
    if (hitTestRectangle(pacman, ghost)) {
      pacmanHitGhost = true;
    }
    
    if (pacmanHitGhost) {
      pacmanHitGhost = false;
      
      // if pacman eat ghost when intermission is on, or not
      if (pacman.eatGhost) {
        
        if (!btnSoundDisabled.visible) {
          soundPacmanEatGhost.play();
        }
        
        playerScore += GHOST_VALUE;
        playerScoreText.text = playerScore;
        ghost.position.set();
//        console.log(ghosts.indexOf(ghost));
        for (let i = 0; i < ghosts.length; i++) {
          if (ghosts[i] == 0) {
            ghost.setTexture(id["dablik.png"]);
          } else if (ghosts[i] == 1) {
            ghost.setTexture(id["princezna.png"]);
          } else if (ghosts[i] == 2) {
            ghost.setTexture(id["pistolnik.png"]);
          } else if (ghosts[i] == 3) {
            ghost.setTexture(id["lisak.png"]);
          }
        }
        ghost.position.set(9*TILE_SIZE, 10*TILE_SIZE);
        ghost.path = moves.LEFT;
        ghost.vx = 0;
        ghost.vy = 0;
        
        setTimeout(function() {
          ghost.vx = -GHOST_SPEED;
          ghost.vy = 0;
        }, (4 * 1000));
        
      } else {
        
        if (!btnSoundDisabled.visible) {
          soundPacmanDeath.play();
        }

        if (lifeCounter === 2) {
          gameScene.removeChild(pacmanLife2);
          lifeCounter -= 1;
          pacman.position.set(9*TILE_SIZE+3, 18*TILE_SIZE+3);
          pacman.vx = 0;
          pacman.vy = 0;
          pacman.rotation = 0;
        }
        else if (lifeCounter === 1) {
          gameScene.removeChild(pacmanLife1);
          lifeCounter -= 1;
          pacman.position.set(9*TILE_SIZE+3, 18*TILE_SIZE+3);
          pacman.vx = 0;
          pacman.vy = 0;
          pacman.rotation = 0;
        }
        else if (lifeCounter === 0) {
          state = end;
          message.text = "You lost!";
        }
        
      }
      
    }
    
  });
    
  //Check for a collision between the balls and the pacman
  orangeBalls.forEach( (orangeBall) => {
    
    if (hitTestRectangle(pacman, orangeBall)) {
      pacmanHitOrangeBall = true;
    }
    
    if (pacmanHitOrangeBall) {
      pacmanHitOrangeBall = false;
      
      if (!btnSoundDisabled.visible) {
        soundPacmanMunch.play();
      }
      
      let i = orangeBalls.indexOf(orangeBall);
      if (i != -1) {
        orangeBalls.splice(i, 1);
        playerScore += ORANGEBALL_VALUE;
        playerScoreText.text = playerScore;
      }

      gameScene.removeChild(orangeBall);

      if (orangeBalls.length === 0 && pinkBalls.length === 0) {
        state = end;
        message.text = "You won";
      }
    }
    
  });
  
  pinkBalls.forEach( (pinkBall) => {
    
    if (hitTestRectangle(pacman, pinkBall)) {
      pacmanHitPinkBall = true;
    }
    
    if (pacmanHitPinkBall) {
      pacmanHitPinkBall = false;
      
      if (!btnSoundDisabled.visible) {
        soundPacmanIntermission.play();
        devil.setTexture(id["dablik_eat.png"]);
        princess.setTexture(id["princezna_eat.png"]);
        cowboy.setTexture(id["pistolnik_eat.png"]);
        fox.setTexture(id["lisak_eat.png"]);
//        SPEED = 2;
        // pacman eat ghost
        pacman.eatGhost = true;
        
        soundPacmanIntermission.on('end', () => {
          devil.setTexture(id["dablik.png"]);
          princess.setTexture(id["princezna.png"]);
          cowboy.setTexture(id["pistolnik.png"]);
          fox.setTexture(id["lisak.png"]);
//          SPEED = 1;
          // pacman dont eat ghost
          pacman.eatGhost = false;
        });
      } else {
        soundPacmanIntermission.play();
        soundPacmanIntermission.volume(0);
//        devilIntermission.visible = true;
//        devil.visible = false;
        soundPacmanIntermission.on('end', () => {
//          devilIntermission.visible = false;
//          devil.visible = true;
        });
      }
      
      let i = pinkBalls.indexOf(pinkBall);
      if (i != -1) {
        pinkBalls.splice(i, 1);
        playerScore += PINKBALL_VALUE;
        playerScoreText.text = playerScore;
      }

      gameScene.removeChild(pinkBall);

      if (pinkBalls.length === 0 && orangeBalls.length === 0) {
        state = end;
        message.text = "You won";
      }
      
    }
  });
  
  //Decide whether the game has been won or lost
  
  //Change the game `state` to `end` when the game is finsihed
  
}

//All the code that should run at the end of the game goes here
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

/* Helper functions */

function getRandomDirection() {
  let direction = Math.floor((Math.random() * 2) + 1);
  console.log(direction);
  return direction;
}

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

//The 'contain' function
function contain(sprite, container) {

  let collision = undefined;

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

  //Return the 'collision' value
  return collision;
}

//The 'hitTestRectangle' function
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

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

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

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

  //`hit` will be either 'true' or 'false'
  return hit;
};

//The 'hitObjects' function
function hitObjects(r1, r2) {

  //Define the variables we'll need to calculate
  var hit, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Check for a collision on the x axis
  if ((r1.x) == r2.x) { // -OFFSET

    //A collision might be occuring. Check for a collision on the y axis
    if ((r1.y) == r2.y) {

      //There's definitely a collision happening
      hit = true;
      
      if (hit) {
        direction = Math.floor((Math.random() * 4) + 1);
        //console.log(direction)
        if (direction == 1) {
          r1.path = moves.UP
          r1.vx = 0
          r1.vy = -GHOST_SPEED
        } else if (direction == 2) {
          r1.path = moves.RIGHT
          r1.vx = GHOST_SPEED
          r1.vy = 0
        } else if (direction == 3) {
          r1.path = moves.DOWN
          r1.vx = 0
          r1.vy = GHOST_SPEED
        } else if (direction == 4) {
          r1.path = moves.LEFT
          r1.vx = -GHOST_SPEED
          r1.vy = 0
        }
      }
      
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either 'true' or 'false'
  return hit;
};
  
function moveGhost(ghostName) {
  
  ghostName.x += ghostName.vx;
  ghostName.y += ghostName.vy;
  
  if (ghostName.x === -26 && ghostName.y === 384) {
    ghostName.position.set(GAME_WIDTH+10, ghostName.y);
  } else if (ghostName.x === GAME_WIDTH+10 && ghostName.y === 384) {
    ghostName.position.set(-26, ghostName.y)
  }
  
  greenCubes.forEach( (greenCube) => {
    if (hitObjects(ghostName, greenCube)) {}
  });
  
};
/* #GAME SCRIPTS END# */
