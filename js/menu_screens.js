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

var gameOverPositions = [[170, 370], [230, 420]];
var startScreenPositions = [[230, 310], [170, 360]];

creditsScreen.init = function () {
  creditsScreen.asteroids = makeAsteroids(3, 0, 1);
};
creditsScreen.draw = function () {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  creditsScreen.asteroids.forEach(function (asteroid) {
    return asteroid.draw();
  });
  // draw board
  // add text
  writeCentered(80, "asteroids", 4);
  writeText(50, 200, "This is a reboot of the classic 1979 Atari game", 1);
  writeText(50, 220, "Asteroids, built in HTML5/JS. You can find more", 1);
  writeText(50, 240, "information about the project in it's github page:", 1);
  writeCentered(280, "https://github.com/philspil66/Asteroids-JS", 0.8);
  writeCentered(500, "Copyright (C) 2021  TRAXX SOFTWARE", 0.9);

  writeCentered(550, "esc - go back");
};
creditsScreen.update = function () {
  creditsScreen.asteroids.forEach(function (asteroid) {
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
  writeCentered(80, "asteroids ", 5, 5);
  //writeCentered(150, "JS Reboot", 2.7);
  writeCentered(300, "PLAY", 2);
  writeCentered(350, "credits", 2);
  writeCentered(500, "enter - Play Game      esc - go back", 1);
  writeCentered(520, "controls - arrows and spacebar", 1);
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
    else if (startScreen.arrow.current === 1) Game.changeState(creditsScreen);
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
  writeCentered(140, 'YOUR SCORE', 3);
  writeCentered(220, Game.score.score.toString(), 5);
  writeCentered(360, "play again", 2);
  writeCentered(410, "menu", 2);
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
