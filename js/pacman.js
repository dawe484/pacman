/*!
 * PAC-MAN 2017 - v1.0.3
 * Compiled Thu, 11 May 2017 15:43:56 UTC
 *
 * sound source: http://www.classicgaming.cc/classics/pac-man/sounds
 * sprite source: http://opengameart.org/content/ghosts
 *                http://opengameart.org/content/winter-platformer-game-tileset
 *                https://opengameart.org/content/medieval-game-button-pack
 *
 * pacman.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';
/* index.html loader */
let loading;

function myLoading() {
  loading = setTimeout(showPage(), 3000);
}

function showPage() {
  document.getElementById("pacman").style.display = "none";
  document.getElementById("loader").style.display = "none";
  document.getElementById("myPacman").style.display = "block";
}

/* #GAME SCRIPTS START# */

// Aliases
const Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Text = PIXI.Text,
      TextStyle = PIXI.TextStyle,
      Camera = PIXI.Camera3d;

// Define a few globals here
const GAME_WIDTH = 608,
      GAME_HEIGHT = 800,
      TILE_SIZE = 32,
      OFFSET = 1,
      PACMAN_OFFSET = 2,
      SPEED = 1,
      GHOST_SPEED = 1,
      GHOST_VALUE = 200,
      ORANGEBALL_VALUE = 10,
      PINKBALL_VALUE = 50,
      PACMAN_START_X = 9*TILE_SIZE+5,
      PACMAN_START_Y = 18*TILE_SIZE+5;

// LEVEL 0 = MENU
const level0 = [
  "bbbbbbbbbbbb",
  "b..........b",
  "bbbbbbbbbbbb"
];

// LEVEL 1
const level1 = [
  "bbbbbbbbbbbbbbbbbbb", // 19 - original 28
  "ba..v...vbv...v..ab",
  "b.bb.bbb.b.bbb.bb.b",
  "b.bb.bbb.b.bbb.bb.b",
  "bv..v.v.v.v.v.v..vb",
  "b.bb.b.bbbbb.b.bb.b",
  "bv..vbv.vbv.vbv..vb",
  "bbbb.bbbnbnbbb.bbbb",
  "nnnb.bwnwywnwb.bnnn",
  "bbbb.bnbb_bbnb.bbbb",
  "nnnnvnwbnrnbwnvnnnn",
  "bbbb.bnbbbbbnb.bbbb",
  "nnnb.bwnnnnnwb.bnnn",
  "bbbb.bnbbbbbnb.bbbb",
  "bv..v.v.vbv.v.v..vb",
  "b.bb.bbb.b.bbb.bb.b",
  "bvvbv.v.vnv.v.vbvvb",
  "bb.b.b.bbbbb.b.b.bb",
  "bvv.vbv.vbv.vbv.vvb",
  "b.bbbbbb.b.bbbbbb.b",
  "ba......v.v......ab",
  "bbbbbbbbbbbbbbbbbbb"
  // 25 - original 36 (most of these tiles are not accessible to Pac-Man or the ghosts)
];

//const level1 = [
//  "bbbbbbbbbbbbbbbbbbb", // 19 - original 28
//  "bc--x---xbx---x--cb",
//  "b-bb-bbb-b-bbb-bb-b",
//  "b-bb-bbb-b-bbb-bb-b",
//  "bx--x-x-x-x-x-x--xb",
//  "b-bb-b-bbbbb-b-bb-b",
//  "bx--xbx-xbx-xbx--xb",
//  "bbbb-bbbnbnbbb-bbbb",
//  "nnnb-bwnwywnwb-bnnn",
//  "bbbb-bnbb_bbnb-bbbb",
//  "nnnnxnwbnrnbwnxnnnn",
//  "bbbb-bnbbbbbnb-bbbb",
//  "nnnb-bwnnnnnwb-bnnn",
//  "bbbb-bnbbbbbnb-bbbb",
//  "bx--x-x-xbx-x-x--xb",
//  "b-bb-bbb-b-bbb-bb-b",
//  "bxxbx-x-xnx-x-xbxxb",
//  "bb-b-b-bbbbb-b.b.bb",
//  "bxx-xbx-xbx-xbx.xxb",
//  "b.bbbbbb.b-bbbbbb.b",
//  "bc......v.v......cb",
//  "bbbbbbbbbbbbbbbbbbb"
//  // 25 - original 36 (most of these tiles are not accessible to Pac-Man or the ghosts)
//];
//
//// LEVEL 2
//const level2 = [
//  "bbbbbbbbbbbbbbbbbbb",
//  "bv..v.vbv.vbv.v..vb",
//  "b.bb.b.b.b.b.b.bb.b",
//  "b.bb.b.b.b.b.b.bb.b",
//  "bv.avbv.vbv.vbva.vb",
//  "b.bb.bbb.b.bbb.bb.b",
//  "b.bvv.v.vbv.v.vvb.b",
//  "b.b.bbnbbbbbnbb.b.b",
//  "nv.vvnwnwywnwnvv.vn",
//  "b.bb.bnbb_bbnb.bb.b",
//  "bv..vnwbnrnbwnv..vb",
//  "b.bb.bnbbbbbnb.bb.b", // remove scene, create new
//  "bvvb.bwnnnnnwb.bvvb",
//  "bb.b.bnbbbbbnb.b.bb",
//  "nvvbv.v.vbv.v.vbvvn",
//  "b.bb.bbb.b.bbb.bb.b",
//  "bv.vvbv.vnv.vbvv.vb",
//  "b.b.bb.b.b.b.bb.b.b",
//  "b.bva.vbv.vbv.avb.b",
//  "b.bbbb.bbbbb.bbbb.b",
//  "bv....v.....v....vb",
//  "bbbbbbbbbbbbbbbbbbb"
//];

let activeLevel = 1;

let renderer, stage, menuScene, gameSceneLevel1, gameOverScene, helpScene, settingsScene, pauseScene,
    stats, id, style, styleTitle, textstyle;

let pacmanTitle, pacmanMenu, btnStart, btnStartOver, btnSettings, btnSettingsOver, btnHighscore, btnHighscoreOver, 
    btnHelp, btnHelpOver, btnMusic, btnMusicOver, btnMusicDisabled, btnMusicOverDisabled, btnSound, 
    btnSoundOver, btnSoundDisabled, btnSoundOverDisabled, btnCloseHelp, btnCloseHelpOver, btnPlay, btnPlayOver, 
    restartGameTooltip, musicGameTooltip, soundGameTooltip, playGameTooltip, settingsGameTooltip, highscoreGameTooltip, 
    helpGameTooltip, btnCloseSettings, btnCloseSettingsOver;
let left, right, up, down, esc, enter;
let pacman, pacmanLevel1, pacmanLife1, pacmanLife2, pacmanLevel1Life1, pacmanLevel1Life2,
    box, pinkBall, orangeBall, iceCube, devil, fox, cowboy, princess, devilLevel1, princessLevel1, cowboyLevel1, foxLevel1, 
    yellowCube, greenCube, redCube;

// set the game's current state to `menu`
let state = menu;

let orangeBallsMenu = [], boxes = [], ghosts = [], orangeBalls = [], pinkBalls = [], greenCubes = [];
let rightPressed = false, leftPressed = false, upPressed = false, downPressed = false, escPressed = false,
    enterPressed = false;
//let orientationX, pacmanLevel1OrientationX;
let playerName, playerScore, playerNameText, playerScoreText, message, playMessage;

let frames = ["pacman-open-right.png", "pacman-close-right.png"];
//let frames2 = ["pacman-open-right.png", "pacman-close-right.png"];

const framesRight = ["pacman-open-right.png", "pacman-close-right.png"];
const framesRightUp = ["pacman-open-right-up.png", "pacman-close-right-up.png"];
const framesRightDown = ["pacman-open-right-down.png", "pacman-close-right-down.png"]

const framesLeft = ["pacman-open-left.png", "pacman-close-left.png"];
const framesLeftUp = ["pacman-open-left-up.png", "pacman-close-left-up.png"];
const framesLeftDown = ["pacman-open-left-down.png", "pacman-close-left-down.png"];

let frameIndex, frameTime, delta, lasttime, currtime;
const FRAMERATE = 0.13;
let lifeCounter = 2;

let moves = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

let direction, path;//, minutes = 59, seconds = 59, tempMinutes, tempSeconds;

// Audio
let musicPacmanBeginning, soundPacmanMunch, soundPacmanIntermission, soundPacmanEatGhost, soundPacmanDeath,
    pauseIntermission, intermissionPlaying = false; //, pausePacmanDeath;

