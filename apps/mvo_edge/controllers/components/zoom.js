/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/


/**
  Define the different zoom factors.
*/
MvoEdge.ZOOM_FACTOR = 1.3;
MvoEdge.ZOOM_ORIGINAL_FACTOR = 1;

MvoEdge.ZOOM_MAX_STEP = 3;
MvoEdge.ZOOM_MIN_STEP = -3;

/**
  @class

  This controller is used to zoom in the document.

  @author fma
  @extends SC.ObjectController
  @since 0.0.1
*/
MvoEdge.zoomController = SC.ObjectController.create(
/** @scope MvoEdge.zoomController.prototype */ {

  /** 
    Factor.
 
    @property {Integer}
    @default null
  */
  factor: 1,
  
  step: 0,

    
  /**
    If the factor doesnt change (call 2 times or more the same factor), 
    you use this variable to show the zoom.
  
    @property {Boolean}
    @default NO
  */
  isZooming: NO,  
    
  /**
    @method
    
    Change Zoom.
    
    @private    
  */    
  _changeZoom: function () {
    var val = this.get('isZooming');        
    var newVal = (val) ? NO : YES;
    this.set('isZooming', newVal);    
  },
  
  /**
    @method
    
    Zoom in.
    
  */  
  doZoomIn: function () {
    if (this.step < MvoEdge.ZOOM_MAX_STEP) {
      this.set('step', this.step + 1);
      this.set('factor', Math.pow(MvoEdge.ZOOM_FACTOR, this.step));
    }
  },

  /**
    @method
    
    Zoom out.
    
  */   
  doZoomOut: function () {
    if (this.step > MvoEdge.ZOOM_MIN_STEP) {
      this.set('step', this.step - 1);
      this.set('factor', Math.pow(MvoEdge.ZOOM_FACTOR, this.step));
    }    
  },
  
  /**
    @method
    
    Zoom original.
    
  */  
  doZoomOriginal: function () {
    this.set('step', 0);
    this.set('factor', MvoEdge.ZOOM_ORIGINAL_FACTOR);
  }
});