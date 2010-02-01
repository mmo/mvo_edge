/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
/*globals MvoEdge */

/**
  @class

  View that contains thumbnails

  @author {CHE}     
  @extends {ScrollView}  
  @since {0.1.0}    
*/
MvoEdge.ThumbnailView = SC.ScrollView.extend(
/** @scope MvoEdge.Thumbnail.prototype */ {
  
  /**
    Binds to the thumbnail selection in the thumbnail controller
    @property {String}
   */
  thumbnailSelectionBinding: "MvoEdge.thumbnailController.selection",

  /**
    Update the position of the scroll in the view if needed.

    @observes thumbnailSelection
  */
  _thumbnailSelectionDidChange: function () {
    var selection = this.get('thumbnailSelection').firstObject();
    if (!SC.none(selection)) {
      //retreive the list of the thumbnails visible in the view
      var listView = this.get('contentView').get('childViews');
      var needToScroll = YES;
      for (var i = 0; i < listView.get('length'); i++) {
        var thumb = listView[i].content;
        //if the thumbnail selected is already in the view no scroll is needed
        if (thumb === selection) {
          needToScroll = NO;
        }
      }
      //if needed scroll to the new position
      if (needToScroll) {
        var selectionIndex = MvoEdge.thumbnailController.indexOf(selection);
        this.scrollTo(null, selectionIndex *
            this.get('contentView').get('rowHeight'));
        MvoEdge.logger.debug('update thumbnail scroll'); 
      }
    }
  }.observes('thumbnailSelection')

});