// Init function
function init() {
  let rendererOptions = {
    antialias: false,
    transparent: false,
    resolution: window.devicePixelRatio
  };

  // Create a PIXI stage and renderer
  renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, rendererOptions);
  renderer.backgroundColor = 0x000000;

  if (renderer instanceof PIXI.CanvasRenderer) {
//    console.log("Render: Canvas");
//    console.log("Device pixel ratio:", window.devicePixelRatio);
  } else {
//    console.log("Render: WebGL");
//    console.log("Device pixel ratio:", window.devicePixelRatio);
  }

  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    var args = ['\n %c %c %c PAC-MAN 2017' + ' - David Krénar %c  %c  https://github.com/dawe484/pacman/  %c  \n\n', 'background: #ffcc00; padding:5px 0;', 'background: #ffcc00; padding:5px 0;', 'color: #ffcc00; background: #030307; padding:5px 0;', 'background: #ffcc00; padding:5px 0;', 'background: #ffe680; padding:5px 0;', 'background: #ffcc00; padding:5px 0;'];

    window.console.log.apply(console, args);
  } else if (window.console) {
    window.console.log('PAC-MAN 2017' + ' - David Krénar - https://github.com/dawe484/pacman/');
  }
  
  // Add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  // Create a container object called the 'stage'
  stage = new Container();

//  if (window.innerHeight <= GAME_HEIGHT) {
    resize();
//    window.addEventListener("resize", resize);
//  }
  
