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
    @initialize
    
    Initialize this controller => set its content
  */
  initialize: function () {
    var nodes = MvoEdge.masterController.get('content');
    this._createModel(nodes, this);
    var treeLabels = MvoEdge.store.findAll(MvoEdge.Tree);
    this.set('content', treeLabels);
    console.info('MvoEdge.treeeController# initialize');
  },
  
  /**
    @_createModel
    
    Create the tree model from the CDM
    
    @private
    @param {SC.Array} nodes CDM nodes
    */  
  _createModel: function (nodes, that) {
    var tempRecord = {};
    var guidId = 1;
    nodes.forEach(function (node) {
      //create a new tree record
      if(node.get('label') !== null && node.get('metadata') === null){
        var cdmNodeId = node.get('guid');
        var nodeAlreadyExist = tempRecord[cdmNodeId];
        if(nodeAlreadyExist === undefined){
          nodeAlreadyExist = that._getTreeAttributes(node, guidId);
          guidId++;
        }
        var treeChildren = [];
        var objectIds = [];
        var children = node.get('children');
        var isFirst = YES;
        children.forEach(function (child) {
          var nodeWithObjectIds = that._getObjectIds(child, nodes, isFirst);
          isFirst = NO;
          if(nodeWithObjectIds !== null){
            if(typeof(nodeWithObjectIds) === 'object'){
              objectIds = objectIds.concat(nodeWithObjectIds);
            }
            else{
              objectIds.push(nodeWithObjectIds);
            }
          }
          var nodeWithLabel = that._getNodeLabel(child, nodes);
          if(nodeWithLabel !== null){
            var attributes = that._getTreeAttributes(nodeWithLabel, guidId);
            guidId++;
            tempRecord[nodeWithLabel.get('guid')] = attributes;
            treeChildren.push(attributes[0]); 
          }
        });
        var tree = null;
        if(treeChildren.length !== 0){
          tree = MvoEdge.store.createRecord(MvoEdge.Tree, 
          {label: nodeAlreadyExist[1], coreDocumentNode: nodeAlreadyExist[2],
           children: treeChildren, objectIds: objectIds}, nodeAlreadyExist[0]);
          MvoEdge.store.commitRecord(MvoEdge.Tree,tree.get('guid'), tree.storeKey);  
        } 
        else{
          tree = MvoEdge.store.createRecord(MvoEdge.Tree, 
          {label: nodeAlreadyExist[1], coreDocumentNode: nodeAlreadyExist[2],
           children: treeChildren, objectIds: objectIds}, nodeAlreadyExist[0]);
          MvoEdge.store.commitRecord(MvoEdge.Tree,tree.get('guid'), tree.storeKey);  
        }
      } 
    });
  }, 

  /**
    @_getNodeLabel
    
    Return the node of the CDM if it has a label or null
    
    @private
    @param {String} nodeId id of the CDM node
    @param {SC.Array} nodes CDM nodes
    @returns {MvoEdge.Tree}
    */
  _getNodeLabel: function(nodeId, nodes){
    var query = SC.Query.create({conditions: "guid = '" + nodeId+"'", recordType: MvoEdge.CoreDocumentNode});
    var res = nodes.findAll(query);
    if(res.firstObject().get('label') !== null){
      return res.firstObject();
    }
    else{
      return null;
    }
  },
  
  /**
    @_getObjectIds
  
    Return the list of id of CDM nodes link with a node with a label. 
    
    @private
    @param {String} oneNode id of the CDM node
    @param {SC.Array} nodes CDM nodes  
    @param {Boolean} isFirst is the first child of this node   
    @returns {SC.Array}
  */
  _getObjectIds: function(oneNode, nodes, isFirst){
    var query = SC.Query.create({conditions: "guid = '" + oneNode+"'", recordType: MvoEdge.CoreDocumentNode});
    var res = nodes.findAll(query);
    if(res.firstObject().get('label') !== null){
      if(isFirst){
        return MvoEdge.treeController._getObjectIds(res.firstObject().get('children')[0], nodes, false);
      }
      else{
        return null;
      }
    }
    else if(res.firstObject().get('urlDefault') !== null){
      return res.firstObject().get('guid');
    }
    else{
      var listOfChildren = res.firstObject().get('children'); 
      if(listOfChildren !== null){
        var listObjectId = [];
        listOfChildren.forEach(function (childId) {
          var objectId = MvoEdge.treeController._getObjectIds(childId, nodes, false);
          if(objectId !== null){
            listObjectId.push(objectId);
          }
        });
        return listObjectId;
      }
      else{
        return null;
      }
    }
  },
  
  /**
    @_getTreeAttributes
    
    Get some attributes (guid, label, cdmId) of an MvoEdge.Tree
    
    @private
    @param {MvoEdge.CoreDocumentNode} node one CDM node
    @param {Integer} nb sequence number to create a new guid
    @returns {SC.Array}
    */  
  _getTreeAttributes: function(node, nb) {
    var listOfAttribute = [];
    var label = node.get('label');
    var guid = 't0000' + nb;
    var cdmId = node.get('guid');
    listOfAttribute.push(guid);
    listOfAttribute.push(label);
    listOfAttribute.push(cdmId);
    return listOfAttribute;
  },  
   
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