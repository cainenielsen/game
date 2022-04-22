# game

## bugs

the player can hold down the jump button to continuously jump (which could be a feature but should be able to be controlled)

the player is considered colliding with blocks that are intersected at the corners

when the character 'foot' is not collided but the character 'head' is the player is unable to jump

## tasks

hit box visualization tools

delay on death

code comments

balance out player movement

make the game non-zoom-able

make it possible for non-moving tiles to have collisions

fix the unique names in classes that toggle event listeners

update tiles to only render if they are on the screen

## features

toggling pause with a key (esc, e?)

long more full map

more block types

showing the player direction while moving

double/infinite jump

bouncing/grappling

enemies

delay on death/death screen

music

coins

## research

when using classes in js is it best to use multiple listeners for events when extending multiple layers?

## Projects

### Render Box

- Separate games and levels
- Develop a process for getting the dimentions of the camera as it follows the player
- Update the level to accept a JSON input of tiles and render those tiles based on the render box around the player
