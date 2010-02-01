/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
/*globals MvoEdge */

/** @class

  (Document Your View Here)

  @extends SC.ScrollView
*/
MvoEdge.ContentView = SC.ScrollView.extend(
/** @scope MvoEdge.Content.prototype */ {

  /**
    Binds to the zoomValue in the zoom controller.

    @property {Integer}
    @binding "MvoEdge.zoomController.current_zoom_factor"
   */
  zoomValueBinding:
      SC.Binding.oneWay('MvoEdge.zoomController.current_zoom_factor'), 
  
  /**
    Binds to the master selection
    
    @property {MvoEdge.CoreDocumentNode}
    @binding MvoEdge.masterController.masterSelection
  */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection", 
  
  /** 
    Original width.

    @private
    @property {Integer}
    @default null
  */  
  _originalWidth: null,
  
  /** 
    Original height.

    @private
    @property {Integer}
    @default null
  */    
  _originalHeight: null,  
  
  /**
    @method

    Zoom in the picture.

    @observes zoomValue
  */  
  doZoom: function () {
    var zoomVal = this.get('zoomValue');
    if (!SC.none(zoomVal)) {
      var div = this.get('contentView');
      if (zoomVal === 1) {
        div.adjust('width', this.get('_originalWidth'));
        div.adjust('height', this.get('_originalHeight'));  
      }
      else {
        var newWidth = this._originalWidth * zoomVal;
        var max = Math.max(newWidth, MvoEdge.zoomController.ZOOM_MAX_SIZE);
        if (newWidth > max) {
          MvoEdge.logger.info("%@ > maxWidth [%@]".fmt(newWidth, max));
          // Keep the good rate for the picture
          if (this.get('_originalWidth') > max) {
            div.adjust('width', this.get('_originalWidth'));
            div.adjust('height', this.get('_originalHeight'));
          }
          return;
        }
        var min = Math.min(newWidth, MvoEdge.zoomController.ZOOM_MIN_SIZE);
        if (newWidth < min) {
          MvoEdge.logger.info("%@ < minWidth [%@]".fmt(newWidth, min));
          // Keep the good rate for the picture
          if (this.get('_originalWidth') < min) {
            div.adjust('width', this.get('_originalWidth'));
            div.adjust('height', this.get('_originalHeight'));
          }          
          return;
        }             
        var newHeight = this._originalHeight * zoomVal;
        div.adjust('width', newWidth);
        div.adjust('height', newHeight);
      } 
    }
  }.observes('zoomValue'),

  /**
    @method 
    
    Callback applied after image has loaded.
    
    It puts the image in the container and applies the current zoom factor.

    @private
    @callback SC.imageCache.load
  */
  _adjustSize: function (url, image) {
    SC.RunLoop.begin();
    var content =  this.get('contentView');
    content.set('value', url);
    this.set('_originalWidth', image.width);
    this.set('_originalHeight', image.height);
    this.doZoom();
    SC.RunLoop.end();
      
    MvoEdge.logger.debug('ContentView#_adjustSize');
  },
  

  /**
    @method
    
    Updates value by observing changes in master controller's master
    selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      var defaultUrl = currentMasterSelection.get('urlDefault');
      var pageNumber = !SC.none(currentMasterSelection.get('localSequenceNumber')) ?
          currentMasterSelection.get('localSequenceNumber') : 0;
      var imageUrl = MvoEdge.configurator.getImageUrl(defaultUrl, pageNumber);
      SC.RunLoop.begin();
      SC.imageCache.loadImage(imageUrl, this, this._adjustSize);
      SC.RunLoop.end();
    }
    MvoEdge.logger.debug('ContentView#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
  }.observes('masterSelection')
});
