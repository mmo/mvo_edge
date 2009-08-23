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
    @property {String}
   */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",

  /**
    A conversion table (masterSelection -> thumbnail) used to quickly determine
    the thumbnail associated with a certain master selection
   */
  _masterSelectionToThumbnail: {},
  
  /**
    @initialize
    
    Initialize this controller => set its content
  */
  initialize: function () {
    var nodes = MvoEdge.masterController.get('content');
    this._createModel(nodes);
    var thumbnails = MvoEdge.store.findAll(MvoEdge.Thumbnail);
    this.set('content', thumbnails);
    console.info('MvoEdge.thumbnailController# initialize finish');
  },
  
  /**
    @createModel
    
    Create the thumbnail model from the CDM
    
    @private
    @param {SC.Array} nodes CDM nodes
    */
    _createModel: function (nodes) {
      var guidId = 1;
      nodes.forEach(function (node) {
        //create a new thumbnail record
        if(node.get('urlDefault') !== null){
          var guid = 'f0000'+guidId;
          guidId++;
          var tempUrl = node.get('urlDefault');
          var staticUrl = "/static/mvo_edge/en/current/images/VAA";
          staticUrl += tempUrl.substring(tempUrl.lastIndexOf("/"));
          SC.imageCache.loadImage(staticUrl);
          var thumbnail = MvoEdge.store.createRecord(MvoEdge.Thumbnail,
          {url: staticUrl, image_url: tempUrl, coreDocumentNode: node.get('guid')}, guid);
          var res = MvoEdge.store.commitRecord(MvoEdge.Thumbnail,thumbnail.get('guid'), thumbnail.storeKey); 
        }
      });
      console.info('MvoEdge.thumbnailController# createModel');
    },
   
   /**
    If 'content' changes, the _masterSelectionToThumbnail conversion table must
    be updated (this should only happen once, during aplication setup)
   */
  _contentDidChange: function () {
    var newTable = {};
    var thumbnails = MvoEdge.store.findAll(MvoEdge.Thumbnail);
    if (thumbnails && thumbnails.isEnumerable) {
      thumbnails.forEach(function (thumbnail) {
        var coreDocumentNode = thumbnail.get('coreDocumentNode');
        newTable[coreDocumentNode] = thumbnail;
      });
    }
    this.set('_masterSelectionToThumbnail', newTable);

    console.info('MvoEdge.thumbnailController#_contentDidChange');

  }.observes('content'),

  /**
    Updates the masterSelection binding if the currently selected thumbnail 
    has changed.
    
    @observes selection
   */
  _selectionDidChange: function () {
    var coreDocumentNodeId =
        this.get('selection').firstObject().get('coreDocumentNode');
    // make sure the selection has actually changed, (to avoid loopbacks)
    if (coreDocumentNodeId &&
        coreDocumentNodeId !== this.get('masterSelection')) {
      this.set('masterSelection', coreDocumentNodeId);
    }

    console.info('MvoEdge.thumbnailController#_selectionDidChange: ' +
        'new selection is ' + this.get('selection').firstObject().get('guid'));

  }.observes('selection'),

  /**
    Updates thumbnail selection by observing changes in master controller's
    master selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    // find the thumbnail that corresponds to the current master selection
    var newThumbnail =
        this.get('_masterSelectionToThumbnail')[this.get('masterSelection')];

    // make sure the selection has actually changed, (to avoid loopbacks)
    if (this.get('selection') === undefined || newThumbnail && newThumbnail !== this.get('selection').firstObject()) {
      this.set('selection', SC.SelectionSet.create().addObject(newThumbnail));
    }

    console.info('MvoEdge.thumbnailController#_masterSelectionDidChange: ' +
        'new master selection is ' + this.get('masterSelection'));

  }.observes('masterSelection')

});
