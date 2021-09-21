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

var VERSION = "v1.0";

function startAsteroids() {
  Game.start();
  if ('withCredentials' in new XMLHttpRequest() || typeof XDomainRequest !== "undefined") {
    /* supports cross-domain requests */
    //Use IE-specific "CORS" code with XDR
  } else {
    //Time to retreat with a fallback or polyfill
    $(".footer p:first").hide();
    $(".footer p:first").before("\n      <p>\n        <h3>\n          This host does not support high-scores. Try:<br>\n          <a href=\"https://github.com/philspil66/Asteroids-JS/\">\n          asteroids-JS</a>\n        </h3>\n      </p>");
  }
}