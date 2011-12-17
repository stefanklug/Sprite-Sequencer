(function($){

  // Global Variables
  var settings = {};
  var spriteLoaded = false;
  var playing = false;
  var tickTimer = null;
  var currentFrame = 1;
  var targetFrame = null;
  var playingBackwards = false;
  var $el = null;
  
  // Default Settings
  var defaults = {
    spriteSheet: '',
    autoPlay: false,
    columns: 10,
    totalFrames: 24,
    fps: 24,
    loop: false,
    yoyo: false,
    startFrame: 1,
    width: 100,
    height: 100,
    onInit: null,
    onSpriteLoaded: null,
    onPlay: null,
    onTick: null,
    onPause: null,
    onEnd: null
  };

  // Plugin Methods
  var methods = {
    init : function(options) {
      settings = $.extend(defaults, options);

      return this.each(function(){
        $el = $(this);
        
        var initalStyle = {
          width: settings.width, 
          height: settings.height, 
          'display': 'block', 
          'overflow': 'hidden' 
        }
        
        $el.css(initalStyle)
        if (settings.onInit){
          settings.onInit("test")
        }
        currentFrame = settings.startFrame;        
        preloadImage(settings.spriteSheet)
      })

    },
    play : function(){
      if (spriteLoaded) {
        if (playing || currentFrame == settings.totalFrames) {
          clearInterval(tickTimer)
          currentFrame = 1
        };
        play()
      } else {
        logError("play - sprite not yet loaded")
      }
    }, 
    pause : function(){
      clearInterval(tickTimer);
      playing = false;
      if (settings.onPause) {
        settings.onPause();
      }
    },
    gotoAndStop : function(options){
      if (options && options.frame >= 1) {
        clearInterval(tickTimer);
        playing = false;
        currentFrame = options.frame;
        updateBackgroundPosition();
      } else {
        logError("gotoAndStop - provide a valid frame");
      };
    }, 
    gotoAndPlay : function(options){
      if (options && options.frame >= 1) {
        clearInterval(tickTimer);
        currentFrame = options.frame;
        if (currentFrame > settings.totalFrames) {
          currentFrame = settings.totalFrames;
        };        
        play();
      } else {
        logError("gotoAndPlay - provide a valid frame");
      };
    },
    playTo : function(options){
      if (options && options.frame >= 1) {
        clearInterval(tickTimer);
        targetFrame = options.frame;
        if (targetFrame > settings.totalFrames) {
          targetFrame = settings.totalFrames;
        };
        if (currentFrame > targetFrame) {
          currentFrame -= 1;
          playingBackwards = true;
        } else {
          playingBackwards = false
        }
        if (targetFrame != currentFrame) {          
          play();
        };
      } else {
        logError("playTo - provide a valid frame");
      };
    }  
  };

  // Main Plugin Function
  $.fn.spriteSequencer = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.spriteSequencer' );
    }    
  };

  // Private Methods
  function preloadImage(image) {
    img = new Image()
    img.src = image;
    img.onload = function(){
      spriteLoaded = true
      $el.css('background-image', 'url('+image+')');                  
      if (settings.onSpriteLoaded){
        settings.onSpriteLoaded()
      }
      if (settings.autoPlay){
        play()
      }
    }
  }
  
  function play(){
    playing = true;
    tick();
    tickTimer = setInterval(tick, 1000/settings.fps);
    if (settings.onPlay) {
      settings.onPlay()
    }
  }
     
  function tick() {
    updateBackgroundPosition();
        
    if (settings.onTick) {
      settings.onTick(currentFrame);
    }
    
    if (playingBackwards) {
      if (settings.yoyo && currentFrame == 1) {
        playingBackwards = false;
        currentFrame ++
      } else if (currentFrame == 1 || currentFrame == targetFrame) {
        if (settings.loop && targetFrame == null) {
          currentFrame = settings.totalFrames;
        } else {
          playingBackwards = false;
          playing = false;
          clearInterval(tickTimer);
        };
        if (settings.onEnd) {
          settings.onEnd();
        }
        targetFrame = null;
      } else {
        currentFrame --;
      } 
    } else {
      if (currentFrame == settings.totalFrames || currentFrame == targetFrame){ 
        if (settings.yoyo) {
          playingBackwards = true
          currentFrame --;
        } else if (settings.loop && targetFrame == null){
          currentFrame = 1;
        } else {
          playing = false;
          clearInterval(tickTimer);
        }
        if (settings.onEnd) {
          settings.onEnd();
        }
        targetFrame = null;
      } else {
        currentFrame ++;
      }
    };
  };
  
  function updateBackgroundPosition() {
    var currentRow, currentColumn, xOffset, yOffset;
    
    currentRow = Math.floor((currentFrame-1) / settings.columns);
    currentColumn = (currentFrame-1) % settings.columns;
    xOffset = -(settings.width * currentColumn)
    yOffset = -(settings.height * currentRow)
    
    $el.css('background-position', xOffset+"px "+yOffset+"px")
  }
  
  function logError(message) {
    console.log("Sprite Sequencer Error: "+ message);
  }

})(jQuery);