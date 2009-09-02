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

    Initialize the master controller, set its content

    @param {SC.RecordArray} nodes are records of the CDM
  */
  initialize: function (nodes) {
    this.set('content', nodes);
  },  

  /**
    The guid of the selected file/object that is currently being displayed by
    the application

    @property {MvoEdge.CoreDocumentNode} masterSelection the CDM node selected
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
    @method

    Create a local Url used to load the images.

    @returns {String} currentUrl
  */
  currentUrl: function () {
    var currentSelection = this.get('masterSelection');
    if (currentSelection) {
      var defaultUrl = currentSelection.get('urlDefault');
      var currentUrl = "/static/mvo_edge/en/current/images/VAA";
      currentUrl += defaultUrl.substring(defaultUrl.lastIndexOf("/"));
      return currentUrl;
    }
    else {
      return null;
    }
  }.property('masterSelection'),
  
  /**
    Master selection has changed, update the new size of the view

    @observes masterSelection
  */  
  masterSelectionDidChange: function () {
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();	
    tempIm.src = this.get('currentUrl');
    if (tempIm.complete) {
      div.adjust('width', tempIm.width + 20);
      div.adjust('height', tempIm.height + 20);
    }
    console.log('MvoEdge.masterController#masterSelectionDidChange');
  }.observes('masterSelection')

});