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
      console.info('contentController#_contentDidChange: %@'.
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
    }
    
    MvoEdge.logger.debug('ContentView#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
        
  }.observes('masterSelection')
});
