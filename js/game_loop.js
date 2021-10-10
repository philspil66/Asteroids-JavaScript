/*
Asteroids-JS
This is a modern JS reboot of the classic 1979 Atari space shoot-em up game

Copyright (C) 2021  Phil Spilsbury - <philspil66@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

// keyboard handler

var Key = {
  _pressed: {},
  isDown: function isDown(keyCode) {
    return this._pressed[keyCode];
  },
  onKeydown: function onKeydown(event) {
    this._pressed[event.keyCode] = true;
  },
  onKeyup: function onKeyup(event) {
    delete this._pressed[event.keyCode];
  }
};
window.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);
window.addEventListener("keydown", function (event) {
  Key.onKeydown(event);
  if ([32, 37, 38, 39, 40, 13, 46].indexOf(event.keyCode) > -1) {
    event.preventDefault();
  }
}, false);

// Game object
var Game = {
  fps: 60,
  width: 750,
  height: 700,
  radius: 300,
  level: 1,
  life: 3
};

// Screens objects
var playScreen = {};
var gameOverScreen = {};
gameOverScreen.keyListener = window.addEventListener("keydown", function (event) {
  for (var i = 48; i <= 90; i++) {
    if (event.which === i && gameOverScreen.name.length <= 5) {
      gameOverScreen.name += String.fromCharCode(i);
    }
  }
});
var startScreen = {};
var instructionsScreen = {};
var highScoreScreen = {};

// Sounds assets
var extraShipURL = "assets/sounds/extra_life.wav";
var saucerSmallURL = "assets/sounds/saucer_small.wav";
var saucerBigURL = "assets/sounds/saucer_big.wav";
var thrustURL = "assets/sounds/thrust.wav";
var fireURL = "assets/sounds/fire.wav";
var fireSaucerURL = "assets/sounds/saucer_fire.wav";
var bangSmallURL = "assets/sounds/explode_small.wav";
var bangMediumURL = "assets/sounds/explode_medium.wav";
var bangLargeURL = "assets/sounds/explode_large.wav";
var beat1URL = "assets/sounds/wavy_beat1.wav";
var beat2URL = "assets/sounds/wavy_beat2.wav";

// sound factory
function soundFactory(audio, overide, start, stop) {
  return function () {
    if (start !== undefined && stop !== undefined && audio.paused) {
      audio.pause();
      audio.currentTime = start;
      audio.play();
      setTimeout(function () {
        return audio.pause();
      }, stop);
    } else if (audio.paused || audio.currentTime / audio.duration > 0.9 || overide) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  };
}

Game._onEachFrame = function () {
  if (window.RequestAnimationFrame) {
    return function (cb) {
      var _cb = function _cb() {
        cb();window.RequestAnimationFrame(_cb);
      };
      _cb();
    };
  } else {
    return function (cb) {
      setInterval(cb, 1000 / Game.fps);
    };
  }
}();

// Game methods
Game.start = function () {
  Game.canvas = document.createElement("canvas"); // Create canvas
  Game.canvas.setAttribute("id", "game");
  Game.canvas.width = Game.width;
  Game.canvas.height = Game.height;
  Game.context = Game.canvas.getContext("2d"); // Get canvas context
  Game.context.shadowColor = "#888";
  Game.context.shadowOffsetX = 0;
  Game.context.shadowOffsetY = 0;
  Game.context.shadowBlur = 20;
  document.getElementById("game-frame").appendChild(Game.canvas); // Add canvas to game-frame

  // Sounds
  Game.extraShipSound = new Audio(extraShipURL);
  Game.saucerSmallSound = new Audio(saucerSmallURL);
  Game.saucerBigSound = new Audio(saucerBigURL);
  Game.thrustSound = new Audio(thrustURL);
  Game.firePlayerSound = new Audio(fireURL);
  Game.fireSaucerSound = new Audio(fireSaucerURL);
  Game.bangSmallSound = new Audio(bangSmallURL);
  Game.bangMediumSound = new Audio(bangMediumURL);
  Game.bangLargeSound = new Audio(bangLargeURL);
  Game.beat1Sound = new Audio(beat1URL);
  Game.beat2Sound = new Audio(beat2URL);

  Game.extraShip = soundFactory(Game.extraShipSound);
  Game.saucerSmall = soundFactory(Game.saucerSmallSound, false, 0, 130);
  Game.saucerBig = soundFactory(Game.saucerBigSound, false, 0, 130);
  Game.thrust = soundFactory(Game.thrustSound, false, 0, 300);
  Game.firePlayer = soundFactory(Game.firePlayerSound, true);
  Game.fireSaucer = soundFactory(Game.fireSaucerSound);
  Game.bangSmall = soundFactory(Game.bangSmallSound);
  Game.bangMedium = soundFactory(Game.bangMediumSound);
  Game.bangLarge = soundFactory(Game.bangLargeSound);
  Game.beat1 = soundFactory(Game.beat1Sound, true);
  Game.beat2 = soundFactory(Game.beat2Sound, true);

  // run loop
  Game.changeState(startScreen);
  Game._onEachFrame(Game.run);
};

Game.changeState = function (screen) {
  Game.keyTimeout = Date.now() + 200;
  screen.init();
  Game.draw = screen.draw;
  Game.update = screen.update;
};

Game.run = function () {
  var loops = 0,
      skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = new Date().getTime(),
      lastGameTick = void 0;
  return function () {
    loops = 0;
    while (new Date().getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    if (loops) Game.draw();
  };
}();
