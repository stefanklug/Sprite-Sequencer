# jQuery Sprite Sequencer

A jQuery plugin for creating animations with sprite sheets. Also included is the Sprite Rollover plugin (which is dependent on jquery.spriteSequencer.js) for creating animated sprite sheet rollovers.

## Usage

The following uses the most common config options. See source for other options and callbacks.

    $('#my_element').spriteSequencer({
      spriteSheet: "sprite-sheet.png",
      columns: 30,
      totalFrames: 60,
      fps: 30,
      width: 150,
      height: 150
    })
    

## Sprite Rollover Usage

The following would create a rollover effect based upon a sprite sheet. The sprite would play forwards to the end on rollover and backwards to the beginning on rollout. 

    $('#my_element').spriteRollover({
      spriteSheet: "sprite-sheet.png",
      columns: 30,
      totalFrames: 60,
      fps: 60,
      width: 150,
      height: 150
    })
