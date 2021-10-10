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

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ROTATION_SPEED = 4 * Math.PI / 180;
var THRUSTERS_ACCELERATION = 0.05;
var MAX_SPEED = 2;
var THRUSTERS_LENGTH = 5;
var SHOT_DISTANCE = 500;
var SHOT_SPEED = 5;
var SHOT_SIZE = 1;
var SHOT_INTERVAL = 200;
var BLAST_SIZE = 20;
var ASTEROID_BREAK_SIZE = 5;
var VECTOR_COLOR = "#FFF";

function drawArray(array) {
  var _Game$context;

  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : VECTOR_COLOR;

  array = array.slice();
  // setup style
  Game.context.lineWidth = width;
  Game.context.strokeStyle = color;
  // go to starting position
  Game.context.beginPath();
  (_Game$context = Game.context).moveTo.apply(_Game$context, _toConsumableArray(array[0]));
  array.shift();
  // draw line
  array.forEach(function (value) {
    var _Game$context2;

    return (_Game$context2 = Game.context).lineTo.apply(_Game$context2, _toConsumableArray(value));
  });
  Game.context.stroke();
}

function drawCircle(x, y, radius) {
  var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : VECTOR_COLOR;

  // setup style
  Game.context.lineWidth = width;
  Game.context.strokeStyle = color;
  // draw circle
  Game.context.beginPath();
  Game.context.arc(x, y, radius, 0, 2 * Math.PI);
  Game.context.stroke();
}

function drawPoint(x, y) {
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : VECTOR_COLOR;

  drawArray([[x, y], [x + width, y + width]], width + 1);
}

function parsevarter(varter) {
  var limits = alphabeth[varter].match(/\D{2}/)[0].split("").map(function (value) {
    return value.charCodeAt(0) - 82;
  });
  var coordinates = alphabeth[varter].replace(/\d/g, "").split(" ").map(function (value, index) {
    return index === 0 ? value.slice(2) : value.slice(1);
  }).map(function (value) {
    return value.match(/(..?)/g);
  });
  if (coordinates[0] !== null) {
    coordinates = coordinates.map(function (value0) {
      return value0.map(function (value1) {
        return [value1.charCodeAt(0) - 82 - limits[0], value1.charCodeAt(1) - 82 + 6];
      });
    });
  } else {
    coordinates = [[0, 0]];
  }
  var finalPosition = limits[1] - limits[0];
  return [coordinates, finalPosition];
}

function phraseLength(phrase, size) {
  // returns the final position of a phrase
  var lastPosition = 0;
  phrase.split("").forEach(function (varter) {
    var _parsevarter = parsevarter(varter.toUpperCase()),
        _parsevarter2 = _slicedToArray(_parsevarter, 2),
        coordinates = _parsevarter2[0],
        finalPosition = _parsevarter2[1];

    lastPosition += finalPosition;
  });
  return lastPosition * size;
}

function writeText(x, y, text) {
  var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2;
  var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : VECTOR_COLOR;

  var lastPosition = 0;
  text.split("").forEach(function (varter) {
    var _parsevarter3 = parsevarter(varter.toUpperCase()),
        _parsevarter4 = _slicedToArray(_parsevarter3, 2),
        coordinates = _parsevarter4[0],
        finalPosition = _parsevarter4[1];

    coordinates.forEach(function (value) {
      value = value.map(function (element) {
        return [element[0] * size + x + lastPosition * size, element[1] * size + y];
      });
      drawArray(value, width, color);
    });
    lastPosition += finalPosition;
  });
}

function writeCentered(y, text) {
  var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : VECTOR_COLOR;

  var textLength = phraseLength(text, size);
  writeText(Game.width / 2 - textLength / 2, y, text, size, width, color);
}

