// ==========================================================================
// Project:   MvoEdge.Content
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  Define the maximum and the minimum size of the picture.
*/
MvoEdge.MAX_ZOOM_SIZE = 2000;
MvoEdge.MIN_ZOOM_SIZE = 100;

/** @class

  (Document Your View Here)

  @extends SC.ImageView
*/
MvoEdge.ContentView = SC.ImageView.extend(
/** @scope MvoEdge.Content.prototype */ {

  /**
    Binds to the zoomValue in the zoom controller.

    @property {Integer}
    @binding "MvoEdge.zoomController.factor"
   */
  zoomValueBinding: SC.Binding.oneWay('MvoEdge.zoomController.factor'), 
  
  /**
    Binds to the isZooming in the zoom controller.
  
    @property {Boolean}
    @binding "MvoEdge.zoomController.isZooming"
  */
  isZoomingBinding: SC.Binding.oneWay('MvoEdge.zoomController.isZooming'),
  
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
      var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
      var wd = div.get('layer').width;
      var hg = div.get('layer').height;
      var tempIm = new Image();
      tempIm.src = this.get('value');
      if (tempIm.complete) {
        this._originalWidth = tempIm.width;
        this._originalHeight = tempIm.height;
      }
      if (zoomVal === 1) {
        div.adjust('width', this.get('_originalWidth'));
        div.adjust('height', this.get('_originalHeight'));  
      } else {
        var wd2 = wd * zoomVal;
        var max = Math.max(wd, MvoEdge.MAX_ZOOM_SIZE);
        if (wd2 > max) {
          MvoEdge.logger.info("%@ > maxWidth [%@]".fmt(wd2, max));
          // Keep the good rate for the picture
          if (this.get('_originalWidth') > max) {
            div.adjust('width', this.get('_originalWidth'));
            div.adjust('height', this.get('_originalHeight'));
          }
          return;
        }
        var min = Math.min(wd, MvoEdge.MIN_ZOOM_SIZE);
        if (wd2 < min) {
          MvoEdge.logger.info("%@ < minWidth [%@]".fmt(wd2, min));
          // Keep the good rate for the picture
          if (this.get('_originalWidth') < min) {
            div.adjust('width', this.get('_originalWidth'));
            div.adjust('height', this.get('_originalHeight'));
          }          
          return;
        }             
        var hg2 = hg * zoomVal;
        div.adjust('width', wd2);
        div.adjust('height', hg2);
			} 
    }
  }.observes('zoomValue', 'isZooming'),

  // TODO: is this view method the best way to add scroll  
  /**
    If the master selection changes, readjust the size of the view

    @private
    @observes masterSelection
  */
 /* _contentDidChange: function () {
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();
    if (!SC.none(this.get('content'))) {
      tempIm.src = this.get('content').get('staticUrl');
      if (tempIm.complete) {
        div.adjust('width', tempIm.width + 20);
        div.adjust('height', tempIm.height + 20);
      }
      MvoEdge.logger.info('contentController#_contentDidChange: %@'.
          fmt(this.get('content').get('guid')));
    }
  }.observes('content')*/
  
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
      var imageUrl = MvoEdge.configurator.getImageUrl(defaultUrl);
      SC.RunLoop.begin();
      this.set('value', imageUrl);
      SC.RunLoop.end();
      this.doZoom();
    }
    MvoEdge.logger.debug('ContentView#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
  }.observes('masterSelection')
});