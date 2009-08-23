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
    @initialize
    
    Initialize the master controller => set its content
  */
  initialize: function () {
    var nodes = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
    this.set('content', nodes);
  },  

  /**
    The guid of the selected file/object that is currently being displayed by
    the application

    @property {String} masterSelection the guid of an object of type 
    MvoEdge.CoreDocumentNode
  */
  masterSelection: undefined,

  /**
    The root node of the CoreDocumentModel contains the document's
    descriptive metadata

    @property {Array} descriptiveMetadataDictionary
  */
  descriptiveMetadataDictionary: function () {
    return this.arrangedObjects().firstObject().get('metadata');
  }.property(),
  
  /**
    The selected object that is currently being displayed by the
    application

    @property {MvoEdge.Thumbnail} selectedObjectId
  */
  selectedObject: function () {
    var coreDocumentNodeId = this.get('masterSelection');
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
  }.property('masterSelection'),
  
  /**
    @masterSelectionDidChange
    
    Master selection has changed, update the new size of the view

    @observes masterSelection
  */
  
  masterSelectionDidChange: function () {
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();
    tempIm.src = this.get('selectedObject').get('url');
    div.adjust('width', tempIm.width+20);
    div.adjust('height', tempIm.height+20);
    console.log('MvoEdge.masterController#masterSelectionDidChange');
  }.observes('masterSelection'),

});