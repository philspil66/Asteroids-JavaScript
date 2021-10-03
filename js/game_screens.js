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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var p1Spawn = [Game.width / 2, Game.height / 2];
var playerVectors = [[[5, 0], [-4, -3], [-3, -2], [-3, 2], [-4, 3], [5, 0]]];
var playerKeys = {
  keyUp: 32,
  keyDown: 38,
  keyLeft: 37,
  keyRight: 39,
  hyperSpace: 40
};
var BIG_SAUCER = 5;
var SMA_SAUCER = 2.5;
var BIG_ASTEROID = 12;
var MED_ASTEROID = 6;
var SMA_ASTEROID = 3;
var ASTEROID_MAX_SPEED = 3;
var SAUCER_SCHEDULE = 6000;
var saucerVectors = [[[-1, 0], [1, 1], [5, 1], [7, 0], [5, -1], [1, -1], [-1, 0]], [[2, 1], [2.5, 2], [3.5, 2], [4, 1]], [[-1, 0], [7, 0]]];
var LEVEL_BASE = 3;
var NEW_LIFE_SCORE = 10000;
var SPAWN_DISTANCE = 200;
var STARTING_LIFES = 3;
var HALO_SIZE = 70;

playScreen.init = function () {
  // Create players
  Game.player = new (Function.prototype.bind.apply(Ship, [null].concat(p1Spawn, [playerKeys, playerVectors, 1.5, Game.firePlayer])))();
  Game.player.updateRotation(Math.random() * Math.PI * 2);
  Game.asteroids = [];
  Game.saucer = new Ship(0, 0, {}, saucerVectors, 5, Game.fireSaucer);
  Game.saucer.updateRotation(Math.PI * 2);
  Game.saucer.dead = true;
  Game.saucer.hidden = true;
  Game.debris = new Debris(Game.player.x, Game.player.y, Game.player.speedX, Game.player.speedY);
  Game.debris.hidden = true;
  Game.score = new Score(20, 20, 2);
  Game.lifeIndicator = [];
  Game.level = 1;
  Game.life = STARTING_LIFES;
  for (var i = 0; i < Game.life; i++) {
    var indicator = new ShipCursor([[30 + 20 * i, 60]], playerVectors, 1.5);
    indicator.updateRotation(3 * Math.PI / 2);
    Game.lifeIndicator.push(indicator);
  }
  playScreen.interval = false;
  playScreen.newLifeAt = NEW_LIFE_SCORE;
  playScreen.loadAsteroids = true;
  playScreen.spawnDistance = SPAWN_DISTANCE;
};

playScreen.draw = function () {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  // draw sprites
  Game.player.draw();
  Game.asteroids.forEach(function (value) {
    return value.draw();
  });
  if (!Game.saucer.hidden) Game.saucer.draw();
  if (!Game.debris.hidden) Game.debris.draw();

  Game.score.draw();
  Game.lifeIndicator.forEach(function (value) {
    return value.draw();
  });
  if (!document.hasFocus()) {
    writeCentered(Game.height / 2, "PAUSED", 4);
  }
  if (playScreen.spawnHalo) {
    drawCircle(Game.player.x, Game.player.y, playScreen.haloSize);
    playScreen.haloSize *= 0.90;
  }
  writeCentered(610, "1979 Atari Inc", 1);
};

