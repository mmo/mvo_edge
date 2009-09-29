/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

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
    Content.
 
    @property {Integer}
    @default undefined
  */
  content: undefined,
    
  /**
    @method
    
    Reset content.
    
    @private    
  */  
  _resetContent: function () {
    this.set('content', undefined);
  },

  /**
    @method
    
    Zoom in.
    
  */  
  doZoomIn: function () {
    console.info('doZoomIn');
    SC.RunLoop.begin();
    this.set('content', 0.7);
    SC.RunLoop.end();
    this._resetContent();
  },

  /**
    @method
    
    Zoom out.
    
  */   
  doZoomOut: function () {
    console.info('doZoomOut');
    SC.RunLoop.begin();
    this.set('content', 1.3);
    SC.RunLoop.end();
    this._resetContent();
  },
  
  /**
    @method
    
    Original size.
    
  */  
  retrieveOriginalSize: function () {
    console.info('retrieveOriginalSize');
    SC.RunLoop.begin();
    this.set('content', 1);
    SC.RunLoop.end();
    this._resetContent();
  }
  
});