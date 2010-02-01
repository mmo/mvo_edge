/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
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
    this.set('content', nodes);
    MvoEdge.logger.info('masterController initialized');
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
