/*!
 * jQuery Sprite Sequencer Rollover
 * https://github.com/mattfordham/Sprite-Sequencer 
 *
 * Copyright 2012, Matt Fordham - http://www.revolvercreative.com
 */


(function($){

  // Default Settings
  var defaults = {
    spriteSheet: null,
    columns: 10,
    totalFrames: 24,
    fps: 24,
    width: 100,
    height: 100
  };

  // Plugin Methods
  var methods = {
    init : function(options) {
      settings = $.extend(defaults, options);
      
      return this.each(function(){
        $el = $(this);
                
        $el.spriteSequencer({
          spriteSheet: settings.spriteSheet,
          columns: settings.columns,
          totalFrames: settings.totalFrames,
          fps: settings.fps,
          width: settings.width,
          height: settings.height,
          autoPlay: false
        })
        
        var data = $el.data('spriteRollover', {
          settings: settings
        });
        
        $el.hover(function() {
          $el = $(this);
          var data = $el.data('spriteRollover')
          $el.spriteSequencer('playTo', {frame : data.settings.totalFrames})          
        }, function() {
          $el = $(this);
          $el.spriteSequencer('playTo', {frame : 1})
        });
        
      })
    }
  };

  // Main Plugin Function
  $.fn.spriteRollover = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.spriteRollover' );
    }    
  };

})(jQuery);