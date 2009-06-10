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
    The root node of the CoreDocumentModel contains the document's
    descriptive metadata

    @property {Array} descriptiveMetadataDictionary
  */
  descriptiveMetadataDictionary: function () {
    return this.arrangedObjects().objectAt(0);
  }.property(),

  /**
    The guid of the selected file/object that is currently being displayed by
    the application

    @property {String} selectedObjectId the guid of an object of type
    MvoEdge.CoreDocumentNode
   */
  selectedObjectId: undefined,

  /**
    The selected file/object that is currently being displayed by the
    application

    @property {MvoEdge.CoreDocumentNode} selectedObject
   */
  selectedObject: function () {
    if (this.get('selectedObjectId')) {
      return MvoEdge.CoreDocumentNode.find(this.get('selectedObjectId'));
    }
  }.property('selectedObjectId'),

  /**
    Changes the currently selected object

    @param {String} the guid of an object of type MvoEdge.CoreDocumentNode
   */
  changeSelection: function (guid) {
    console.log('mastercontroller.changeSelection ' + guid);
    this.set('selectedObjectId', guid);
  }

});
