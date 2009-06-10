// ==========================================================================
// Project:   MvoEdge.thumbnailController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  This controller manages the behavior of the thumbnail view. It depends on
  the master controller.

  @extends SC.ArrayController
*/
MvoEdge.thumbnailController = SC.ArrayController.create(
/** @scope MvoEdge.thumbnailController.prototype */ {

  allowsMultipleSelection: NO,

  selectedThumbnail: function () {
    if (this.selection() && (this.selection() !== undefined)) {
      return this.selection().firstObject();      
    }
    else {
      return undefined;
    }
  }.property('selection'),

  /**
    Updates thumbnail selection by observing changes in master controller's
    object selection
    
    NOTE: we're assuming here that the guid of the master controller's
    selected object is the same as the corresponding thumbnail's guid;
    that may not be the case (a translation guid->guid may be needed)
  */
  masterObjectSelectionDidChange: function () {
    this.changeSelection(MvoEdge.masterController.get('selectedObjectId'));
  }.observes('MvoEdge.masterController.selectedObjectId')

});
