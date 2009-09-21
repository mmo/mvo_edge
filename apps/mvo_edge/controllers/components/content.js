// ==========================================================================
// Project:   MvoEdge.contentController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
MvoEdge.contentController = SC.ObjectController.create(
/** @scope MvoEdge.contentController.prototype */ {

  /**
    @binding {String}

    Binds to the master selection
  */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",

  /**
    @method
    
    Master selection has changed, update the new size of the view

    @observes masterSelection
  */
  masterSelectionDidChange: function () {
    // TODO: send this to the view
    /*
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();
    tempIm.src = this.get('selectedObject').get('url');
    adjust('width', tempIm.width + 20);
    div.adjust('height', tempIm.height + 20);
    */
  }.observes('masterSelection')

});
