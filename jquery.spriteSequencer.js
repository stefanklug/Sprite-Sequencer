/*!
 * jQuery Sprite Sequencer
 * https://github.com/mattfordham/Sprite-Sequencer 
 *
 * Copyright 2012, Matt Fordham - http://www.revolvercreative.com
 */

(function($){
  
  // Default Settings
  var defaults = {
    spriteSheet: null,
    autoPlay: false,
    columns: null,
    totalFrames: 24,
    fps: 24,
    loop: false,
    yoyo: false,
    startFrame: 1,
    width: null,
    height: null,
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

      var settings = $.extend({}, defaults, options);

      return this.each(function(){

        var $el = $(this);
        
        var elSettings = $.extend({}, settings);
        if(elSettings.width == null) elSettings.width = $el.width();
        if(elSettings.height == null) elSettings.height = $el.height();
        if(elSettings.columns == null) elSettings.columns = elSettings.totalFrames;
        
        //stop the render loop, if there is an instance
        if($el.data('spriteSequencer')) pause($el);

        var data = $el.data('spriteSequencer', {
          settings: elSettings,
          spriteLoaded: false,
          playing: false,
          tickTimer: null,
          currentFrame: 1,
          targetFrame: null,
          playingBackwards: false
        });

        var initialStyle = {
          width: elSettings.width, 
          height: elSettings.height, 
          'display': 'block', 
          'overflow': 'hidden' 
        };

        $el.css(initialStyle);

        if (elSettings.onInit){
          elSettings.onInit("test");
        }

        data.currentFrame = elSettings.startFrame;
        if(elSettings.spriteSheet) preloadImage($el, elSettings.spriteSheet);
        else imageLoaded($el);
      });

    },
    play : function(){

      return this.each(function(){

        var $el = $(this);
        var data = $el.data('spriteSequencer');

        if (data.spriteLoaded) {
          if (data.playing || data.currentFrame == data.settings.totalFrames) {
            clearInterval(data.tickTimer);
            data.currentFrame = 1;
          };
          play($el);
        } else {
          logError("play - sprite not yet loaded");
        };

      });
    },
    
    isPlaying: function() {
    	var data = $(this).data('spriteSequencer');
    	return data.playing;
    },
    
    toggle:function() {
    	return this.each(function(){
            var $el = $(this);
            var data = $el.data('spriteSequencer');
            
            if(data.playing) pause($el);
            else play($el);
    	});
    },
    
    pause : function(){
      return this.each(function(){
        var $el = $(this);
        pause($el);
      });
    },
    gotoAndStop : function(options){
      return this.each(function(){
        var $el = $(this);
        var data = $el.data('spriteSequencer');
        
        if (options && options.frame >= 1) {
          clearInterval(data.tickTimer);
          data.playing = false;
          data.currentFrame = options.frame;
          updateBackgroundPosition($el);
          
          if (data.settings.onTick) {
            data.settings.onTick(data.currentFrame);
          }
          
        } else {
          logError("gotoAndStop - provide a valid frame");
        };

      });
    }, 
    gotoAndPlay : function(options){
      return this.each(function(){
        var $el = $(this);
        var data = $el.data('spriteSequencer');

        if (options && options.frame >= 1) {
          clearInterval(data.tickTimer);
          data.currentFrame = options.frame;

          if (data.currentFrame > data.settings.totalFrames) {
            data.currentFrame = data.settings.totalFrames;
          };        
          play($el);
        } else {
          logError("gotoAndPlay - provide a valid frame");
        };
      })
    },
    playTo : function(options){
      return this.each(function(){
        var $el = $(this);
        var data = $el.data('spriteSequencer');

        if (options && options.frame >= 1) {
          clearInterval(data.tickTimer);
          data.targetFrame = options.frame;

          if (data.targetFrame > data.settings.totalFrames) {
            data.targetFrame = data.settings.totalFrames;
          };
          if (data.currentFrame > data.targetFrame) {
            data.currentFrame -= 1;
            data.playingBackwards = true;
          } else {
            data.playingBackwards = false
          }
          if (data.targetFrame != data.currentFrame) {          
            play($el);
          };
        } else {
          logError("playTo - provide a valid frame");
        };
      })
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
  function preloadImage($el, image) {
    var data = $el.data('spriteSequencer');
    var img = new Image();
    img.src = image;
    img.onload = function(){
    	$el.css('background-image', 'url('+image+')');
    	imageLoaded($el);
    };
  }
  
  function imageLoaded($el) {
	  var data = $el.data('spriteSequencer');
      data.spriteLoaded = true;         
      if (data.settings.onSpriteLoaded){
        data.settings.onSpriteLoaded();
      }
      if (data.settings.autoPlay){
        play($el);
      } else {
    	  updateBackgroundPosition($el);
      }
  }
  
  function play($el){
    var data = $el.data('spriteSequencer');
    data.playing = true;
    tick($el);
    data.tickTimer = setInterval(function(){ tick($el); }, 1000/data.settings.fps);
    if (data.settings.onPlay) {
      data.settings.onPlay();
    }
  }
  
  function pause($el) {
	  var data = $el.data('spriteSequencer');

      clearInterval(data.tickTimer);
      data.playing = false;

      if (data.settings.onPause) {
        data.settings.onPause();
      };
  }
     
  function tick($el) {
    var data = $el.data('spriteSequencer');
    updateBackgroundPosition($el);

    if (data.settings.onTick) {
      data.settings.onTick(data.currentFrame);
    }

    if (data.playingBackwards) {
      if (data.settings.yoyo && data.currentFrame == 1) {
        data.playingBackwards = false;
        data.currentFrame ++;
      } else if (data.currentFrame == 1 || data.currentFrame == data.targetFrame) {

        if (data.settings.loop && data.targetFrame == null) {
          data.currentFrame = data.settings.totalFrames;
        } else {
          data.playingBackwards = false;
          data.playing = false;
          clearInterval(data.tickTimer);
        };

        if (data.settings.onEnd) {
          data.settings.onEnd();
        }
        data.targetFrame = null;
      } else {
        data.currentFrame --;
      } 
    } else {
      if (data.currentFrame == data.settings.totalFrames || data.currentFrame == data.targetFrame){ 
        if (data.settings.yoyo) {
          data.playingBackwards = true;
          data.currentFrame --;
        } else if (data.settings.loop && data.targetFrame == null){
          data.currentFrame = 1;
        } else {
          data.playing = false;
          clearInterval(data.tickTimer);
        }
        if (data.settings.onEnd) {
          data.settings.onEnd();
        }
        data.targetFrame = null;
      } else {
        data.currentFrame ++;
      }
    };
  };
  
  function updateBackgroundPosition($el) {
    var data = $el.data('spriteSequencer');

    var currentRow, currentColumn, xOffset, yOffset;
    
    currentRow = Math.floor((data.currentFrame-1) / data.settings.columns);
    currentColumn = (data.currentFrame-1) % data.settings.columns;
    xOffset = -(data.settings.width * currentColumn);
    yOffset = -(data.settings.height * currentRow);
    
    $el.css('background-position', xOffset+"px "+yOffset+"px");
  }
  
  function logError(message) {
    console.log("Sprite Sequencer Error: "+ message);
  }

})(jQuery);