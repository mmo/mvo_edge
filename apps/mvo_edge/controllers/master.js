// ==========================================================================
// Project:   MvoEdge.masterController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  This is the application's master controller. It serves as communication
  hub between the controllers of the different widgets.

  In this case it holds a reference to the currently selected object (image),
  in order to keep the thumbnail and tree views synchronized.

  @extends SC.ArrayController
*/

MvoEdge.masterController = SC.ArrayController.create(
/** @scope MvoEdge.masterController.prototype */ {

  allowsMultipleSelection: NO,

  /**
  	The guid of the selected file/object that is currently being displayed by
    the application

    @property {String} selectedObjectId the guid of an object of type 
    MvoEdge.CoreDocumentNode
  */
  selectedObjectId: undefined,

  /**
    The root node of the CoreDocumentModel contains the document's
    descriptive metadata

    @property {Array} descriptiveMetadataDictionary
  */
  descriptiveMetadataDictionary: function () {
    return this.arrangedObjects().objectAt(0).get('metadata');
  }.property(),

  /**
    The selected object that is currently being displayed by the
    application

    @property {MvoEdge.Thumbnail} selectedObjectId
  */
  selectedObject: function () {
    var coreDocumentNodeId = this.get('selectedObjectId');
    if (coreDocumentNodeId) {
      var q = SC.Query.create({ recordType: MvoEdge.Thumbnail, 
          conditions: "coreDocumentNode = '" + coreDocumentNodeId + "'"});
      var imageObjects = MvoEdge.store.findAll(q);
      if (imageObjects) {
        var sizeImageObjects = imageObjects.get('length');
        if (sizeImageObjects > 0) {
          return imageObjects.firstObject();
        } else {
          console.error("There is no MvoEdge.Thumbnail in the store" + 
              " with the coreDocumentNodeId '" + coreDocumentNodeId + "' !");
          return null;
        }
      } else {
        console.error("Unable to retrieve the coreDocumentNodeId '" + 
            coreDocumentNodeId + "' in the store of MvoEdge.Thumbnail.");
        return null;
      }
    }
  }.property('selectedObjectId').cacheable(),

  /**
    Changes the currently selected object

    @param {String} guid the guid of an object of type MvoEdge.CoreDocumentNode
  */
  changeSelection: function (guid) {
    this.set('selectedObjectId', guid);
  }

});