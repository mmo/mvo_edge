// ==========================================================================
// Project:   MvoEdge.Content
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document Your View Here)

  @extends SC.ImageView
*/
MvoEdge.ContentView = SC.ImageView.extend(
/** @scope MvoEdge.Content.prototype */ {
  
  /**
    Binds to the master selection
    @property {MvoEdge.CoreDocumentNode}
   */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",
  
  /**
    @method 
    
    Adapt View size depending on the size of the image

    @private
    @callback SC.imageCache.load
  */

  _adjustSize: function (url, image) {
    SC.RunLoop.begin();
    this.set('value', url);
    this.adjust('width', image.width);
    this.adjust('height', image.height);
    SC.RunLoop.end();
      
    MvoEdge.logger.debug('ContentView#_adjustSize');
  },
  
  /**
     @method

     Load image in cache in observing changes in master controller's master
     selection

     @observes masterSelection
   */
  _masterSelectionDidChange: function () {
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      var defaultUrl = currentMasterSelection.get('urlDefault');
      var imageUrl = MvoEdge.configurator.getImageUrl(defaultUrl);
      SC.RunLoop.begin();
      SC.imageCache.loadImage(imageUrl, this, this._adjustSize);
      SC.RunLoop.end();
    }
    
    MvoEdge.logger.info('ContentView#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
        
  }.observes('masterSelection')
});
