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

  /**
    Returns the currently selected thumbnail.
  
    @property {SC.SelectionSet} selection
  */
  selectedThumbnail: function () {
    var selThumbnail = this.get('selection');
    if (selThumbnail) {
      var thumbnail = selThumbnail.firstObject();
      if (thumbnail) {
        return thumbnail;
      }
    }
  }.property('selection').cacheable(),

  /**
    Changes the currently selected thumbnail, 
    given the coreDocumentNode's guid.
    
    @param {String} coreDocumentNodeId the guid of an object of type 
    {@link MvoEdge.CoreDocumentNode}
   */
  changeSelection: function (coreDocumentNodeId) {
    var q = SC.Query.create({ recordType: MvoEdge.Thumbnail, 
        conditions: "coreDocumentNode = '" + coreDocumentNodeId + "'"});
    var imageObjects = MvoEdge.store.findAll(q);
    if (imageObjects) {
      var sizeImageObjects = imageObjects.get('length');
      if (sizeImageObjects > 0) {
        var imageObject = imageObjects.firstObject();
        var selThumbnail = this.get('selectedThumbnail');
        if (imageObject && imageObject !== selThumbnail) {
          console.info('Change selection');
          // note: selection is set an SelectionSet
          this.set('selection', 
              SC.SelectionSet.create().addObject(imageObject));
        }
      } else {
        console.error("There is no MvoEdge.Thumbnail in the store" + 
            " with the coreDocumentNodeId '" + coreDocumentNodeId + "' !");
        return null;
      }
    }
  },

  /**
    Updates the masterController if the currently selected thumbnail 
    has been changed.
    
    @observes selection
   */
  thumbnailSelectionDidChange: function () {
    var selThumbnail = this.get('selectedThumbnail');
    if (selThumbnail) {
      // Get the coreDocumentNodeId of the currently selected thumbnail
      var cdn = selThumbnail.get('coreDocumentNode');
      var masterController = MvoEdge.masterController.get('selectedObjectId');
      if (cdn && cdn !== masterController) {
        console.info('Thumbnail --> Change masterController');
        MvoEdge.masterController.changeSelection(cdn);
      }
    }
  }.observes('selection'),

  /**
    Updates thumbnail selection by observing changes in master controller's
    object selection
    
    NOTE: we're assuming here that the guid of the master controller's
    selected object is the same as the corresponding thumbnail's guid;
    that may not be the case (a translation guid->guid may be needed)

    @observes MvoEdge.masterController.selectedObjectId
  */
  masterObjectSelectionDidChange: function () {
    var masterSelection = MvoEdge.masterController.get('selectedObjectId');
    if (masterSelection) {
      var sel = this.get('selectedThumbnail');
      if (sel) {
        // Get the coreDocumentNodeId of the currently selected thumbnail
        var cdn = sel.get('coreDocumentNode');
        if (cdn && cdn !== masterSelection) {
          this.changeSelection(masterSelection);
        }
      } else {
        this.changeSelection(masterSelection);
      }
    }
  }.observes('MvoEdge.masterController.selectedObjectId')

});
