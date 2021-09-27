# Asteroids

## Introduction
This is a modern verison of the classic Atari 1979 game, Asteroids, but written using modern programming languages. This is one of a series of re-writes of classic retro games from the late 1970s-early 1980s that I'm currently playing with. 

In the home Asteroids mainly shipped in cartridge form for the [Atari 2600](https://en.wikipedia.org/wiki/Atari_2600) but also for the [Vectrex](https://en.wikipedia.org/wiki/Vectrex) which was a vector display-based home video game console–the only one ever designed and released for the home market, so kind of special. 

So I'm basing my version on the vertical style/display of the original Vectrex and arcade versions. I loved the Atari 2600 version but the vector graphics versions always looked best.


![vectrex](https://user-images.githubusercontent.com/14840708/134128005-c300ec50-819c-4797-b0a1-20d94d206816.png)

## What is Asteroids?
Asteroids is a space-themed multidirectional shooter arcade game designed by Lyle Rains and Ed Logg released in November 1979 by Atari, Inc. The player controls a single spaceship in an asteroid field which is periodically traversed by flying saucers. The object of the game is to shoot and destroy the asteroids and saucers, while not colliding with either, or being hit by the saucers' counter-fire. The game becomes harder as the number of asteroids increases.

Asteroids was one of the first major hits of the golden age of arcade games; the game sold over 70,000 arcade cabinets and proved both popular with players and influential with developers. In the 1980s it was ported to Atari's home systems, and the Atari VCS version sold over three million copies. The game was widely imitated, and it directly influenced Defender, Gravitar, and many other video games.

Asteroids was conceived during a meeting between Logg and Rains, who decided to use hardware developed by Howard Delman previously used for Lunar Lander. Asteroids was based on an unfinished game titled Cosmos; its physics model, control scheme, and gameplay elements were derived from Spacewar!, Computer Space, and Space Invaders and refined through trial and error. The game is rendered on a vector display in a two-dimensional view that wraps around both screen axes.

## Gameplay
The objective of Asteroids is to destroy asteroids and saucers. The player controls a triangular ship that can rotate left and right, fire shots straight forward, and thrust forward. Once the ship begins moving in a direction, it will continue in that direction for a time without player intervention unless the player applies thrust in a different direction. The ship eventually comes to a stop when not thrusting. The player can also send the ship into hyperspace, causing it to disappear and reappear in a random location on the screen, at the risk of self-destructing or appearing on top of an asteroid.

[I've added all the game rules and game play here](docs/play-guide.md)


### Screenshots of gameplay from original 1979 Atari aracde version.

![654883-asteroids-arcade-screenshot-1-coin-1-play](https://user-images.githubusercontent.com/14840708/134503371-9f2c1efc-0228-4639-a9ff-0880e20aadb5.png)

![654884-asteroids-arcade-screenshot-game-starts](https://user-images.githubusercontent.com/14840708/134503386-0ea78636-8039-4700-a1e2-52a1f11aea96.png)

![654885-asteroids-arcade-screenshot-many-small-asteroids](https://user-images.githubusercontent.com/14840708/134503411-61d5ff0d-5476-4fda-bee9-4e3bcd23fd68.png)


Each level starts with a few large asteroids drifting in various directions on the screen. Objects wrap around screen edges – for instance, an asteroid that drifts off the top edge of the screen reappears at the bottom and continues moving in the same direction. As the player shoots asteroids, they break into smaller asteroids that move faster and are more difficult to hit. Smaller asteroids are also worth more points. Two flying saucers appear periodically on the screen; the "big saucer" shoots randomly and poorly, while the "small saucer" fires frequently at the ship. After reaching a score of 40,000, only the small saucer appears. As the player's score increases, the angle range of the shots from the small saucer diminishes until the saucer fires extremely accurately. Once the screen has been cleared of all asteroids and flying saucers, a new set of large asteroids appears, thus starting the next level. The game gets harder as the number of asteroids increases until after the score reaches a range between 40,000 and 60,000. The player starts with 3–5 lives upon game start and gains an extra life per 10,000 points. Play continues to the last ship lost, which ends the game. Machine "turns over" at 99,990 points, which is the maximum high score that can be achieved.

### Lurking exploit
In the original game design, saucers were supposed to begin shooting as soon as they appeared, but this was changed. Additionally, saucers can only aim at the player's ship on-screen; they are not capable of aiming across a screen boundary. These behaviors allow a "lurking" strategy, in which the player stays near the edge of the screen opposite the saucer. By keeping just one or two rocks in play, a player can shoot across the boundary and destroy saucers to accumulate points indefinitely with little risk of being destroyed. Arcade operators began to complain about losing revenue due to this exploit. In response, Atari issued a patched EPROM and, due to the impact of this exploit, Atari (and other companies) changed their development and testing policies to try to prevent future games from having such exploits

## Development
Here I'll drop thoughts and notes on the Development of my new version of Astroids.


