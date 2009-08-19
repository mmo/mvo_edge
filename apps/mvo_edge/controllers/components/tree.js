// ==========================================================================
// Project:   MvoEdge.tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/** @class

  This controller manages the behavior of the tree view. It depends on
  the master controller.

  @extends SC.Object
*/

MvoEdge.treeController = SC.ArrayController.create(
/** @scope MvoEdge.treeController.prototype */ {

  /**
    Binds to the master selection
    @property {String}
   */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",

  /**
    Currently selected treeNode.

    @property {MvoEdge.Tree}
    @default undefined
  */
  treeSelection: undefined,

  /**
    A conversion table (masterSelection -> treeNode) used to quickly determine
    the treeNode associated with a certain master selection
   */
  _masterSelectionToTreeNode: {},
   
   /**
    If 'content' changes, the _masterSelectionToTreeNode conversion table must
    be updated (this should only happen once, during aplication setup)
   */
  _contentDidChange: function () {
    var newTable = {};
    var treeNodes = MvoEdge.store.findAll(MvoEdge.Tree);
    if (treeNodes && treeNodes.isEnumerable) {
      treeNodes.forEach(function (treeNode) {
        var objectIds = treeNode.get('objectIds');
        if (objectIds && objectIds.isEnumerable) {
          objectIds.forEach(function (objectId) {
            newTable[objectId] = treeNode;
          });
        }
      });
    }
    this.set('_masterSelectionToTreeNode', newTable);

    console.info('MvoEdge.treeController#_contentDidChange');

  }.observes('content'),

  /**
    Updates the masterSelection binding if the currently selected tree node has
    changed.
    
    @observes treeSelection
   */
  _treeSelectionDidChange: function () {
    // make sure the masterSelection must change
    // no change if call after _masterSelectionDidChange
    var objectIdInArray = NO;
    var currentSelection = this.get('masterSelection');
    var objectIds = this.get('treeSelection').get('objectIds');
    if (objectIds && objectIds.length > 0) {
      for (var i = 0; i < objectIds.length; i++) {
        if (objectIds[i] === currentSelection) {
          objectIdInArray = YES;
          break;
        }
      }
    }

    // make sure the selection has actually changed, (to avoid loopbacks)
    if (!objectIdInArray) {
      this.set('masterSelection', objectIds.firstObject());
    }

    console.info('MvoEdge.treeController#_treeSelectionDidChange: ' +
        'new treeSelection is ' + this.get('treeSelection').get('guid'));

  }.observes('treeSelection'),

  /**
    Updates treeSelection by observing changes in master controller's master
    selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    var objectIdInArray = NO;
    var currentSelection = this.get('masterSelection');
    // make sure the treeSelection must change
    if(this.get('treeSelection')){
      var objectIds = this.get('treeSelection').get('objectIds');
      console.log('treeSelection objectIds '+ objectIds.length);
      if (objectIds && objectIds.length > 0) {
        for (var i = 0; i < objectIds.length; i++) {
          if (objectIds[i] === currentSelection) {
            objectIdInArray = YES;
            break;
          }
        }
      }
    }
    // make sure the selection has actually changed, (to avoid loopbacks)
    if (!objectIdInArray) {
      // find the tree node that corresponds to the current master selection
      var newTreeNode = this.get('_masterSelectionToTreeNode')[this.get('masterSelection')];
      // make sure the selection has actually changed, (to avoid loopbacks)
      if (newTreeNode && newTreeNode !== this.get('treeSelection')) {
        // update the current tree selection
        this.set('treeSelection', newTreeNode);
      }
    }
    
    console.info('MvoEdge.treeController#_masterSelectionDidChange: ' + 
    'new masterSelection is ' + this.get('masterSelection'));

  }.observes('masterSelection')

});