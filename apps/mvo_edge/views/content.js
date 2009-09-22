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
    If the master selection changes, readjust the size of the view

    @private
    @observes masterSelection
  */
  _contentDidChange: function () {
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();
    if (!SC.none(this.get('content'))) {
      tempIm.src = this.get('content').get('staticUrl');
      if (tempIm.complete) {
        div.adjust('width', tempIm.width + 20);
        div.adjust('height', tempIm.height + 20);
      }
      console.info('MvoEdge.contentController#_contentDidChange: %@'.
          fmt(this.get('content').get('guid')));
    }
  }.observes('content')

});