playScreen.update = function () {
  if (Key.isDown(27)) {
    // Game.blip4();
    Game.changeState(startScreen);
  }
  if (!document.hasFocus()) {
    return;
  }
  // update sprites
  Game.asteroids.forEach(function (value) {
    return value.update();
  });
  if (!Game.debris.hidden) Game.debris.update();
  if (!Game.saucer.hidden) Game.saucer.update();
  Game.player.update();
  Game.debris.update();

  // check for collision
  Game.asteroids.forEach(function (asteroid) {
    // Shot-Asteroid collision
    Game.player.shots.forEach(function (shot) {
      if (playScreen.checkCollision(asteroid, shot) && !asteroid.dead && !shot.dead) {
        asteroid.explode();
        shot.explode();
      }
    });
    // Asteroid-Player collision
    if (playScreen.checkCollision(Game.player, asteroid) && !asteroid.dead && !Game.player.dead) {
      Game.player.explode();
      asteroid.explode();
    }
    // destroy asteroids
    if (asteroid.dead && !asteroid.splitted) {
      asteroid.splitted = true;
      if (asteroid.size == BIG_ASTEROID) {
        Game.score.score += 20;
        Game.asteroids.push(randomAsteroid(MED_ASTEROID, ASTEROID_MAX_SPEED, asteroid.x, asteroid.y));
        Game.asteroids.push(randomAsteroid(MED_ASTEROID, ASTEROID_MAX_SPEED, asteroid.x, asteroid.y));
      } else if (asteroid.size == MED_ASTEROID) {
        Game.score.score += 50;
        Game.asteroids.push(randomAsteroid(SMA_ASTEROID, ASTEROID_MAX_SPEED, asteroid.x, asteroid.y));
        Game.asteroids.push(randomAsteroid(SMA_ASTEROID, ASTEROID_MAX_SPEED, asteroid.x, asteroid.y));
      } else Game.score.score += 100;
    }
  });
  // Player, Shot and Saucer collision
  var collisionArr1 = Game.player.shots.slice();
  collisionArr1.push(Game.player);
  var collisionArr2 = Game.saucer.shots.slice();
  collisionArr2.push(Game.saucer);
  for (var i = 0; i < collisionArr1.length; i++) {
    for (var j = 0; j < collisionArr2.length; j++) {
      var sprite1 = collisionArr1[i];
      var sprite2 = collisionArr2[j];
      if (playScreen.checkCollision(sprite1, sprite2) && !sprite1.dead && !sprite2.dead) {
        sprite1.explode();
        sprite2.explode();
        if (sprite2 === Game.saucer) {
          if (Game.saucer.size === BIG_SAUCER) Game.score.score += 200;else Game.score.score += 1000;
        }
      }
    }
  }
  // clear dead asteroids
  var removeAsteroids = [];
  Game.asteroids.forEach(function (asteroid, index) {
    if (asteroid.done) removeAsteroids.push(index);
  });
  removeAsteroids.forEach(function (value) {
    return Game.asteroids.splice(value, 1);
  });
  // go to the next level
  if (Game.asteroids.length === 0 && Game.saucer.dead && playScreen.loadAsteroids) {
    setTimeout(function () {
      Game.level++;
      while (Game.asteroids.length < LEVEL_BASE + Game.level) {
        var asteroid = randomAsteroid(BIG_ASTEROID, ASTEROID_MAX_SPEED);
        var playerDistance = Math.hypot(asteroid.x - Game.player.x, asteroid.y - Game.player.y);
        if (playerDistance > playScreen.spawnDistance) Game.asteroids.push(asteroid);
      }
      playScreen.loadAsteroids = true;
    }, 1000);
    playScreen.loadAsteroids = false;
  }
  // check if saucer is dead and schedule a spawn
  if (Game.saucer.dead && !playScreen.sauceScheduled) {
    playScreen.sauceScheduled = true;
    var nextSaucer = (1 / Game.level + 1 + Math.random()) * SAUCER_SCHEDULE;
    setTimeout(playScreen.spawnSaucer, nextSaucer);
  }
  // check for dead player
  if (Game.player.dead && !playScreen.interval) {
    // game over when out of lifes
    playScreen.interval = true;
    Game.player.hidden = true;
    Game.debris = new Debris(Game.player.x, Game.player.y, Game.player.speedX, Game.player.speedY);
    setTimeout(function () {
      return Game.debris.hidden = true;
    }, 2000);
    if (Game.life <= 1) {
      setTimeout(function () {
        return Game.changeState(gameOverScreen);
      }, 1000);
    } else {
      Game.life--;
      Game.lifeIndicator.pop();
      setTimeout(playScreen.spawnPlayer, 1000);
    }
  }

  // Spawn new player when hyperspace button hit
  if (Game.player.hyperSpace == true && !playScreen.interval) {
    playScreen.interval = true;
    Game.player.hidden = true;
    setTimeout(playScreen.spawnPlayer, 50);
  }

  // Add new life when reaches a score
  if (Game.score.score >= playScreen.newLifeAt) {
    playScreen.newLifeAt += NEW_LIFE_SCORE;
    Game.extraShip();
    Game.life++;
    var indicator = new ShipCursor([[30 + 20 * Game.lifeIndicator.length, 60]], playerVectors, 1.5);
    indicator.updateRotation(3 * Math.PI / 2);
    Game.lifeIndicator.push(indicator);
  }

  // saucer AI
  if (!Game.saucer.dead) {
    // basic vectors
    var p1dx = Game.player.x - Game.saucer.x;
    var p1dy = Game.player.y - Game.saucer.y;
    var p1r = Math.hypot(p1dx, p1dy);
    // player angle in relation to saucer
    var angleDelta = (Math.atan2(p1dy, p1dx) - Game.saucer.rotation) % (Math.PI * 2);
    // Adjust angles and limit to ROTATION_SPEED
    angleDelta = angleDelta < Math.PI ? angleDelta : angleDelta - 2 * Math.PI;
    angleDelta = angleDelta < -Math.PI ? angleDelta + 2 * Math.PI : angleDelta;
    angleDelta = Math.abs(angleDelta) < ROTATION_SPEED ? angleDelta : Math.sign(angleDelta) * ROTATION_SPEED;
    // Apply actions
    Game.saucer.updateRotation(Game.saucer.rotation + angleDelta);
    if (p1r < SHOT_DISTANCE && angleDelta < ROTATION_SPEED) {
      Game.saucer.fire();
    }
    Game.saucer.fireThrusters();
  }
};

