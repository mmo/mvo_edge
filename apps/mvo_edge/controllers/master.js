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
    @property {MvoEdge.CoreDocumentNode} masterSelection the selected CDM node
  */
  masterSelection: undefined,
  
  /**
    @method

    Initialize the master controller, its content

    @param {SC.RecordArray} nodes records of the Core Document Model
  */
  initialize: function (nodes) {
    // NOTE: why is the master controller doing this?
    this._addImageUrl(nodes);
    var newNodes = MvoEdge.store.find(MvoEdge.CoreDocumentNode);
    console.info('NB: ' + newNodes.get('length')); // NOTE: normalize or delete
    this.set('content', newNodes);
    MvoEdge.logger.info('masterController initialized');
  },

 /**
    @method

    Add imageUrl property to each Record
    
    @private
    @param {SC.RecordArray} nodes are records of the CDM
  */
  // NOTE: why is the master controller updating the model? should the model do it itself? or the initializer?
  _addImageUrl: function (nodes) {
    nodes.forEach(function (node) {
      if (node.get('isLeafNode')) {
        // create the imageUrl and add this property
        var imageUrl = node.get('urlDefault');
        // NOTE: here all the logic of MvoEdge.configurator.getImageUrl()
        // is executed for each CDM leaf node; that logic could be factored out
        // into a single variable, making the function execute only once 
        imageUrl = MvoEdge.configurator.getImageUrl(imageUrl);
        node.writeAttribute('imageUrl', imageUrl, NO);
      }
    });
  },

  /**
    The the document's descriptive metadata contained in the root node of the
    CoreDocumentModel
    @property {Array} descriptiveMetadataDictionary
  */
  descriptiveMetadataDictionary: function () {
    var metadata = this.get('content').firstObject().get('metadata');
    return metadata;
  }.property('content')
});
