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
    @method

    Initialize this controller, create the sub-model and then set its content

    @param {SC.RecordArray} nodes are records of the CDM
  */
  initialize: function (nodes) {
    this._createModel(nodes, this);
    var treeLabels = MvoEdge.store.findAll(MvoEdge.Tree);
    this.set('content', treeLabels);
    console.info('MvoEdge.treeeController# initialize');
  },
  
  /**
    @method

    Create the model for the treeController from nodes of the CDM
    
    @private
    @param {SC.RecordArray} nodes are records of the CDM
    @param {MvoEdge.treeController} that = this
    */  
  _createModel: function (nodes, that) {
	//list of all MvoEdge.Tree
    var ListOfTreeNode = {};
    var guidId = 1;
    nodes.forEach(function (node) {
      //a MvoEdge.Tree is an MvoEdge.CoreDocumentNode that has a label
      //we don't take the root node of the CDM
      if (node.get('label') !== null && node.get('parentId') !== 'undefined') {
        var nodeId = node.get('guid');
        var currentTreeNode = ListOfTreeNode[nodeId];
        // if it is the first time the node is visited, get needed attributes
        // for the tree record 
        if (currentTreeNode === undefined) {
          currentTreeNode = that._getTreeAttributes(node, guidId);
          guidId++;
        }
        //list of children of the treeNode a child is a treeNode too
        var treeChildren = [];
        //list of CDM node with an url link with this treeNode
        var objectIds = [];
        //list of the children of the current CDM node
        var children = node.get('children');
        var isFirst = YES;
        children.forEach(function (child) {
	      //a child node of the current CDM node can become a children
		  //of the current tree node => it's a node with a label
		  //or an objectId  => it's has an url (or it has a child with an url)
          var nodeWithObjectIds = that._getObjectIds(child, nodes, isFirst);
          isFirst = NO;
          if (nodeWithObjectIds !== null) {
            if (typeof(nodeWithObjectIds) === 'object') {
              objectIds = objectIds.concat(nodeWithObjectIds);
            }
            else {
              objectIds.push(nodeWithObjectIds);
            }
          }
          var nodeWithLabel = that._getNodeLabel(child, nodes);
          if (nodeWithLabel !== null) {
            var attributes = that._getTreeAttributes(nodeWithLabel, guidId);
            guidId++;
            ListOfTreeNode[nodeWithLabel.get('guid')] = attributes;
            treeChildren.push(attributes.guid); 
          }
        });
        //create the record and store it
        var tree = MvoEdge.store.createRecord(MvoEdge.Tree, 
        {guid: currentTreeNode.guid, label: currentTreeNode.label, coreDocumentNode: currentTreeNode.cdmId,
        children: treeChildren, objectIds: objectIds}, currentTreeNode.guid);
        MvoEdge.store.commitRecord(MvoEdge.Tree, tree.get('guid'), tree.storeKey);  
      } 
    });
  }, 

  /**
    @method

    Return the node of the CDM if it has a label or null
    
    @private
    @param {String} nodeId id of the CDM node
    @param {SC.RecordArray} nodes are records of the CDM
    @returns {MvoEdge.CoreDocumentNode}
    */
  _getNodeLabel: function (nodeId, nodes) {
    var query = SC.Query.create({conditions: "guid = '" + nodeId + "'", recordType: MvoEdge.CoreDocumentNode});
    var res = nodes.findAll(query);
    if (res.firstObject().get('label') !== null) {
      return res.firstObject();
    }
    else {
      return null;
    }
  },
  
  /**
    @method

    Return the list of id of CDM nodes link with a node with a label. 
    
    @private
    @param {String} oneNode id of the CDM node
    @param {SC.RecordArray} nodes are records of the CDM
    @param {Boolean} isFirst is the first child of this node   
    @returns {SC.Array}
  */
  _getObjectIds: function (oneNode, nodes, isFirst) {
    var query = SC.Query.create({conditions: "guid = '" + oneNode + "'", recordType: MvoEdge.CoreDocumentNode});
    var res = nodes.findAll(query);
    //if the node has a label it's not an objectId
    if (res.firstObject().get('label') !== null) {
      if (isFirst) {
        return MvoEdge.treeController._getObjectIds(res.firstObject().get('children')[0], nodes, false);
      }
      else {
        return null;
      }
    }
    //if the node has an url is an objectId
    else if (res.firstObject().get('urlDefault') !== null) {
      return res.firstObject().get('guid');
    }
    //else see if it children is an objectId
    else {
      var listOfChildren = res.firstObject().get('children'); 
      if (listOfChildren !== null) {
        var listObjectId = [];
        listOfChildren.forEach(function (childId) {
          var objectId = MvoEdge.treeController._getObjectIds(childId, nodes, false);
          if (objectId !== null) {
            listObjectId.push(objectId);
          }
        });
        return listObjectId;
      }
      else {
        return null;
      }
    }
  },
  
  /**
    @method

    Get some attributes (guid, label, cdmId) of an MvoEdge.Tree
    
    @private
    @param {MvoEdge.CoreDocumentNode} node one CDM node
    @param {Integer} nb sequence number to create a new guid
    @returns {SC.Object}
    */  
  _getTreeAttributes: function (node, nb) {
    var treeRecordAttributes = {};
    var label = node.get('label');
    var guid = 't0000' + nb;
    var cdmId = node.get('guid');
    treeRecordAttributes.guid =  guid;
    treeRecordAttributes.label = label;
    treeRecordAttributes.cdmId = cdmId;
    return treeRecordAttributes;
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
    var objectIds = this.get('treeSelection').get('objectIds');
    //verify if masterSelection is not undefined
    var masterS = this.get('masterSelection');
    if (masterS !== undefined) {
      var currentSelection = this.get('masterSelection').get('guid');
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
      var CDMguid = objectIds.firstObject();
      var res = MvoEdge.store.find(MvoEdge.CoreDocumentNode, CDMguid);
      this.set('masterSelection', res);
    }

    console.info('MvoEdge.treeController#_treeSelectionDidChange: ' +
        'new treeSelection is ' + this.get('treeSelection').get('guid'));

  }.observes('treeSelection'),

  /**
    @method

    Updates treeSelection by observing changes in master controller's master
    selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    var objectIdInArray = NO;
    var currentSelection = this.get('masterSelection');
    // make sure the selection has actually changed, (to avoid loopbacks)
    if (!objectIdInArray) {
      // find the tree node that corresponds to the current master selection
      var newTreeNode = this.get('_masterSelectionToTreeNode')[this.get('masterSelection').get('guid')];
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