//  // ON THE TOP OF OUR SCENE WE PUT A FPS COUNTER FROM MR.DOOB - stats.js ////
//  stats = new Stats();
//  stats.domElement.style.position = 'absolute';
//  stats.domElement.style.top = '0px';
//  document.body.appendChild(stats.domElement);

  // Listen for and adapt to changes to the screen size user changing the window or rotating their device
  window.addEventListener("resize", resize);
  
  if (window.devicePixelRatio >= 4) {
    // loader.add("assets/images/pacmanImages@2x.json");
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
  
  // This `setup` function will run when the image has loaded
  function setup() {
//    console.log("All files loaded");
    
    // Initialize sounds here music in game `menuScene`
    musicPacmanBeginning = new Howl({
      src: ['./assets/audio/pacman_beginning.wav'],
      autoplay: true,
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
    
    // CREATE scenes for game
    menuScene = new Container();
    gameSceneLevel1 = new Container();
//    gameSceneLevel2 = new Container();
    gameOverScene = new Container();
    helpScene = new Container();
    settingsScene = new Container();
    pauseScene = new Container();
    
    menuScene.visible = true;
    gameSceneLevel1.visible = false;
//    gameSceneLevel2.visible = false;
    gameOverScene.visible = false;
    helpScene.visible = false;
    settingsScene.visible = false;
    pauseScene.visible = false;
    
    // Play the sound in `menuScene`
    musicPacmanBeginning.play();
    
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
    
    
    textstyle = new TextStyle({
      fontFamily:'Consolas',
      fontSize: 14,
      fill: "#ffcc00"
    });
    
//    // Function that check if it is `0` before a one-digit number in time
//    function checkTime(i) {
//      if (i < 10) {
//        i = "0" + i;
//      }
//      return i;
//    }
    
    // Capture the keyboard arrow keys, escape - pause, enter - continue
    left = keyboard(37);
    up = keyboard(38);
    right = keyboard(39);
    down = keyboard(40);
    esc = keyboard(27);
    enter = keyboard(13);
    
    // CREATE `menuScene`
    pacmanTitle = new PIXI.Text("PAC-MAN 2017", styleTitle);
    pacmanTitle.position.set(GAME_WIDTH/2-pacmanTitle.width/2, 7*TILE_SIZE);
    
    btnStartOver = new Sprite(id["button_over.png"]);
    btnStartOver.position.set(GAME_WIDTH/2-btnStartOver.width/2, GAME_HEIGHT - 7*TILE_SIZE);
    btnStartOver.interactive = true;
    btnStartOver.buttonMode = true;
    btnStartOver.visible = false;
    
    btnStart = new Sprite(id["button.png"]);
    btnStart.position.set(GAME_WIDTH/2-btnStart.width/2, GAME_HEIGHT - 7*TILE_SIZE);
    btnStart.interactive = true;
    btnStart.buttonMode = true;
    
    playGameTooltip = new Text("START GAME", textstyle);
    playGameTooltip.position.set(btnStart.x+btnStart.width/2-playGameTooltip.width/2, btnStart.y-26);
    playGameTooltip.visible = false;
    
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
      playGameTooltip.visible = true;
    };
    
    btnStartOver.mouseout = function onButtonOut() {
      btnStartOver.visible = false;
      btnStart.visible = true;
      playMessage.setStyle(style);
      playGameTooltip.visible = false;
    };
    
    btnStartOver.click = function onButtonClick() {
      if (activeLevel == 1) pacman = pacmanLevel1;
//      if (activeLevel == 2) pacman = pacmanLevel2;
      pacman.vx = 0;
      pacman.vy = 0;
      escPressed = false;
//      minutes = 4;
//      seconds = 59;
      frames = framesRight;
      state = playing1;
    }
    
    playMessage = new PIXI.Text("PLAY", style);
    playMessage.position.set(GAME_WIDTH/2-playMessage.width/2, GAME_HEIGHT - 7*TILE_SIZE+10);
    
    btnHighscoreOver = new Sprite(id["score_over.png"]);
    btnHighscoreOver.position.set(GAME_WIDTH - 11*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHighscoreOver.interactive = true;
    btnHighscoreOver.buttonMode = true;
    btnHighscoreOver.visible = false;
    
    btnHighscore = new Sprite(id["score.png"]);
    btnHighscore.position.set(GAME_WIDTH - 11*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHighscore.interactive = true;
    btnHighscore.buttonMode = true;
    
    highscoreGameTooltip = new Text("COMING SOON", textstyle);
    highscoreGameTooltip.position.set(btnHighscore.x+btnHighscore.width/2-highscoreGameTooltip.width/2, 
                                      btnHighscore.y-26);
    highscoreGameTooltip.visible = false;
    
    btnHighscore.mouseover = function onButtonOver() {
      btnHighscoreOver.visible = true;
      btnHighscore.visible = false;
      highscoreGameTooltip.visible = true;
    };
    
    btnHighscoreOver.mouseout = function onButtonOut() {
      btnHighscoreOver.visible = false;
      btnHighscore.visible = true;
      highscoreGameTooltip.visible = false;
    };
    
    btnSettingsOver = new Sprite(id["controls_over.png"]);
    btnSettingsOver.position.set(GAME_WIDTH - 9*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSettingsOver.interactive = true;
    btnSettingsOver.buttonMode = true;
    btnSettingsOver.visible = false;
    
    btnSettings = new Sprite(id["controls.png"]);
    btnSettings.position.set(GAME_WIDTH - 9*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSettings.interactive = true;
    btnSettings.buttonMode = true;
    
    settingsGameTooltip = new Text("CONTROLS", textstyle);
    settingsGameTooltip.position.set(btnSettings.x+btnSettings.width/2-settingsGameTooltip.width/2, 
                                     btnSettings.y-26);
    settingsGameTooltip.visible = false;
    
    btnSettings.mouseover = function onButtonOver() {
      btnSettingsOver.visible = true;
      btnSettings.visible = false;
      settingsGameTooltip.visible = true;
    };
    
    btnSettingsOver.mouseout = function onButtonOut() {
      btnSettingsOver.visible = false;
      btnSettings.visible = true;
      settingsGameTooltip.visible = false;
    };
    
    btnSettingsOver.click = function onButtonClick() {
      state = settings;
    }
    
    btnSoundOverDisabled = new Sprite(id["sound_over_disabled.png"]);
    btnSoundOverDisabled.position.set(GAME_WIDTH - 7*TILE_SIZE-2.5, GAME_HEIGHT - 3*TILE_SIZE-1);
    btnSoundOverDisabled.interactive = true;
    btnSoundOverDisabled.buttonMode = true;
    btnSoundOverDisabled.visible = false;
    
    btnSoundDisabled = new Sprite(id["sound_disabled.png"]);
    btnSoundDisabled.position.set(GAME_WIDTH - 7*TILE_SIZE-2.5, GAME_HEIGHT - 3*TILE_SIZE-1);
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
    btnSoundOver.position.set(GAME_WIDTH - 7*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSoundOver.interactive = true;
    btnSoundOver.buttonMode = true;
    btnSoundOver.visible = false;
    
    // repro button is image of sound effects
    btnSound = new Sprite(id["sound.png"]);
    btnSound.position.set(GAME_WIDTH - 7*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnSound.interactive = true;
    btnSound.buttonMode = true;
    
    soundGameTooltip = new Text("MUTE/UNMUTE SOUND EFFECTS", textstyle);
    soundGameTooltip.position.set(btnSound.x+btnSound.width/2-soundGameTooltip.width/2, btnSound.y-26);
    soundGameTooltip.visible = false;
    
    btnSound.mouseover = function onButtonOver() {
      btnSoundOver.visible = true;
      btnSound.visible = false;
      soundGameTooltip.visible = true;
    };
    
    btnSoundOver.mouseout = function onButtonOut() {
      btnSoundOver.visible = false;
      btnSound.visible = true;
      soundGameTooltip.visible = false;
    };
    
    btnSoundDisabled.mouseover = function onButtonOverDisable() {
      btnSoundOverDisabled.visible = true;
      btnSoundDisabled.visible = false;
      soundGameTooltip.visible = true;
    };
    
    btnSoundOverDisabled.mouseout = function onButtonOutDisable() {
      btnSoundOverDisabled.visible = false;
      btnSoundDisabled.visible = true;
      soundGameTooltip.visible = false;
    };
    
    btnSoundOver.click = function onButtonClick() {
      btnSoundOver.visible = false;
      btnSoundOverDisabled.visible = true;
      soundGameTooltip.visible = true;
    };
    
    btnSoundOverDisabled.click = function onButtonClick() {
      btnSoundOverDisabled.visible = false;
      btnSoundOver.visible = true;
    };
    
    btnMusicOverDisabled = new Sprite(id["music_over_disabled.png"]);
    btnMusicOverDisabled.position.set(GAME_WIDTH - 5*TILE_SIZE-2, GAME_HEIGHT - 3*TILE_SIZE-0.5);
    btnMusicOverDisabled.interactive = true;
    btnMusicOverDisabled.buttonMode = true;
    btnMusicOverDisabled.visible = false;
    
    btnMusicDisabled = new Sprite(id["music_disabled.png"]);
    btnMusicDisabled.position.set(GAME_WIDTH - 5*TILE_SIZE-2, GAME_HEIGHT - 3*TILE_SIZE-0.5);
    btnMusicDisabled.interactive = true;
    btnMusicDisabled.buttonMode = true;
    btnMusicDisabled.visible = false;
    
    btnMusicOver = new Sprite(id["music_over.png"]);
    btnMusicOver.position.set(GAME_WIDTH - 5*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnMusicOver.interactive = true;
    btnMusicOver.buttonMode = true;
    btnMusicOver.visible = false;
    
    // music button is image of music note
    btnMusic = new Sprite(id["music.png"]);
    btnMusic.position.set(GAME_WIDTH - 5*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnMusic.interactive = true;
    btnMusic.buttonMode = true;
    
    musicGameTooltip = new Text("MUTE/UNMUTE MUSIC", textstyle);
    musicGameTooltip.position.set(btnMusic.x+btnMusic.width/2-musicGameTooltip.width/2, btnMusic.y-26);
    musicGameTooltip.visible = false;
    
    btnMusic.mouseover = function onButtonOver() {
      btnMusicOver.visible = true;
      btnMusic.visible = false;
      musicGameTooltip.visible = true;
    };
    
    btnMusicOver.mouseout = function onButtonOut() {
      btnMusicOver.visible = false;
      btnMusic.visible = true;
      musicGameTooltip.visible = false;
    };
    
    btnMusicDisabled.mouseover = function onButtonOverDisable() {
      btnMusicOverDisabled.visible = true;
      btnMusicDisabled.visible = false;
      musicGameTooltip.visible = true;
    };
    
    btnMusicOverDisabled.mouseout = function onButtonOutDisable() {
      btnMusicOverDisabled.visible = false;
      btnMusicDisabled.visible = true;
      musicGameTooltip.visible = false;
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

    btnHelpOver = new Sprite(id["questionMark_over.png"]);
    btnHelpOver.position.set(GAME_WIDTH - 3*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHelpOver.interactive = true;
    btnHelpOver.buttonMode = true;
    btnHelpOver.visible = false;
    
    btnHelp = new Sprite(id["questionMark.png"]);
    btnHelp.position.set(GAME_WIDTH - 3*TILE_SIZE, GAME_HEIGHT - 3*TILE_SIZE);
    btnHelp.interactive = true;
    btnHelp.buttonMode = true;
    
    helpGameTooltip = new Text("INFO/CREDITS", textstyle);
    helpGameTooltip.position.set(btnHelp.x+btnHelp.width/2-helpGameTooltip.width/2, btnHelp.y-26);
    helpGameTooltip.visible = false;
    
    btnHelp.mouseover = function onButtonOver() {
      btnHelpOver.visible = true;
      btnHelp.visible = false;
      helpGameTooltip.visible = true;
    };
    
    btnHelpOver.mouseout = function onButtonOut() {
      btnHelpOver.visible = false;
      btnHelp.visible = true;
      helpGameTooltip.visible = false;
    };
    
    btnHelpOver.click = function onButtonClick() {
      state = help;
    }
    
    for (let i = 0; i < level0.length; i++) {
      for (let c = 0; c < level0[i].length; c++) {
        if (level0[i][c] == 'b') {
          box = new Sprite(id["box.png"]);
          box.position.x = c * TILE_SIZE + 4*TILE_SIZE-TILE_SIZE/2;
          box.position.y = i * TILE_SIZE + 10*TILE_SIZE+TILE_SIZE/2;
          menuScene.addChild(box);
        }
        if (level0[i][c] == '.') {
          orangeBall = new Sprite(id["orange-ball.png"]);
          orangeBall.position.x = c * TILE_SIZE + 4*TILE_SIZE-orangeBall.width/2;
          orangeBall.position.y = i * TILE_SIZE + 11*TILE_SIZE-orangeBall.width/2;
          orangeBallsMenu.push(orangeBall);
          menuScene.addChild(orangeBall);
        }
      }
    }
    
    frameIndex = 0;
    
    // Create pacman in `menuScene`
    pacmanMenu = new Sprite(id[frames[frameIndex]]);
    frameTime = FRAMERATE;
    pacmanMenu.position.set(5*TILE_SIZE-TILE_SIZE/2+3, 12*TILE_SIZE-TILE_SIZE/2+3);
    pacmanMenu.vx = SPEED;
    pacmanMenu.scale.set(0.8);
    
    menuScene.addChild(pacmanTitle, btnStart, btnStartOver, playMessage, btnHelp, btnHelpOver, btnMusic, btnMusicOver, 
                       btnMusicDisabled, btnMusicOverDisabled, btnSound, btnSoundOver, btnSoundDisabled, 
                       btnSoundOverDisabled, pacmanMenu, musicGameTooltip, soundGameTooltip, playGameTooltip, 
                       btnHighscore, btnHighscoreOver, highscoreGameTooltip, helpGameTooltip, btnSettings, 
                       btnSettingsOver, settingsGameTooltip);
    // END `menuScene`
    
    // CREATE `helpScene`
    // add `close` button to the scene
    btnCloseHelpOver = new Sprite(id["close_over.png"]);
    btnCloseHelpOver.position.set(GAME_WIDTH - 3*TILE_SIZE, 2*TILE_SIZE);
    btnCloseHelpOver.interactive = true;
    btnCloseHelpOver.buttonMode = true;
    btnCloseHelpOver.visible = false;

    btnCloseHelp = new Sprite(id["close.png"]);
    btnCloseHelp.position.set(GAME_WIDTH - 3*TILE_SIZE, 2*TILE_SIZE);
    btnCloseHelp.interactive = true;
    btnCloseHelp.buttonMode = true;
    
    let closeGameTooltip = new Text("BACK TO MENU", textstyle);
    closeGameTooltip.position.set(btnCloseHelp.x+btnCloseHelp.width/2-closeGameTooltip.width/2, btnCloseHelp.y-26);
    closeGameTooltip.visible = false;
    
    btnCloseHelp.mouseover = function onButtonOver() {
      btnCloseHelpOver.visible = true;
      btnCloseHelp.visible = false;
      closeGameTooltip.visible = true;
    };
    
    btnCloseHelpOver.mouseout = function onButtonOut() {
      btnCloseHelpOver.visible = false;
      btnCloseHelp.visible = true;
      closeGameTooltip.visible = false;
    };

    btnCloseHelpOver.click = function onButtonClick() {
      state = menu;
    }
    
    let helpTitleStyle = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 24,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 440,
      fill: "#ffcc00"
    });
    
    let helpAuthorStyle = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 22,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 440,
      fill: "#fff"
    });
    
    let helpStyle = new PIXI.TextStyle({
      fontFamily: 'Consolas',
      fontSize: 18,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 400,
      fill: "#fff"
    });
    
    let helpTitle = new PIXI.Text("School project to subject 'Innovation Course for the IT Specialists'", helpTitleStyle);
    helpTitle.position.set(GAME_WIDTH/2-helpTitle.width/2, 4*TILE_SIZE);
    
    let helpAuthor = new PIXI.Text("Author: David Krénar", helpAuthorStyle);
    helpAuthor.position.set(GAME_WIDTH/2-helpAuthor.width/2, 8*TILE_SIZE-TILE_SIZE/2+4);
    
    let helpSources = new PIXI.Text("Audio and image sources:", helpTitleStyle);
    helpSources.position.set(GAME_WIDTH/2-helpSources.width/2, 10*TILE_SIZE);
    
    let helpSourcesSound = new PIXI.Text("Sounds:\nhttp://www.classicgaming.cc/classics/pac-man/sounds", helpStyle);
    helpSourcesSound.position.set(2*TILE_SIZE-TILE_SIZE/4, 11*TILE_SIZE);
    
    let helpSourcesImage = new PIXI.Text("Images:\nhttp://opengameart.org/content/ghosts\nhttp://opengameart.org/content/winter-platformer-\ngame-tileset\nhttps://opengameart.org/content/medieval-game-\nbutton-pack", helpStyle);
    helpSourcesImage.position.set(2*TILE_SIZE-TILE_SIZE/4, 13*TILE_SIZE);
    
    helpScene.addChild(btnCloseHelp, btnCloseHelpOver, helpTitle, helpAuthor, helpSources, helpSourcesSound,
                       helpSourcesImage, closeGameTooltip);
    // END `helpScene`
    
    // CREATE `settingsScene`
    // add `close` button to the scene
    btnCloseSettingsOver = new Sprite(id["close_over.png"]);
    btnCloseSettingsOver.position.set(GAME_WIDTH - 3*TILE_SIZE, 2*TILE_SIZE);
    btnCloseSettingsOver.interactive = true;
    btnCloseSettingsOver.buttonMode = true;
    btnCloseSettingsOver.visible = false;

    btnCloseSettings = new Sprite(id["close.png"]);
    btnCloseSettings.position.set(GAME_WIDTH - 3*TILE_SIZE, 2*TILE_SIZE);
    btnCloseSettings.interactive = true;
    btnCloseSettings.buttonMode = true;
    
    let closeSettingTooltip = new Text("BACK TO MENU", textstyle);
    closeSettingTooltip.position.set(btnCloseSettings.x+btnCloseSettings.width/2-closeSettingTooltip.width/2,
                                     btnCloseSettings.y-26);
    closeSettingTooltip.visible = false;
    
    btnCloseSettings.mouseover = function onButtonOver() {
      btnCloseSettingsOver.visible = true;
      btnCloseSettings.visible = false;
      closeSettingTooltip.visible = true;
    };

    btnCloseSettingsOver.mouseout = function onButtonOut() {
      btnCloseSettingsOver.visible = false;
      btnCloseSettings.visible = true;
      closeSettingTooltip.visible = false;
    };

    btnCloseSettingsOver.click = function onButtonClick() {
      state = menu;
    }
    
    let settingsTitle = new PIXI.Text("GAME CONTROLS", styleTitle);
    settingsTitle.position.set(GAME_WIDTH/2-settingsTitle.width/2, 6*TILE_SIZE);
    
    let settingsTextControls = new PIXI.Text("Use your arrow keys to move PAC-MAN through the maze.", helpAuthorStyle);
    settingsTextControls.position.set(GAME_WIDTH/2-settingsTextControls.width/2, 9*TILE_SIZE);
    
    let btnArrowUp = new Sprite(id["control_up.png"]);
    btnArrowUp.position.set(GAME_WIDTH/2-btnArrowUp.width/2, 11*TILE_SIZE+TILE_SIZE/2);
    
    let btnArrowRight = new Sprite(id["control_right.png"]);
    btnArrowRight.position.set(GAME_WIDTH/2-btnArrowRight.width/2+2*TILE_SIZE, 13*TILE_SIZE+TILE_SIZE/2);
    
    let btnArrowDown = new Sprite(id["control_down.png"]);
    btnArrowDown.position.set(GAME_WIDTH/2-btnArrowDown.width/2, 13*TILE_SIZE+TILE_SIZE/2);
    
    let btnArrowLeft = new Sprite(id["control_left.png"]);
    btnArrowLeft.position.set(GAME_WIDTH/2-btnArrowLeft.width/2-2*TILE_SIZE, 13*TILE_SIZE+TILE_SIZE/2);
    
    let settingsTextPause = new PIXI.Text("ESC - pause game\nENTER - continue game", helpAuthorStyle);
    settingsTextPause.position.set(GAME_WIDTH/2-settingsTextPause.width/2, 16*TILE_SIZE);
    
    let eatingText = new PIXI.Text("Eat orangeball = 10\nEat pinkball = 50\nEat ghost (in intermission) = 200", helpAuthorStyle);
    eatingText.position.set(GAME_WIDTH/2-eatingText.width/2, 18*TILE_SIZE+TILE_SIZE/4);
    
    settingsScene.addChild(btnCloseSettings, btnCloseSettingsOver, settingsTitle, settingsTextControls, btnArrowUp,
                           btnArrowRight, btnArrowDown, btnArrowLeft, settingsTextPause, closeSettingTooltip, eatingText);
    // END `settingsScene`
    
    // CREATE `pauseScene`
    let pauseTitle = new PIXI.Text("PAUSE", styleTitle);
    pauseTitle.position.set(GAME_WIDTH/2-pauseTitle.width/2, 10*TILE_SIZE);
    
    let pauseContinueText = new PIXI.Text("Press ENTER to continue.", helpAuthorStyle);
    pauseContinueText.position.set(GAME_WIDTH/2-pauseContinueText.width/2, 14*TILE_SIZE);
    
    pauseScene.addChild(pauseTitle, pauseContinueText);
    // END `pauseScene`
    
    // CREATE `gameSceneLevel1`
    // Create maze level1
    if (activeLevel == 1) {
      for (let i = 0; i < level1.length; i++) {
        for (let c = 0; c < level1[i].length; c++) {
          if (level1[i][c] == 'b') {
            box = new Sprite(id["box.png"]);
            box.position.x = c * TILE_SIZE;
            box.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            gameSceneLevel1.addChild(box);
            boxes.push(box);
          }
          if (level1[i][c] == 'a') {
            greenCube = new Sprite(id["black-cube.png"]);
            greenCube.position.x = c * TILE_SIZE;
            greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            greenCubes.push(greenCube);
            pinkBall = new Sprite(id["pink-ball.png"]);
            pinkBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - pinkBall.width/2;
            pinkBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - pinkBall.height/2;
            gameSceneLevel1.addChild(greenCube, pinkBall);
            pinkBalls.push(pinkBall);
          }
          if (level1[i][c] == 'y') {
            yellowCube = new Sprite(id["black-cube.png"]);
            yellowCube.position.x = c * TILE_SIZE;
            yellowCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            gameSceneLevel1.addChild(yellowCube);
          }
          if (level1[i][c] == '.') {
            orangeBall = new Sprite(id["orange-ball.png"]);
            orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
            orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
            gameSceneLevel1.addChild(orangeBall);
            orangeBalls.push(orangeBall);
          }
          if (level1[i][c] == 'v') {
            greenCube = new Sprite(id["black-cube.png"]);
            greenCube.position.x = c * TILE_SIZE;
            greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            greenCubes.push(greenCube);
            orangeBall = new Sprite(id["orange-ball.png"]);
            orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
            orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
            orangeBalls.push(orangeBall);
            gameSceneLevel1.addChild(greenCube, orangeBall);
          }
          if (level1[i][c] == 'w') {
            greenCube = new Sprite(id["black-cube.png"]);
            greenCube.position.x = c * TILE_SIZE;
            greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            gameSceneLevel1.addChild(greenCube);
            greenCubes.push(greenCube);
          }
          if (level1[i][c] == '_') {
            iceCube = new Sprite(id["box.png"]);
            iceCube.position.x = c * TILE_SIZE;
            iceCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            gameSceneLevel1.addChild(iceCube);
            iceCube.visible = false;
          }
          if (level1[i][c] == 'r') {
            redCube = new Sprite(id["black-cube.png"]);
            redCube.position.x = c * TILE_SIZE;
            redCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
            gameSceneLevel1.addChild(redCube);
          }
        }
      }
    }
    
//    // Create maze level2
//    if (activeLevel == 2) {
////      boxes = [], ghosts = [], orangeBalls = [], pinkBalls = [], greenCubes = [];
//      for (let i = 0; i < level2.length; i++) {
//        for (let c = 0; c < level2[i].length; c++) {
//          if (level2[i][c] == 'b') {
//            box = new Sprite(id["ice-cube.png"]);
//            box.position.x = c * TILE_SIZE;
//            box.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            gameSceneLevel2.addChild(box);
//            boxes.push(box);
//          }
//          if (level2[i][c] == 'a') {
//            pinkBall = new Sprite(id["pink-ball.png"]);
//            pinkBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - pinkBall.width/2;
//            pinkBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - pinkBall.height/2;
//            gameSceneLevel2.addChild(pinkBall);
//            pinkBalls.push(pinkBall);
//          }
//          if (level2[i][c] == 'y') {
//            yellowCube = new Sprite(id["yellow-cube.png"]);
//            yellowCube.position.x = c * TILE_SIZE;
//            yellowCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            gameSceneLevel2.addChild(yellowCube);
//          }
//          if (level2[i][c] == '.') {
//            orangeBall = new Sprite(id["orange-ball.png"]);
//            orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
//            orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
//            gameSceneLevel2.addChild(orangeBall);
//            orangeBalls.push(orangeBall);
//          }
//          if (level2[i][c] == 'v') {
//            greenCube = new Sprite(id["green-cube.png"]);
//            greenCube.position.x = c * TILE_SIZE;
//            greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            greenCubes.push(greenCube);
//            orangeBall = new Sprite(id["orange-ball.png"]);
//            orangeBall.position.x = c * TILE_SIZE + TILE_SIZE/2 - orangeBall.width/2;
//            orangeBall.position.y = i * TILE_SIZE + 2*TILE_SIZE + TILE_SIZE/2 - orangeBall.height/2;
//            orangeBalls.push(orangeBall);
//            gameSceneLevel2.addChild(greenCube, orangeBall);
//          }
//          if (level2[i][c] == 'w') {
//            greenCube = new Sprite(id["green-cube.png"]);
//            greenCube.position.x = c * TILE_SIZE;
//            greenCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            gameSceneLevel2.addChild(greenCube);
//            greenCubes.push(greenCube);
//          }
//          if (level2[i][c] == '_') {
//            iceCube = new Sprite(id["box.png"]);
//            iceCube.position.x = c * TILE_SIZE;
//            iceCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            gameSceneLevel2.addChild(iceCube);
//            iceCube.visible = false;
//          }
//          if (level2[i][c] == 'r') {
//            redCube = new Sprite(id["red-cube.png"]);
//            redCube.position.x = c * TILE_SIZE;
//            redCube.position.y = i * TILE_SIZE + 2*TILE_SIZE;
//            gameSceneLevel2.addChild(redCube);
//          }
//        }
//      }
//    }
    
    frameIndex = 0;

    // Create pacman in `gameSceneLevel1`
    pacmanLevel1 = new Sprite(id[frames[frameIndex]]);
    frameTime = FRAMERATE;
    pacmanLevel1.position.set(PACMAN_START_X, PACMAN_START_Y);
    pacmanLevel1.vx = 0;
    pacmanLevel1.vy = 0;
    pacmanLevel1.scale.set(0.7);
    pacmanLevel1.eatGhost = false;

    // Create the red ghost called `devilLevel1`
    devilLevel1 = new Sprite(id["devil.png"]);
    devilLevel1.position.set(9*TILE_SIZE, 10*TILE_SIZE);
    devilLevel1.vx = -GHOST_SPEED;
    devilLevel1.vy = 0;
    devilLevel1.path = moves.LEFT;
    ghosts.push(devilLevel1);

    // Create the blue ghost called `princessLevel1`
    princessLevel1 = new Sprite(id["princess.png"]);
    princessLevel1.position.set(9*TILE_SIZE, 12*TILE_SIZE);
    princessLevel1.vx = 0;
    princessLevel1.vy = -GHOST_SPEED;
    princessLevel1.path = moves.UP;
    ghosts.push(princessLevel1);

    // Create the blue ghost called `cowboyLevel1`
    cowboyLevel1 = new Sprite(id["cowboy.png"]);
    cowboyLevel1.position.set(8*TILE_SIZE, 12*TILE_SIZE);
    cowboyLevel1.vx = GHOST_SPEED;
    cowboyLevel1.vy = 0;
    cowboyLevel1.path = moves.RIGHT;
    ghosts.push(cowboyLevel1);

    // Create the blue ghost called `foxLevel1`
    foxLevel1 = new Sprite(id["fox.png"]);
    foxLevel1.position.set(10*TILE_SIZE, 12*TILE_SIZE);
    foxLevel1.vx = -GHOST_SPEED;
    foxLevel1.vy = 0;
    foxLevel1.path = moves.LEFT;
    ghosts.push(foxLevel1);

    // Create pacman first life icon
    pacmanLevel1Life1 = new Sprite(id["pacman-open-right.png"]);
    pacmanLevel1Life1.position.set(TILE_SIZE, 24*TILE_SIZE+3);
    pacmanLevel1Life1.scale.set(0.8);

    // Create pacman second life icon
    pacmanLevel1Life2 = new Sprite(id["pacman-open-right.png"]);
    pacmanLevel1Life2.position.set(2*TILE_SIZE, 24*TILE_SIZE+3);
    pacmanLevel1Life2.scale.set(0.8);

    playerNameText = new PIXI.Text("PLAYER 1", style);
    playerNameText.position.set(2*TILE_SIZE, 6);

    playerScore = 0;
    playerScoreText = new PIXI.Text(playerScore.toString(), style);
    playerScoreText.position.set(2*TILE_SIZE, TILE_SIZE);

    gameSceneLevel1.addChild(pacmanLevel1, devilLevel1, princessLevel1, cowboyLevel1, foxLevel1, pacmanLevel1Life1, pacmanLevel1Life2,                                      playerNameText, playerScoreText
//                       timeMes, countdown
    );
    // End of create maze level1
        
//    let timeMes = new Text("COUNTDOWN", style);
//    timeMes.position.set(GAME_WIDTH-timeMes.width-2*TILE_SIZE, 6);
//    
//    let countdown = new Text("-:--", style);
//    countdown.position.set(GAME_WIDTH-countdown.width-2*TILE_SIZE, TILE_SIZE);
//    
//    
//    function startTimer() {
////      var today = new Date();
////      let day = new Date().getTime();
////      var h = today.getHours();
////      var m = today.getMinutes();
////      var s = today.getSeconds();
//      // add a zero in front of numbers<10
////      m = checkTime(m);
////      s = checkTime(s);
////      let time = "TIME " + h + ":" + m + ":" + s;
////      console.log(state == playing1)
//      if (seconds > 0) {
//        seconds -= 1;
//      } else if (seconds == 0 & minutes > 0) {
//        seconds = 59;
//        minutes -= 1;
//      } else if (seconds == 0 & minutes == 0) {
//        state = end;
//        message.text = "YOU LOST!";
//      }
////      console.log(time);
////      timeMes.text = time;
//      seconds = checkTime(seconds);
//      countdown.text = minutes + ":" + seconds;
//      let t = setTimeout(function() {
//        startTimer()
//      }, 1000);
//    }
//    
//    startTimer();

    // END `gameSceneLevel2`
    
    // CREATE `gameOverScene`
    message = new Text("THE END OF GAME!", {font: "60px Consolas", fill: "#ffcc00"});
                      //YOU WON LEVEL 1!  
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
    
    restartGameTooltip = new Text("BACK TO MENU", textstyle);
    restartGameTooltip.position.set(btnPlayOver.x+btnPlayOver.width/2-restartGameTooltip.width/2, btnPlayOver.y-26);
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
//      if (lifeCounter == 0 || activeLevel == 2) 
      location.reload(); // game restart  = reload browser window
//      if (lifeCounter >= 0 && activeLevel == 1) {
//        activeLevel = 2;
//        gameSceneLevel2.visible = true;
//        gameOverScene.visible = false;
////        pacman = pacmanLevel2;
//        state = playing2;
////        state = menu;
      }
    
    
    gameOverScene.addChild(message, btnPlay, btnPlayOver, restartGameTooltip);
    // END `gameOverScene`
    
    // STAGE
    stage.addChild(menuScene, gameSceneLevel1, gameOverScene, settingsScene, helpScene, pauseScene);
    
    // Move the pacman
    // Right arrow key `press` method
    right.press = () => {
      if (activeLevel == 1) {
        pacmanLevel1.vx = SPEED;
        pacmanLevel1.vy = 0;
      }
//      if (activeLevel == 2) {
//        pacmanLevel2.vx = SPEED;
//        pacmanLevel2.vy = 0;
//      }
      frames = framesRight;
      rightPressed = true;
      leftPressed = false;
      upPressed = false;
      downPressed = false;
    }

    // Left arrow key `press` method
    left.press = () => {
      if (activeLevel == 1) {
        pacmanLevel1.vx = -SPEED;
        pacmanLevel1.vy = 0;
      }
//      if (activeLevel == 2) {
//        pacmanLevel2.vx = -SPEED;
//        pacmanLevel2.vy = 0;
//      }
      frames = framesLeft;
      leftPressed = true;
      rightPressed = false;
      upPressed = false;
      downPressed = false;
    }
    
    // Up arrow key `press` method
    up.press = () => {
      if (activeLevel == 1) {
        pacmanLevel1.vx = 0;
        pacmanLevel1.vy = -SPEED;
      }
//      if (activeLevel == 2) {
//        pacmanLevel1.vx = 0;
//        pacmanLevel1.vy = -SPEED;
//      }
      if (frames == framesRight) frames = framesRightUp;
      if (frames == framesLeft) frames = framesLeftUp;
      if (frames == framesRightDown) frames = framesLeftUp;
      if (frames == framesLeftDown) frames = framesRightUp;
      upPressed = true;
      rightPressed = false;
      leftPressed = false;
      downPressed = false;
    }

    // Down arrow key `press` method
    down.press = () => {
      if (activeLevel == 1) {
        pacmanLevel1.vx = 0;
        pacmanLevel1.vy = SPEED;
      }
//      if (activeLevel == 2) {
//        pacmanLevel1.vx = 0;
//        pacmanLevel1.vy = SPEED;
//      }
      if (frames == framesRight) frames = framesRightDown;
      if (frames == framesLeft) frames = framesLeftDown;
      if (frames == framesRightUp) frames = framesLeftDown;
      if (frames == framesLeftUp) frames = framesRightDown;
      downPressed = true;
      rightPressed = false;
      leftPressed = false;
      upPressed = false;
    }

    // ESC key `press` method
    esc.press = () => {
      escPressed = true;
      enterPressed = false;
      if (soundPacmanIntermission.playing()) {
        intermissionPlaying = true;
        soundPacmanIntermission.pause();
        pauseIntermission = soundPacmanIntermission.pause()._sounds[0]._seek;
      }
//      soundPacmanDeath.pause();
//      pausePacmanDeath = soundPacmanDeath.pause()._sounds[0]._seek;
//      pacman.vx = 0;
//      pacman.vy = 0;
//      devilLevel1.vx = 0;
//      devilLevel1.vy = 0;
//      princessLevel1.vx = 0;
//      princessLevel1.vy = 0;
//      cowboyLevel1.vx = 0;
//      cowboyLevel1.vy = 0;
//      foxLevel1.vx = 0;
//      foxLevel1.vy = 0;
    }
    
    // ENTER key `press` method
    enter.press = () => {
      enterPressed = true;
      escPressed = false;
      if (intermissionPlaying) {
        soundPacmanIntermission.seek(pauseIntermission);
        soundPacmanIntermission.play();
        intermissionPlaying = false;
      }
//      soundPacmanDeath.seek(pausePacmanDeath);
//      soundPacmanDeath.play();
    }
    
    lasttime = new Date().getTime();
    gameLoop();
  }
}

// Runs the current game `state` in a loop and render the sprites
function gameLoop() {

//  stats.begin();
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
//    if (activeLevel == 1) pacman = pacmanLevel1;
//    if (activeLevel == 2) pacman = pacmanLevel2;
    pacmanLevel1.texture = PIXI.Texture.fromFrame(frames[frameIndex]);
//    pacmanLevel2.texture = PIXI.Texture.fromFrame(frames2[frameIndex]);
    pacmanMenu.texture = PIXI.Texture.fromFrame(frames[frameIndex]);
    frameTime = FRAMERATE;
  }
  
  // Render the stage - Tell the `renderer` to render the `stage`
  renderer.render(stage);

  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  
  lasttime = currtime;

//  stats.end();
}

// Logic in `menuScene`
function menu() {
  helpScene.visible = false;
  settingsScene.visible = false;
  gameOverScene.visible = false;
  menuScene.visible = true;
  
  let pacmanHitOrangeBall = false;
  let pacmanHitBox = contain(pacmanMenu, {x: 4*TILE_SIZE+TILE_SIZE/2,
                                          y: 12*TILE_SIZE-TILE_SIZE/2,
                                          width: 15*TILE_SIZE-TILE_SIZE/2, 
                                          height: 13*TILE_SIZE+TILE_SIZE/2
                                         });

  if (pacmanHitBox === "left") {
    frames = framesRight;
    pacmanMenu.vx *= -SPEED;
    orangeBallsMenu.forEach( (orangeBall) => {
      orangeBall.visible = true;
    });
  }
  
  if (pacmanHitBox === "right") {
    frames = framesLeft;
    pacmanMenu.vx *= -SPEED;
    orangeBallsMenu.forEach( (orangeBall) => {
      orangeBall.visible = true;
    });
  }
  
  pacmanMenu.x += pacmanMenu.vx;
  
  // Check for a collision between the balls and the pacman
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

// Logic in `helpScene`
function help() {
  menuScene.visible = false;
  helpScene.visible = true;
}

// Logic in `settingsScene`
function settings() {
  menuScene.visible = false;
  settingsScene.visible = true;
}

// Logic in `pauseScene`
function pause() {
  if (activeLevel == 1) gameSceneLevel1.visible = false;
//  if (activeLevel == 2) gameSceneLevel2.visible = false;
  pauseScene.visible = true;
//  menuScene.visible = false;
//  musicPacmanBeginning.stop();
  
  if (enterPressed) {
    enterPressed = false;
    state = playing1;
//    minutes = tempMinutes;
//    seconds = tempSeconds;
  }
}

// All the game logic goes here
// This is your game loop, where you can move sprites and add your game logic
// Logic in `gameSceneLevel1`
function playing1() {
//  console.log(activeLevel)

  musicPacmanBeginning.stop();
  gameOverScene.visible = false;
  menuScene.visible = false;
  pauseScene.visible = false;
  gameSceneLevel1.visible = true;
  
  if (activeLevel == 1) {
    pacman = pacmanLevel1;
    pacman.x += pacman.vx;
    pacman.y += pacman.vy;
    pacmanLife1 = pacmanLevel1Life1;
    pacmanLife2 = pacmanLevel1Life2;
    devil = devilLevel1;
    cowboy = cowboyLevel1;
    princess = princessLevel1;
    fox = foxLevel1;
//    console.log(pacman.x, pacman.y)
    if (pacman.x === -26 && (pacman.y === 384 || pacman.y === 385 || pacman.y === 386 || pacman.y === 387 || 
                             pacman.y === 388 || pacman.y === 389 || pacman.y === 390 || pacman.y === 391 ||
                             pacman.y === 392)
       ) {
      pacman.position.set(GAME_WIDTH+10, pacman.y);
    } else if (pacman.x === GAME_WIDTH+10 && (pacman.y === 384 || pacman.y === 385 || pacman.y === 386 || 
                                              pacman.y === 387 || pacman.y === 388 || pacman.y === 389 || 
                                              pacman.y === 390 || pacman.y === 391 || pacman.y === 392)
              ) {
      pacman.position.set(-26, pacman.y);
    }
  }
  
  controls();
}

//function playing2() {
//  
//  menuScene.visible = false;
//  gameOverScene.visible = false;
//  pauseScene.visible = false;
//  gameSceneLevel2.visible = true;
////  console.log('2')
////  if (activeLevel == 2) {
////    pacman = pacmanLevel1;
////    pacman.x += pacman.vx;
////    pacman.y += pacman.vy;
////    pacmanLife1 = pacmanLevel1Life1;
////    pacmanLife2 = pacmanLevel1Life2;
////    devil = devilLevel1;
////    cowboy = cowboyLevel1;
////    princess = princessLevel1;
////    fox = foxLevel1;
////    if (pacman.x === -26 && (pacman.y === 513 || pacman.y === 514 || pacman.y === 515 || pacman.y === 516 ||
////                             pacman.y === 517 || pacman.y === 518 || pacman.y === 519 || pacman.y === 520)
////       ) {
////      pacman.position.set(GAME_WIDTH+10, pacman.y);
////    } else if (pacman.x === GAME_WIDTH+10 && (pacman.y === 513 || pacman.y === 514 || pacman.y === 515 ||
////                                              pacman.y === 516 || pacman.y === 517 || pacman.y === 518 ||
////                                              pacman.y === 519 || pacman.y === 520)
////              ) {
////      pacman.position.set(-26, pacman.y);
////    }
////    if (pacman.x === -26 && (pacman.y === 322 || pacman.y === 323 || pacman.y === 324 || pacman.y === 325 ||
////                             pacman.y === 326 || pacman.y === 327 || pacman.y === 328)
////       ) {
////      pacman.position.set(GAME_WIDTH+10, pacman.y);
////    } else if (pacman.x === GAME_WIDTH+10 && (pacman.y === 322 || pacman.y === 323 || pacman.y === 324 ||
////                                              pacman.y === 325 || pacman.y === 326 || pacman.y === 327 ||
////                                              pacman.y === 328)
////              ) {
////      pacman.position.set(-26, pacman.y);
////    }
////  
////  controls();
//}

function controls() {
  
  if (escPressed) {
    escPressed = false;
    state = pause;
//    tempMinutes = minutes;
//    tempSeconds = seconds;
  }
  
  let pacmanHitBox = false;
  let pacmanHitOrangeBall = false;
  let pacmanHitPinkBall = false;
  let pacmanHitGhost = false;
  let ghostHitBox = false;
  
  // Move the ghosts
  moveGhost(devil);
  ghostMoving(devil);
 
  if (playerScore >= 300) {
    moveGhost(princess);
    ghostMoving(princess);
  }
    
  if (playerScore >= 600) {
    moveGhost(cowboy);
    ghostMoving(cowboy);
  }
  
  if (playerScore >= 900) {
    moveGhost(fox);
    ghostMoving(fox);
  }
  
  if (hitTestRectangle(pacman, iceCube)) {
    pacman.vx = 0;
    pacman.vy = 0;
    pacman.x -= OFFSET;
  }
  
  // Check for a collision between the pacman and the boxes
  boxes.forEach( (box) => {
    
    if (hitTestRectangle(pacman, box)) {
      pacmanHitBox = true;
    }
    
    if (pacmanHitBox) {
      pacmanHitBox = false;
      pacman.vx = 0;
      pacman.vy = 0;
      
      // pacman control
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
  
  // Check for a collision between the ghosts and the boxes
  boxes.forEach( (box) => {
    
    ghosts.forEach( (ghost) => {
      
      if (hitTestRectangle(ghost, box)) {
        ghostHitBox = true;
      }

      if (ghostHitBox) {
        ghostHitBox = false;
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
  
  // Check for a collision between the ghost and the pacman
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
//        ghost.position.set();
        
        for (let i = 0; i < ghosts.length; i++) {
          if (ghosts[i] == 0) {
            ghost.setTexture(id["devil.png"]);
          } else if (ghosts[i] == 1) {
            ghost.setTexture(id["princess.png"]);
          } else if (ghosts[i] == 2) {
            ghost.setTexture(id["cowboy.png"]);
          } else if (ghosts[i] == 3) {
            ghost.setTexture(id["fox.png"]);
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
          if (activeLevel == 1) gameSceneLevel1.removeChild(pacmanLife2);
//          if (activeLevel == 2) gameSceneLevel2.removeChild(pacmanLife2);
          lifeCounter -= 1;
          pacman.position.set(PACMAN_START_X, PACMAN_START_Y);
          pacman.vx = 0;
          pacman.vy = 0;
          frames = framesRight;
        }
        else if (lifeCounter === 1) {
          if (activeLevel == 1) gameSceneLevel1.removeChild(pacmanLife1);
//          if (activeLevel == 2) gameSceneLevel2.removeChild(pacmanLife2);
          lifeCounter -= 1;
          pacman.position.set(PACMAN_START_X, PACMAN_START_Y);
          pacman.vx = 0;
          pacman.vy = 0;
          frames = framesRight;
        }
        else if (lifeCounter === 0) {
          state = end;
          message.text = "    YOU LOST!   ";
        }
      }
    }
  });
    
  // Check for a collision between the balls and the pacman
  orangeBalls.forEach( (orangeBall) => {
    
    if (hitTestRectangle(pacman, orangeBall)) {
      pacmanHitOrangeBall = true;
//      console.log(orangeBalls)
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

      if (activeLevel == 1) gameSceneLevel1.removeChild(orangeBall);
//      if (activeLevel == 2) gameSceneLevel2.removeChild(orangeBall);

      if (orangeBalls.length === 0 && pinkBalls.length === 0) {
        state = end;
//        message.text = "YOU WON LEVEL " + activeLevel + "!";
        message.text = "    YOU WON!    ";
        
//        if (activeLevel == 1) restartGameTooltip.text = "PLAY NEXT LEVEL";
        if (activeLevel == 1) restartGameTooltip.text = "RESTART GAME!"
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
        devil.setTexture(id["devil-eat.png"]);
        princess.setTexture(id["princess-eat.png"]);
        cowboy.setTexture(id["cowboy-eat.png"]);
        fox.setTexture(id["fox-eat.png"]);
        // pacman eat ghost
        pacman.eatGhost = true;
        
        soundPacmanIntermission.on('end', () => {
          devil.setTexture(id["devil.png"]);
          princess.setTexture(id["princess.png"]);
          cowboy.setTexture(id["cowboy.png"]);
          fox.setTexture(id["fox.png"]);
          // pacman dont eat ghost
          pacman.eatGhost = false;
        });
      } else {
        soundPacmanIntermission.play();
        soundPacmanIntermission.volume(0);
        devil.setTexture(id["devil-eat.png"]);
        princess.setTexture(id["princess-eat.png"]);
        cowboy.setTexture(id["cowboy-eat.png"]);
        fox.setTexture(id["fox-eat.png"]);
        // pacman eat ghost
        pacman.eatGhost = true;
        
        soundPacmanIntermission.on('end', () => {
          devil.setTexture(id["devil.png"]);
          princess.setTexture(id["princess.png"]);
          cowboy.setTexture(id["cowboy.png"]);
          fox.setTexture(id["fox.png"]);
          // pacman dont eat ghost
          pacman.eatGhost = false;
        });
      }
      
      let i = pinkBalls.indexOf(pinkBall);
      if (i != -1) {
        pinkBalls.splice(i, 1);
        playerScore += PINKBALL_VALUE;
        playerScoreText.text = playerScore;
      }

      if (activeLevel == 1) gameSceneLevel1.removeChild(pinkBall);
//      if (activeLevel == 2) gameSceneLevel2.removeChild(pinkBall);

      if (pinkBalls.length === 0 && orangeBalls.length === 0) {
        state = end;
//        message.text = "YOU WON LEVEL " + activeLevel + "!";
        message.text = "    YOU WON!    ";
//        if (activeLevel == 1) restartGameTooltip.text = "PLAY NEXT LEVEL";
        if (activeLevel == 1) restartGameTooltip.text = "RESTART GAME!"
      }
    }
  });
  
  // Decide whether the game has been won or lost
  // Change the game 'state' to 'end' when the game is finsihed
  
}

// All the code that should run at the end of the game goes here
function end() {
  menuScene.visible = false;
  musicPacmanBeginning.stop();
  soundPacmanIntermission.stop();
//  gameSceneLevel2.visible = false;
  gameSceneLevel1.visible = false;
  gameOverScene.visible = true;
}

/* Helper functions */

// The `keyboard` helper function
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  
  // The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  
  // The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  // Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

// The `contain` function
function contain(sprite, container) {

  let collision = undefined;

  // Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  // Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  // Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  // Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  // Return the `collision` value
  return collision;
}

// The 'hitTestRectangle' function
function hitTestRectangle(r1, r2) {

  // Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  // hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  // Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    // A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      // There's definitely a collision happening
      hit = true;
    } else {

      // There's no collision on the y axis
      hit = false;
    }
  } else {

    // There's no collision on the x axis
    hit = false;
  }

  // `hit` will be either `true` or `false`
  return hit;
}

// The `hitGreenCube` function
function hitGreenCube(r1, r2) {
//  console.log(r2.x+r2.width/2, r2.y+r2.height/2)
  let hit, vx, vy;
  hit = false;
  
//  if ((r1.x+TILE_SIZE/2-2 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-2 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-2 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-1 < r2.y+TILE_SIZE/2) ||
//      (r1.x+TILE_SIZE/2-1 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-2 < r2.y+TILE_SIZE/2) ||
//      (r1.x+TILE_SIZE/2-2 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+1 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-2 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+2 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-1 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-2 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+1 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-2 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+2 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-2 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-1 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+1 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+1 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+2 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+2 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+2 > r2.y+TILE_SIZE/2) ||
//      (r1.x+TILE_SIZE/2+2 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-1 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+2 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+1 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-1 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-1 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2-1 < r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+1 > r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+1 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2-1 < r2.y+TILE_SIZE/2) || 
//      (r1.x+TILE_SIZE/2+1 > r2.x+TILE_SIZE/2 && r1.y+TILE_SIZE/2+1 > r2.y+TILE_SIZE/2)
//     ) {
//    r1.x = r2.x;
//    r1.y = r2.y;
//  }

  if (((r1.x+TILE_SIZE/2 == r2.x+TILE_SIZE/2) && (r1.y+TILE_SIZE/2 == r2.y+TILE_SIZE/2))) {
//    console.log(r1.x+TILE_SIZE/2, r1.y+TILE_SIZE/2, r2.x+r2.width/2, r2.y+r2.height/2)
    hit = true;

    if (hit) {
      direction = Math.floor((Math.random() * 4) + 1);
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
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }
  return hit;
}

// The `moveGhost` function
function moveGhost(ghostName) {
  
  ghostName.x += ghostName.vx;
  ghostName.y += ghostName.vy;
//  console.log(ghostName.x, ghostName.y)
  
  if (ghostName.x === -26 && (ghostName.y === 384 || ghostName.y === 320 || ghostName.y === 512)) {
    ghostName.position.set(GAME_WIDTH+10, ghostName.y);
  } else if (ghostName.x === GAME_WIDTH+10 && (ghostName.y === 384 || ghostName.y === 320 || ghostName.y === 512)) {
    ghostName.position.set(-26, ghostName.y)
  }
  
  greenCubes.forEach( (greenCube) => {
    if (hitGreenCube(ghostName, greenCube)) {
//      if ((ghostName.x+TILE_SIZE/2-2 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-2 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-2 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-1 < greenCube.y+TILE_SIZE/2) ||
//      (ghostName.x+TILE_SIZE/2-1 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-2 < greenCube.y+TILE_SIZE/2) ||
//      (ghostName.x+TILE_SIZE/2-2 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+1 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-2 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+2 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-1 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-2 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+1 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-2 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+2 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-2 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-1 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+1 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+1 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+2 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+2 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+2 > greenCube.y+TILE_SIZE/2) ||
//      (ghostName.x+TILE_SIZE/2+2 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-1 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+2 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+1 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-1 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-1 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2-1 < greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+1 > greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+1 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2-1 < greenCube.y+TILE_SIZE/2) || 
//      (ghostName.x+TILE_SIZE/2+1 > greenCube.x+TILE_SIZE/2 && ghostName.y+TILE_SIZE/2+1 > greenCube.y+TILE_SIZE/2)) {
//        ghostName.x = greenCube.x;
//        ghostName.y = greenCube.y;
//      }
//      ghostMoving(ghostName);
    }
  });
  
  if (hitYellowCube(ghostName, yellowCube)) {}
  
  if (hitRedCube(ghostName, redCube)) {}
  
}

// The `hitYellowCube` function
function hitYellowCube(r1, r2) {
  let hit, vx, vy;
  hit = false;
  if ((r1.x) == r2.x) {
    if ((r1.y) == r2.y) {
      hit = true;
      if (hit) {
        direction = 4;
        if (direction == 4) {
          r1.path = moves.LEFT
          r1.vx = -GHOST_SPEED
          r1.vy = 0
        }
      }
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }
  return hit;
}

// The `hitRedCube` function
function hitRedCube(r1, r2) {
  let hit, vx, vy;
  hit = false;
  if ((r1.x) == r2.x) {
    if ((r1.y) == r2.y) {
      hit = true;
      if (hit) {
        direction = 1;
        if (direction == 1) {
          r1.path = moves.UP
          r1.vx = 0
          r1.vy = -GHOST_SPEED
        }
      }
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }
  return hit;
}

let coorDevil = [], coorPrincess = [], coorCowboy = [], coorFox = [], movingDevilArray = [], movingPrincessArray = [],
    movingCowboyArray = [], movingFoxArray = [];

function ghostMoving(ghostName) {
  
//  console.log(ghostName._texture.textureCacheIds)
  
  if (ghostName._texture.textureCacheIds == "devil.png") {
//    console.log('devil')
    coorDevil.push(ghostName.x);
    coorDevil.push(ghostName.y);
    movingDevilArray.push(coorDevil);
    coorDevil = [];
//    console.log(movingDevilArray)
    if (movingDevilArray.length == 6) {
//      console.log(movingDevilArray[0], movingDevilArray[1], movingDevilArray[2], movingDevilArray[3], 
//                  movingDevilArray[4], movingDevilArray[5]);
      if (movingDevilArray[0][0] == movingDevilArray[1][0] && 
          movingDevilArray[1][0] == movingDevilArray[2][0] &&
          movingDevilArray[2][0] == movingDevilArray[3][0] &&
          movingDevilArray[3][0] == movingDevilArray[4][0] &&
          movingDevilArray[4][0] == movingDevilArray[5][0] &&
          movingDevilArray[0][1] == movingDevilArray[1][1] &&
          movingDevilArray[1][1] == movingDevilArray[2][1] &&
          movingDevilArray[2][1] == movingDevilArray[3][1] &&
          movingDevilArray[3][1] == movingDevilArray[4][1] &&
          movingDevilArray[4][1] == movingDevilArray[5][1]
         ) {
//          console.log('DEVIL!!!!!!!!!!!!!!!!')
//          console.log('!!!!!!!!!!!!!!!DEVIL!')
          ghostName.x = Math.round(movingDevilArray[0][0]/TILE_SIZE)*TILE_SIZE;
          ghostName.y = Math.round(movingDevilArray[0][1]/TILE_SIZE)*TILE_SIZE;
      }
//      console.log(movingDevilArray[0][0], movingDevilArray[0][1])
      movingDevilArray = []
    }
  }
  
  if (ghostName._texture.textureCacheIds == "princess.png") {
//    console.log('devil')
    coorPrincess.push(ghostName.x);
    coorPrincess.push(ghostName.y);
    movingPrincessArray.push(coorPrincess);
    coorPrincess = [];
//    console.log(movingDevilArray)
    if (movingPrincessArray.length == 6) {
//      console.log(movingPrincessArray[0], movingPrincessArray[1], movingPrincessArray[2], movingPrincessArray[3])
      if (movingPrincessArray[0][0] == movingPrincessArray[1][0] && 
          movingPrincessArray[1][0] == movingPrincessArray[2][0] &&
          movingPrincessArray[2][0] == movingPrincessArray[3][0] &&
          movingPrincessArray[3][0] == movingPrincessArray[4][0] &&
          movingPrincessArray[4][0] == movingPrincessArray[5][0] &&
          movingPrincessArray[0][1] == movingPrincessArray[1][1] &&
          movingPrincessArray[1][1] == movingPrincessArray[2][1] &&
          movingPrincessArray[2][1] == movingPrincessArray[3][1] &&
          movingPrincessArray[3][1] == movingPrincessArray[4][1] &&
          movingPrincessArray[4][1] == movingPrincessArray[5][1]
         ) {
//          console.log('PRINCESS!!!!!!!!!!!!!!!!')
//          console.log('!!!!!!!!!!!!!!!PRINCESS!')
          ghostName.x = Math.round(movingPrincessArray[0][0]/TILE_SIZE)*TILE_SIZE;
          ghostName.y = Math.round(movingPrincessArray[0][1]/TILE_SIZE)*TILE_SIZE;
      }
//      console.log(movingDevilArray[0][0], movingDevilArray[0][1])
      movingPrincessArray = []
    }
  }
  
  if (ghostName._texture.textureCacheIds == "cowboy.png") {
//    console.log('devil')
    coorCowboy.push(ghostName.x);
    coorCowboy.push(ghostName.y);
    movingCowboyArray.push(coorCowboy);
    coorCowboy = [];
//    console.log(movingDevilArray)
    if (movingCowboyArray.length == 6) {
//      console.log(movingPrincessArray[0], movingPrincessArray[1], movingPrincessArray[2], movingPrincessArray[3])
      if (movingCowboyArray[0][0] == movingCowboyArray[1][0] && 
          movingCowboyArray[1][0] == movingCowboyArray[2][0] &&
          movingCowboyArray[2][0] == movingCowboyArray[3][0] &&
          movingCowboyArray[3][0] == movingCowboyArray[4][0] &&
          movingCowboyArray[4][0] == movingCowboyArray[5][0] &&
          movingCowboyArray[0][1] == movingCowboyArray[1][1] &&
          movingCowboyArray[1][1] == movingCowboyArray[2][1] &&
          movingCowboyArray[2][1] == movingCowboyArray[3][1] &&
          movingCowboyArray[3][1] == movingCowboyArray[4][1] &&
          movingCowboyArray[4][1] == movingCowboyArray[5][1]
         ) {
//          console.log('COWBOY!!!!!!!!!!!!!!!!')
//          console.log('!!!!!!!!!!!!!!!COWBOY!')
          ghostName.x = Math.round(movingCowboyArray[0][0]/TILE_SIZE)*TILE_SIZE;
          ghostName.y = Math.round(movingCowboyArray[0][1]/TILE_SIZE)*TILE_SIZE;
      }
//      console.log(movingDevilArray[0][0], movingDevilArray[0][1])
      movingCowboyArray = []
    }
  }
  
  if (ghostName._texture.textureCacheIds == "fox.png") {
//    console.log('devil')
    coorFox.push(ghostName.x);
    coorFox.push(ghostName.y);
    movingFoxArray.push(coorFox);
    coorFox = [];
//    console.log(movingDevilArray)
    if (movingFoxArray.length == 6) {
//      console.log(movingPrincessArray[0], movingPrincessArray[1], movingPrincessArray[2], movingPrincessArray[3])
      if (movingFoxArray[0][0] == movingFoxArray[1][0] && 
          movingFoxArray[1][0] == movingFoxArray[2][0] &&
          movingFoxArray[2][0] == movingFoxArray[3][0] &&
          movingFoxArray[3][0] == movingFoxArray[4][0] &&
          movingFoxArray[4][0] == movingFoxArray[5][0] &&
          movingFoxArray[0][1] == movingFoxArray[1][1] &&
          movingFoxArray[1][1] == movingFoxArray[2][1] &&
          movingFoxArray[2][1] == movingFoxArray[3][1] &&
          movingFoxArray[3][1] == movingFoxArray[4][1] &&
          movingFoxArray[4][1] == movingFoxArray[5][1]
         ) {
//          console.log('FOX!!!!!!!!!!!!!!!!')
//          console.log('!!!!!!!!!!!!!!!FOX!')
          ghostName.x = Math.round(movingFoxArray[0][0]/TILE_SIZE)*TILE_SIZE;
          ghostName.y = Math.round(movingFoxArray[0][1]/TILE_SIZE)*TILE_SIZE;
      }
//      console.log(movingDevilArray[0][0], movingDevilArray[0][1])
      movingFoxArray = []
    }
  }
}

/* #GAME SCRIPTS END# */
