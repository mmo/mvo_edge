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
MvoEdge.ZOOM_IN_FACTOR = 0.7;
MvoEdge.ZOOM_OUT_FACTOR = 1.3;
MvoEdge.ZOOM_ORIGINAL_FACTOR = 1;

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
  factor: null,
    
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
    var f = this.get('factor');
    if (!SC.none(f) && f === MvoEdge.ZOOM_IN_FACTOR) {
      this._changeZoom();
    } else {
      this.set('factor', MvoEdge.ZOOM_IN_FACTOR);
    }
  },

  /**
    @method
    
    Zoom out.
    
  */   
  doZoomOut: function () {
    var f = this.get('factor');
    if (!SC.none(f) && f === MvoEdge.ZOOM_OUT_FACTOR) {
      this._changeZoom();
    } else {
      this.set('factor', MvoEdge.ZOOM_OUT_FACTOR);
    }    
  },
  
  /**
    @method
    
    Zoom original.
    
  */  
  doZoomOriginal: function () {
    var f = this.get('factor');
    if (!SC.none(f) && f === MvoEdge.ZOOM_ORIGINAL_FACTOR) {    
      this._changeZoom();
    } else {
      this.set('factor', MvoEdge.ZOOM_ORIGINAL_FACTOR);
    }        
  }
});