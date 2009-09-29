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
    @method

    Initialize the master controller, its content and the initial selection

    @param {SC.RecordArray} nodes records of the Core Document Model
  */
  initialize: function (nodes) {
    this.set('content', nodes);
    // initialize the selection with the first CDM leaf node
    var sortedNodes = nodes.sortProperty('guid');
    for (var i = 0; i < sortedNodes.length; i++) {
      if (sortedNodes[i].get('isLeafNode')) {
        this.set('masterSelection', sortedNodes[i]);
        break;
      }
    }
  },

  /**
    The guid of the selected file/object that is currently being displayed by
    the application
    @property {MvoEdge.CoreDocumentNode} masterSelection the selected CDM node
  */
  masterSelection: undefined,

  /**
    The the document's descriptive metadata contained in the root node of the
    CoreDocumentModel
    @property {Array} descriptiveMetadataDictionary
  */
  descriptiveMetadataDictionary: function () {
    return this.arrangedObjects().firstObject().get('metadata');
  }.property()

});