function checkNumber(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

function randomCoords(offsetX, offsetY) {
  return [Math.random() + offsetX, Math.random() + offsetY];
}

function makeAsteroidVectors() {
  var vectors = [randomCoords(0, 0), randomCoords(1, 0), randomCoords(2, 0), randomCoords(3, 0), randomCoords(3, 1), randomCoords(2, 1), randomCoords(3, 2), randomCoords(3, 3), randomCoords(2, 3), randomCoords(1, 3), randomCoords(0, 3), randomCoords(0, 2), randomCoords(0, 1)];
  vectors.push(vectors[0]);
  return [vectors];
}

function randomAsteroid(size, maxSpeed, x, y) {
  var quadrant = Math.floor(Math.random() * 4 - 0.00001);
  if (x === undefined) {
    x = quadrant == 0 ? 0 : quadrant == 2 ? Game.width : Math.random() * Game.width;
  }
  if (y === undefined) {
    y = quadrant == 1 ? 0 : quadrant == 3 ? Game.width : Math.random() * Game.width;
  }
  var rotationSpeed = Math.random() * Math.PI / 36 - Math.PI / 72;
  var speedX = Math.random() * maxSpeed - maxSpeed / 2;
  var speedY = Math.random() * maxSpeed - maxSpeed / 2;
  return new Asteroid(x, y, makeAsteroidVectors(), size, rotationSpeed, speedX, speedY);
}

function makeAsteroids(big, med, sma) {
  var asteroids = [];
  for (var i = 0; i < big; i++) {
    asteroids.push(randomAsteroid(BIG_ASTEROID, ASTEROID_MAX_SPEED));
  }for (var _i = 0; _i < med; _i++) {
    asteroids.push(randomAsteroid(MED_ASTEROID, ASTEROID_MAX_SPEED));
  }for (var _i2 = 0; _i2 < sma; _i2++) {
    asteroids.push(randomAsteroid(SMA_ASTEROID, ASTEROID_MAX_SPEED));
  }return asteroids;
}

var BaseSprite = function () {
  function BaseSprite(x, y, shape, size) {
    var _this = this;

    _classCallCheck(this, BaseSprite);

    this.x = x;
    this.y = y;
    this.size = size;
    this.shape = shape.map(function (value0) {
      return value0.map(function (value1) {
        return [value1[0] * _this.size, value1[1] * _this.size];
      });
    });
    this.speedX = 0;
    this.speedY = 0;
    this.hidden = false;

    // find centroid
    var flat = [].concat.apply([], this.shape);
    this.left = Math.min.apply(Math, _toConsumableArray(flat.map(function (value) {
      return value[0];
    })));
    this.right = Math.max.apply(Math, _toConsumableArray(flat.map(function (value) {
      return value[0];
    })));
    this.top = Math.min.apply(Math, _toConsumableArray(flat.map(function (value) {
      return value[1];
    })));
    this.bottom = Math.max.apply(Math, _toConsumableArray(flat.map(function (value) {
      return value[1];
    })));
    this.center = [(this.left + this.right) / 2, (this.top + this.bottom) / 2];

    // translate center
    this.showShape = this.shape.map(function (value0) {
      return value0.map(function (value1) {
        return [value1[0] - _this.center[0], value1[1] - _this.center[1]];
      });
    });
  }

  _createClass(BaseSprite, [{
    key: "draw",
    value: function draw() {
      var _this2 = this;

      if (!this.hidden) {
        this.showShape.forEach(function (value) {
          return drawArray(value.map(function (vector) {
            return [vector[0] + _this2.x, vector[1] + _this2.y];
          }));
        });
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // border collision
      if (this.x <= 0) this.x = Game.width;
      if (this.x > Game.width) this.x = 0;
      if (this.y <= 0) this.y = 600;
      if (this.y > Game.height) this.y = 0;
    }
  }, {
    key: "resetSprite",
    value: function resetSprite(x, y) {
      var rotation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var speedX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var speedY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (checkNumber(speedX)) this.speedX = speedX;
      if (checkNumber(speedY)) this.speedY = speedY;
      if (checkNumber(rotation)) this.updateRotation(rotation);
      this.x = x;
      this.y = y;
    }
  }, {
    key: "respawnSprite",
    value: function respawnSprite() {
      var speedX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speedY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var angle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var location = Math.random() * Math.PI * 2;
      if (angle) location = angle;
      var x = (Game.radius - 10) * Math.cos(location) + Game.width / 2;
      var y = (Game.radius - 10) * Math.sin(location) + Game.height / 2;
      var rotation = Math.random() * Math.PI * 2;
      this.resetSprite(x, y, rotation, speedX, speedY);
    }
  }, {
    key: "rotateVector",
    value: function rotateVector(vector) {
      vector = [vector[0] - this.center[0], vector[1] - this.center[1]];
      var x = vector[0] * Math.cos(this.rotation) - vector[1] * Math.sin(this.rotation);
      var y = vector[1] * Math.cos(this.rotation) + vector[0] * Math.sin(this.rotation);
      return [x, y];
    }
  }, {
    key: "updateRotation",
    value: function updateRotation(angle) {
      var _this3 = this;

      if (checkNumber(angle)) this.rotation = angle;
      this.showShape = this.shape.map(function (value0) {
        return value0.map(function (value1) {
          return _this3.rotateVector(value1);
        });
      });
    }
  }, {
    key: "rear",
    get: function get() {
      var retval = this.rotateVector([this.left + this.center[0], (this.top + this.bottom) / 2 + this.center[1]]);
      retval = [retval[0] + this.x, retval[1] + this.y];
      return retval;
    }
  }, {
    key: "tip",
    get: function get() {
      var retval = this.rotateVector([this.right + this.center[0], (this.top + this.bottom) / 2 + this.center[1]]);
      retval = [retval[0] + this.x, retval[1] + this.y];
      return retval;
    }
  }, {
    key: "corners",
    get: function get() {
      var _this4 = this;

      var lt = this.rotateVector([this.left, this.top]);
      var rt = this.rotateVector([this.right, this.top]);
      var lb = this.rotateVector([this.left, this.bottom]);
      var rb = this.rotateVector([this.right, this.bottom]);
      var retval = [lt, rt, lb, rb].map(function (value) {
        return [value[0] + _this4.x, value[1] + _this4.y];
      });
      return retval;
    }
  }]);

  return BaseSprite;
}();

var Ship = function (_BaseSprite) {
  _inherits(Ship, _BaseSprite);

  function Ship(x, y, keys, shape, size, sound) {
    _classCallCheck(this, Ship);

    var _this5 = _possibleConstructorReturn(this, (Ship.__proto__ || Object.getPrototypeOf(Ship)).call(this, x, y, shape, size));

    _this5.keyUp = keys.keyUp;
    _this5.keyDown = keys.keyDown;
    _this5.keyLeft = keys.keyLeft;
    _this5.keyRight = keys.keyRight;
    _this5.hyperSpace = keys.hyperSpace;
    _this5.rotation = 0;
    _this5.speedX = 0;
    _this5.speedY = 0;
    _this5.shots = [];
    _this5.shotTimeout = Date.now();
    _this5.sound = sound;
    _this5.thrustSound = Game.thrust;
    _this5.thrustersLength = THRUSTERS_LENGTH;
    _this5.rotationSpeed = ROTATION_SPEED;
    _this5.maxSpeed = MAX_SPEED;
    _this5.shotInterval = SHOT_INTERVAL;
    _this5.thrustersAcceleration = THRUSTERS_ACCELERATION;
    _this5.blastSize = BLAST_SIZE;
    _this5.shotDistance = SHOT_DISTANCE;
    return _this5;
  }

  _createClass(Ship, [{
    key: "draw",
    value: function draw() {
      // draw ship
      _get(Ship.prototype.__proto__ || Object.getPrototypeOf(Ship.prototype), "draw", this).call(this);
      // draw thrusters fire
      if (this.thrusters && !this.dead) {
        var fireLength = Math.random() * this.thrustersLength * this.size;
        var fireArray = [this.rear, [this.rear[0] - fireLength * Math.cos(this.rotation), this.rear[1] - fireLength * Math.sin(this.rotation)]];
        drawArray(fireArray, 4);
      }
      // draw shots
      this.shots.forEach(function (shot) {
        return shot.draw();
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this6 = this;

      _get(Ship.prototype.__proto__ || Object.getPrototypeOf(Ship.prototype), "update", this).call(this);
      this.thrusters = false;
      if (!this.dead) {
        if (Key.isDown(this.keyUp)) {
          // fire weapon
          this.fire();
        };
        if (Key.isDown(this.keyDown)) {
          this.fireThrusters();
        };
        if (Key.isDown(this.keyLeft) || Key.isDown(this.keyRight)) {
          // rotate ship
          this.rotation += Key.isDown(this.keyRight) ? this.rotationSpeed : -this.rotationSpeed;
          this.rotation %= 2 * Math.PI;
          this.updateRotation();
        };
        if (Key.isDown(this.hyperSpace)) {
          // Do Hyperspace jump
          this.hyperSpace = true;
        };
      }
      // update shots
      var removeShots = [];
      this.shots.forEach(function (shot, index) {
        if (shot.distance > _this6.shotDistance) removeShots.push(shot);
        shot.update();
      });
      removeShots.forEach(function (val) {
        return _this6.shots.splice(val, 1);
      });

      // limit max speed
      var speed = Math.hypot(this.speedX, this.speedY);
      if (speed > this.maxSpeed) {
        this.speedX *= this.maxSpeed / speed;
        this.speedY *= this.maxSpeed / speed;
      }
    }
  }, {
    key: "fire",
    value: function fire() {
      var now = Date.now();
      if (now >= this.shotTimeout) {
        this.shotTimeout = now + this.shotInterval;
        this.shots.push(new (Function.prototype.bind.apply(Shot, [null].concat(_toConsumableArray(this.tip), [this.rotation, this.sound, this.shotDistance])))());
      }
    }
  }, {
    key: "fireThrusters",
    value: function fireThrusters() {
      // fire thrusters
      this.thrusters = true;
      // calculate new velocity vector
      this.speedX += this.thrustersAcceleration * Math.cos(this.rotation);
      this.speedY += this.thrustersAcceleration * Math.sin(this.rotation);
      this.thrustSound();
    }
  }, {
    key: "explode",
    value: function explode() {
      var _this7 = this;

      if (this.dead) return;
      this.dead = true;
      var spriteRadius = Math.max.apply(Math, _toConsumableArray([this.top, this.bottom, this.left, this.right].map(function (val) {
        return Math.abs(val);
      })));
      var blast0 = this.fillExplosion(spriteRadius, this.blastSize);
      var blast1 = this.fillExplosion(spriteRadius * 2, this.blastSize);
      var blast2 = this.fillExplosion(spriteRadius * 5, this.blastSize);
      var blast3 = this.fillExplosion(spriteRadius, this.blastSize);
      var empty = [];
      Game.bangSmall();
      Game.bangMedium();
      Game.bangLarge();
      this.showShape = blast0;
      setTimeout(function () {
        return _this7.showShape = blast1;
      }, 60);
      setTimeout(function () {
        return _this7.showShape = blast2;
      }, 120);
      setTimeout(function () {
        return _this7.showShape = blast3;
      }, 180);
      setTimeout(function () {
        _this7.showShape = empty;
        _this7.hidden = true;
      }, 240);
    }
  }, {
    key: "fillExplosion",
    value: function fillExplosion(radius, debris) {
      var array = [];
      while (array.length < debris) {
        var theta = Math.random() * 2 * Math.PI;
        var r = Math.random() * radius;
        var x = r * Math.cos(theta),
            y = r * Math.sin(theta);

        array.push([[x, y], [x + 1, y + 1]]);
      }
      return array;
    }
  }]);

  return Ship;
}(BaseSprite);

var Shot = function (_BaseSprite2) {
  _inherits(Shot, _BaseSprite2);

  function Shot(x, y, direction, sound, shotDistance) {
    _classCallCheck(this, Shot);

    var _this8 = _possibleConstructorReturn(this, (Shot.__proto__ || Object.getPrototypeOf(Shot)).call(this, x, y, [[[0, 0], [1, 0]]], SHOT_SIZE));

    _this8.size = SHOT_SIZE;
    _this8.direction = direction;
    _this8.rotation = direction;
    _this8.center = [0, 0];
    _this8.speedX = Math.cos(direction) * SHOT_SPEED;
    _this8.speedY = Math.sin(direction) * SHOT_SPEED;
    sound();
    _this8.distance = 0;
    _this8.shotDistance = shotDistance;
    return _this8;
  }

  _createClass(Shot, [{
    key: "draw",
    value: function draw() {
      _get(Shot.prototype.__proto__ || Object.getPrototypeOf(Shot.prototype), "draw", this).call(this);
      if (this.shotDistance - this.distance <= 20) {
        this._explode();
      }
    }
  }, {
    key: "update",
    value: function update() {
      _get(Shot.prototype.__proto__ || Object.getPrototypeOf(Shot.prototype), "update", this).call(this);
      this.xf = this.x + Math.cos(this.direction) * this.size;
      this.yf = this.y + Math.sin(this.direction) * this.size;
      this.distance += SHOT_SPEED;
    }
  }, {
    key: "explode",
    value: function explode() {
      this.dead = true;
      this.distance = this.shotDistance - 10;
    }
  }, {
    key: "_explode",
    value: function _explode() {
      // center of rotation
      var xc = this.x + Math.cos(this.direction) * this.size / 2;
      var yc = this.y + Math.sin(this.direction) * this.size / 2;
      // rotate vector
      var x0 = this.x - xc;
      var y0 = this.y - yc;
      var xr0 = x0 * Math.cos(Math.PI / 2) - y0 * Math.sin(Math.PI / 2) + xc;
      var yr0 = y0 * Math.cos(Math.PI / 2) + x0 * Math.sin(Math.PI / 2) + yc;
      var x1 = this.xf - xc;
      var y1 = this.yf - yc;
      var xr1 = x1 * Math.cos(Math.PI / 2) - y1 * Math.sin(Math.PI / 2) + xc;
      var yr1 = y1 * Math.cos(Math.PI / 2) + x1 * Math.sin(Math.PI / 2) + yc;
      drawArray([[xr0, yr0], [xr1, yr1]]);
      this.size -= 0.5;
    }
  }, {
    key: "corners",
    get: function get() {
      var _this9 = this;

      var lt = this.rotateVector([-1, 3]);
      var rt = this.rotateVector([1, 3]);
      var lb = this.rotateVector([-1, -3]);
      var rb = this.rotateVector([1, -3]);

      var retval = [lt, rt, lb, rb].map(function (value) {
        return [value[0] + _this9.x, value[1] + _this9.y];
      });
      return retval;
    }
  }]);

  return Shot;
}(BaseSprite);

var ShipCursor = function (_Ship) {
  _inherits(ShipCursor, _Ship);

  function ShipCursor(positions, shape, size) {
    var _ref;

    _classCallCheck(this, ShipCursor);

    var _this10 = _possibleConstructorReturn(this, (_ref = ShipCursor.__proto__ || Object.getPrototypeOf(ShipCursor)).call.apply(_ref, [this].concat(_toConsumableArray(positions[0]), [{}, shape, size])));

    _this10.positions = positions;
    _this10.timeout = Date.now() + 200;
    _this10.current = 0;
    _this10.dead = true;
    return _this10;
  }

  _createClass(ShipCursor, [{
    key: "update",
    value: function update() {
      if (Date.now() > this.timeout) {
        if (Key.isDown(38)) {
          Game.beat1();
          this.current -= 1;
          this.timeout = Date.now() + 200;
        };
        if (Key.isDown(40)) {
          Game.beat2();
          this.current += 1;
          this.timeout = Date.now() + 200;
        };
        if (this.current >= this.positions.length) this.current = 0;
        if (this.current < 0) this.current = this.positions.length - 1;

        var _positions$current = _slicedToArray(this.positions[this.current], 2);

        this.x = _positions$current[0];
        this.y = _positions$current[1];
      }
    }
  }]);

  return ShipCursor;
}(Ship);

var Asteroid = function (_BaseSprite3) {
  _inherits(Asteroid, _BaseSprite3);

  function Asteroid(x, y, shape, size, rotationSpeed, speedX, speedY) {
    _classCallCheck(this, Asteroid);

    var _this11 = _possibleConstructorReturn(this, (Asteroid.__proto__ || Object.getPrototypeOf(Asteroid)).call(this, x, y, shape, size));

    _this11.rotationSpeed = rotationSpeed;
    _this11.speedX = speedX;
    _this11.speedY = speedY;
    _this11.rotation = Math.random() * Math.PI / 90;
    return _this11;
  }

  _createClass(Asteroid, [{
    key: "update",
    value: function update() {
      _get(Asteroid.prototype.__proto__ || Object.getPrototypeOf(Asteroid.prototype), "update", this).call(this);
      if (!this.dead) this.updateRotation(this.rotation + this.rotationSpeed);
    }
  }, {
    key: "explode",
    value: function explode() {
      var _this12 = this;

      if (this.dead) return;
      this.dead = true;
      var spriteRadius = Math.max.apply(Math, _toConsumableArray([this.top, this.bottom, this.left, this.right].map(function (val) {
        return Math.abs(val);
      })));
      var blast0 = this.fillExplosion(spriteRadius / 2, ASTEROID_BREAK_SIZE);
      var blast1 = this.fillExplosion(spriteRadius, ASTEROID_BREAK_SIZE);
      var blast2 = this.fillExplosion(spriteRadius * 2, ASTEROID_BREAK_SIZE);
      var blast3 = this.fillExplosion(spriteRadius / 2, ASTEROID_BREAK_SIZE);
      var empty = [];
      if (this.size === BIG_ASTEROID) Game.bangLarge();else if (this.size === MED_ASTEROID) Game.bangMedium();else Game.bangSmall();
      this.rotationSpeed = 0;
      this.showShape = blast0;
      setTimeout(function () {
        return _this12.showShape = blast1;
      }, 100);
      setTimeout(function () {
        return _this12.showShape = blast2;
      }, 200);
      setTimeout(function () {
        return _this12.showShape = blast3;
      }, 300);
      setTimeout(function () {
        _this12.showShape = empty;
        _this12.done = true;
      }, 400);
    }
  }, {
    key: "fillExplosion",
    value: function fillExplosion(radius, debris) {
      var array = [];
      while (array.length < debris) {
        var theta = Math.random() * 2 * Math.PI;
        var r = Math.random() * radius;
        var x = r * Math.cos(theta),
            y = r * Math.sin(theta);

        array.push([[x, y], [x + 1, y + 1]]);
      }
      return array;
    }
  }]);

  return Asteroid;
}(BaseSprite);

var Score = function () {
  function Score(x, y, size) {
    _classCallCheck(this, Score);

    this.x = x;
    this.y = y;
    this.size = size;
    this.score = 0;
  }

  _createClass(Score, [{
    key: "draw",
    value: function draw() {
      writeText(this.x, this.y, this.score.toString(), this.size);
    }
  }]);

  return Score;
}();

var Debris = function () {
  function Debris(x, y, speedX, speedY) {
    _classCallCheck(this, Debris);

    this.debrisArray = [];
    this.hidden = false;
    for (var i = 0; i < 10; i++) {
      this.debrisArray.push(new BaseSprite(x, y, [[[0, 0], [0, 1]]], 10));
      this.debrisArray[i].speedX = (speedX + Math.random() - 0.5) / 2;
      this.debrisArray[i].speedY = (speedY + Math.random() - 0.5) / 2;
      this.debrisArray[i].updateRotation(Math.random() * Math.PI * 2);
    }
  }

  _createClass(Debris, [{
    key: "update",
    value: function update() {
      this.debrisArray.forEach(function (value) {
        return value.update();
      });
    }
  }, {
    key: "draw",
    value: function draw() {

      this.debrisArray.forEach(function (value) {
        return value.draw();
      });
    }
  }]);

  return Debris;
}();