playScreen.spawnPlayer = function () {
  var x = Math.random() * Game.width / 2 + Game.width / 4;
  var y = Math.random() * Game.height / 2 + Game.height / 4;
  var objectTooClose = false;
  Game.asteroids.forEach(function (asteroid) {
    var playerDistance = Math.hypot(asteroid.x - x, asteroid.y - y);
    if (playerDistance < playScreen.spawnDistance) objectTooClose = true;
  });
  var playerDistance = Math.hypot(Game.saucer.x - x, Game.saucer.y - y);
  if (playerDistance < playScreen.spawnDistance || objectTooClose) objectTooClose = true;
  if (objectTooClose) {
    playScreen.spawnDistance -= 5;
    setTimeout(playScreen.spawnPlayer, 100);
    return;
  }
  playScreen.spawnDistance = SPAWN_DISTANCE;
  playScreen.interval = false;
  playScreen.haloSize = HALO_SIZE;
  playScreen.spawnHalo = true;
  setTimeout(function () {
    return playScreen.spawnHalo = false;
  }, 5000);
  Game.player = new Ship(x, y, playerKeys, playerVectors, 1.5, Game.firePlayer);
  Game.player.updateRotation(Math.random() * Math.PI * 2);
};

playScreen.spawnSaucer = function () {
  var x = Math.round(Math.random()) ? 0 : Game.width;;
  var y = Math.random() * Game.height;;
  var saucerSize = Math.random() >= 0.5 ? BIG_SAUCER : SMA_SAUCER;
  if (Math.hypot(Game.player.x - x, Game.player.y - y) < playScreen.spawnDistance) {
    playScreen.spawnSaucer();
    return;
  }
  Game.saucer = new Ship(x, y, {}, saucerVectors, saucerSize, Game.fireSaucer);
  Game.saucer.updateRotation(Math.PI);
  Game.saucer.updateRotation = function (angle) {
    return Game.saucer.rotation = angle;
  };
  Game.saucer.thrustersLength = 0;
  Game.saucer.shotDistance = SHOT_DISTANCE / 3;
  Game.saucer.maxSpeed = MAX_SPEED / 3;
  Game.saucer.shotInterval = SHOT_INTERVAL * 10;
  Game.saucer.thrustersAcceleration = THRUSTERS_ACCELERATION / 2;
  Game.saucer.blastSize = BLAST_SIZE / 2;
  Game.saucer.thrustSound = saucerSize === BIG_SAUCER ? Game.saucerBig : Game.saucerSmall;
  playScreen.sauceScheduled = false;
};
playScreen.rotateVector = function (vector, angle) {
  var x = vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle);
  var y = vector[1] * Math.cos(angle) + vector[0] * Math.sin(angle);
  return [x, y];
};

playScreen.checkCollision = function (sprite1, sprite2) {
  // Limits of the sprite
  var p1c = sprite1.corners;
  var p2c = sprite2.corners;
  // Translate sprites to make p1c[0] the origin
  var p1cT = sprite1.corners.map(function (val) {
    return [val[0] - p1c[0][0], val[1] - p1c[0][1]];
  });
  var p2cT = sprite2.corners.map(function (val) {
    return [val[0] - p1c[0][0], val[1] - p1c[0][1]];
  });
  // Calculate the rotation to align the p1 bounding box
  var angle = Math.atan2(p1cT[2][1], p1cT[2][0]);
  // Rotate vetcors to align
  var p1cTR = p1cT.map(function (val) {
    return playScreen.rotateVector(val, angle);
  });
  var p2cTR = p2cT.map(function (val) {
    return playScreen.rotateVector(val, angle);
  });
  // Calculate extreme points of the bounding boxes
  var p1left = Math.min.apply(Math, _toConsumableArray(p1cTR.map(function (value) {
    return value[0];
  })));
  var p1right = Math.max.apply(Math, _toConsumableArray(p1cTR.map(function (value) {
    return value[0];
  })));
  var p1top = Math.min.apply(Math, _toConsumableArray(p1cTR.map(function (value) {
    return value[1];
  })));
  var p1bottom = Math.max.apply(Math, _toConsumableArray(p1cTR.map(function (value) {
    return value[1];
  })));
  var p2left = Math.min.apply(Math, _toConsumableArray(p2cTR.map(function (value) {
    return value[0];
  })));
  var p2right = Math.max.apply(Math, _toConsumableArray(p2cTR.map(function (value) {
    return value[0];
  })));
  var p2top = Math.min.apply(Math, _toConsumableArray(p2cTR.map(function (value) {
    return value[1];
  })));
  var p2bottom = Math.max.apply(Math, _toConsumableArray(p2cTR.map(function (value) {
    return value[1];
  })));
  // Check if shadows overlap in both axes
  if (p2left < p1right && p1left < p2right && p2top < p1bottom && p1top < p2bottom) return true;
  return false;
};