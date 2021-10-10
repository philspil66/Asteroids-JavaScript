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

// These are the positions of the game over menu items [horizontal,vertical]
var gameOverPositions = [[240, 370], [300, 420]];
// These are the positions of the initial game menu items  [horizontal,vertical]
var startScreenPositions = [[300, 280], [250, 330]];

instructionsScreen.init = function () {
  instructionsScreen.asteroids = makeAsteroids(3, 0, 1);
};

instructionsScreen.draw = function () {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  instructionsScreen.asteroids.forEach(function (asteroid) {
    return asteroid.draw();
  });
  // add text
  writeCentered(80, "asteroids", 4, 3);
  writeCentered(150, "play guide", 3, 3);

  writeCentered(300, "enter - start Game", 1);
  writeCentered(320, "Left/Right arrows - rotate", 1);
  writeCentered(340, "Up arrow - thrust", 1);
  writeCentered(360, "Down arrow - Hyperspace jump", 1);
  writeCentered(380, "space bar - phaser", 1);

  writeCentered(520, "esc - go back to play", 1);

  writeCentered(660, "1979 Atari Inc", 1);
};
instructionsScreen.update = function () {
  instructionsScreen.asteroids.forEach(function (asteroid) {
    return asteroid.update();
  });
  if (Key.isDown(27)) {
    Game.beat1();
    Game.beat2();
    Game.changeState(startScreen);
  }
};

startScreen.init = function () {
  startScreen.arrow = new ShipCursor(startScreenPositions, playerVectors, 3);
  startScreen.asteroids = makeAsteroids(5, 3, 3);
};
startScreen.draw = function () {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  startScreen.asteroids.forEach(function (asteroid) {
    return asteroid.draw();
  });
  startScreen.arrow.draw();
  writeCentered(80, "asteroids ", 5, 6);
  writeCentered(270, "PLAY", 2, 3);
  writeCentered(320, "play guide", 2, 3);
  writeCentered(450, "1 COIN 1 PLAY", 2.5, 3);
  writeCentered(660, "1979 Atari Inc", 1);
};
startScreen.update = function () {
  startScreen.arrow.update();
  startScreen.asteroids.forEach(function (asteroid) {
    return asteroid.update();
  });
  if (Key.isDown(13)) {
    if (Game.keyTimeout > Date.now()) return;
    Game.keyTimeout = Date.now() + 200;
    Game.beat1();
    Game.beat2();
    if (startScreen.arrow.current === 0) Game.changeState(playScreen);
    else if (startScreen.arrow.current === 1) Game.changeState(instructionsScreen);
  }
};

gameOverScreen.init = function () {
  gameOverScreen.arrow = new ShipCursor(gameOverPositions, playerVectors, 3);
  gameOverScreen.asteroids = makeAsteroids(2, 2, 2);
  gameOverScreen.cursor = 0;
  gameOverScreen.name = "";
  gameOverScreen.alreadyPosted = false;
  gameOverScreen.blinkInterval = setInterval(function () {
    gameOverScreen.blink = true;
    setTimeout(function () {
      return gameOverScreen.blink = false;
    }, 400);
  }, 800);
};
gameOverScreen.draw = function () {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  gameOverScreen.asteroids.forEach(function (asteroid) {
    return asteroid.draw();
  });
  gameOverScreen.arrow.draw();
  writeCentered(60, "GAME OVER", 5);
  writeCentered(160, 'YOUR SCORE', 3);
  writeCentered(220, Game.score.score.toString(), 5);
  writeCentered(360, "play again", 2);
  writeCentered(410, "menu", 2);
  writeCentered(660, "1979 Atari Inc", 1);
};
gameOverScreen.update = function () {
  gameOverScreen.arrow.update();
  gameOverScreen.asteroids.forEach(function (asteroid) {
    return asteroid.update();
  });
  if (Game.keyTimeout > Date.now()) return;
  Game.keyTimeout = Date.now() + 150;
  if (Key.isDown(13)) {
    Game.beat1();
    Game.beat2();
    if (gameOverScreen.arrow.current === 0) Game.changeState(playScreen);
    else if (gameOverScreen.arrow.current === 1) Game.changeState(startScreen);
  } else if (Key.isDown(27)) {
    Game.beat1();
    Game.beat2();
    Game.changeState(playScreen);
  }
};
