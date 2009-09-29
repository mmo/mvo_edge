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
    Binds to the master selection
    @property {MvoEdge.CoreDocumentNode}
   */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",

  /**
    A conversion table (masterSelectionId -> thumbnail) used to quickly
    determine the thumbnail associated with a certain master selection
   */
  _cdmNodeToThumbnail: {},
  
  /**
    @method

    Initialize this controller, create the sub-model and then set its content

    @param {SC.RecordArray} nodes are records of the CDM
  */
  initialize: function (nodes) {
    this._createSubmodel(nodes);
    var thumbnails = MvoEdge.store.findAll(MvoEdge.Thumbnail);
    this.set('content', thumbnails);
  },
  
  /**
    @method

    Create the thumbnail submodel from the CDM nodes
    
    @private
    @param {SC.RecordArray} nodes are records of the CDM    
  */
  _createSubmodel: function (nodes) {
    nodes.forEach(function (node) {
      if (node.get('isLeafNode')) {
        var cdmNodeId = node.get('guid');
        var id = 'f%@'.fmt(cdmNodeId);
        var staticUrl = node.get('staticUrl');
        SC.imageCache.loadImage(staticUrl);
        var thumbnailHash = {
            guid: id,
            url: staticUrl,
            coreDocumentNode: cdmNodeId
          };
        // create a new thumbnail record
        var thumbnail = MvoEdge.store.createRecord(
              MvoEdge.Thumbnail, thumbnailHash, id);
        var res = MvoEdge.store.commitRecord(MvoEdge.Thumbnail, id);
      }
    });
  },
   
   /**
    If 'content' changes, the _cdmNodeToThumbnail conversion table must
    be updated (this should only happen once, during aplication setup)
   */
  _contentDidChange: function () {
    var newTable = {};
    var thumbnails = MvoEdge.store.findAll(MvoEdge.Thumbnail);
    if (thumbnails && thumbnails.isEnumerable) {
      for (var i = 0; i < thumbnails.length(); i++) {
        var thumbnail = thumbnails.objectAt(i);
        var coreDocumentNodeId = thumbnail.get('coreDocumentNode').get('guid');
        newTable[coreDocumentNodeId] = thumbnail;
      }
    }
    this.set('_cdmNodeToThumbnail', newTable);

  }.observes('content'),

  /**
    Updates the masterSelection binding if the currently selected thumbnail 
    has changed.
    
    @observes selection
   */
  _selectionDidChange: function () {
    if (!SC.none(this.get('selection')) &&
        !SC.none(this.get('selection').firstObject())) {
      var coreDocumentNode =
          this.get('selection').firstObject().get('coreDocumentNode');
      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(this.get('masterSelection')) ||
          coreDocumentNode !== this.get('masterSelection')) {
        SC.RunLoop.begin();
        this.set('masterSelection', coreDocumentNode);
        SC.RunLoop.end();

        console.info('MvoEdge.thumbnailController#_selectionDidChange: %@'.
            fmt(this.get('selection').firstObject()));
      }
    }
  }.observes('selection'),

  /**
    Updates thumbnail selection by observing changes in master controller's
    master selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    // find the thumbnail that corresponds to the current master selection
    var currentThumbnailSelection = !SC.none(this.get('selection')) ?
        this.get('selection').firstObject() : undefined;
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      var newThumbnail =
          this.get('_cdmNodeToThumbnail')[currentMasterSelection.get('guid')];

      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(currentThumbnailSelection) ||
          (newThumbnail && newThumbnail !== currentThumbnailSelection)) {
        this.set('selection', SC.SelectionSet.create().addObject(newThumbnail));

        console.info('MvoEdge.thumbnailController#_masterSelectionDidChange: %@'.
            fmt(this.get('masterSelection').get('guid')));
      }
    }
  }.observes('masterSelection')

});
