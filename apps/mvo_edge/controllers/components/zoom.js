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
MvoEdge.ZOOM_IN = 0.7;
MvoEdge.ZOOM_OUT = 1.3;
MvoEdge.ORIGINAL_SIZE = 1;

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
    Zooming or not.
  
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
    if (!SC.none(f) && f === MvoEdge.ZOOM_IN) {
      this._changeZoom();
    } else {
      this.set('factor', MvoEdge.ZOOM_IN);
    }
  },

  /**
    @method
    
    Zoom out.
    
  */   
  doZoomOut: function () {
    var f = this.get('factor');
    if (!SC.none(f) && f === MvoEdge.ZOOM_OUT) {
      this._changeZoom();
    } else {
      this.set('factor', MvoEdge.ZOOM_OUT);
    }    
  },
  
  /**
    @method
    
    Original size.
    
  */  
  retrieveOriginalSize: function () {
    var f = this.get('factor');
    if (!SC.none(f) && f !== MvoEdge.ORIGINAL_SIZE) {    
      this.set('factor', MvoEdge.ORIGINAL_SIZE);
    }
  }
});