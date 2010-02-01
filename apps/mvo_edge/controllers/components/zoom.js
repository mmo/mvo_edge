/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  This controller is used to zoom in the document.

  @author fma, che, mmo
  @extends SC.ObjectController
  @since 0.1.0
*/
MvoEdge.zoomController = SC.ObjectController.create(
/** @scope MvoEdge.zoomController.prototype */ {

  /** Zoom parameter @property */
  ZOOM_FACTOR: 1.3,
  /** Zoom parameter @property */
  ZOOM_ORIGINAL_FACTOR: 1,
  /** Zoom parameter @property */
  ZOOM_MAX_STEP: 3,
  /** Zoom parameter @property */
  ZOOM_MIN_STEP: -5,
  /** Zoom parameter @property */
  ZOOM_MAX_SIZE: 2000,
  /** Zoom parameter @property */
  ZOOM_MIN_SIZE: 100,

  /** 
    Current zoom factor: multiplicative value applied to the original image
    size; it is exponentially proportional to the current zoom step:

      current_zoom_factor = ZOOM_FACTOR ^ _current_zoom_step 

    @property {Integer}
    @default 1
  */
  current_zoom_factor: 1,

  /**
    Current zoom step: its value always equals one of the possible discrete
    values within the zoom range [ZOOM_MIN_STEP, ZOOM_MAX_STEP]

    @property {Integer}
    @private
    @default 0
  */
  _current_zoom_step: 0,

  /**
    @method
    
    Zoom in.
    
  */  
  doZoomIn: function () {
    if (this._current_zoom_step < this.ZOOM_MAX_STEP) {
      this.set('_current_zoom_step', this._current_zoom_step + 1);
      this.set('current_zoom_factor', Math.pow(this.ZOOM_FACTOR, this._current_zoom_step));
    }
  },

  /**
    @method
    
    Zoom out.
    
  */   
  doZoomOut: function () {
    if (this._current_zoom_step > this.ZOOM_MIN_STEP) {
      this.set('_current_zoom_step', this._current_zoom_step - 1);
      this.set('current_zoom_factor', Math.pow(this.ZOOM_FACTOR, this._current_zoom_step));
    }    
  },
  
  /**
    @method
    
    Zoom original.
    
  */  
  doZoomOriginal: function () {
    this.set('_current_zoom_step', 0);
    this.set('current_zoom_factor', this.ZOOM_ORIGINAL_FACTOR);
  }
});