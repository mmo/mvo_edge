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
  }.property()

});