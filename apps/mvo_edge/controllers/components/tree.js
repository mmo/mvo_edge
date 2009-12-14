// ==========================================================================
// Project:   MvoEdge.tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/** @class

  This controller manages the behavior of the tree view. It depends on
  the master controller.

  @extends SC.TreeController
*/

MvoEdge.treeController = SC.TreeController.create(
/** @scope MvoEdge.treeController.prototype */ {

  /**
    Binds to the master selection
    @property {MvoEdge.CoreDocumentNode}
   */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection",

  /**
    A conversion table (masterSelectionId -> treeNodeId) used to quickly
    determine the treeNode associated with a certain master selection
   */
  _cdmNodeToTreeNode: {},
  
  /**
  An Array that contains all nodes of the tree with there id.   
  */
  _treeNodeById: [],
  
  /**
    @method

    Initialize this controller, create the sub-model and the tree model

    @param {SC.RecordArray} nodes are records of the CDM
  */
  initialize: function (nodes) {
    this._createSubmodel(nodes);
    this._buildTree();
  },


  /**
    @method

    Creates the tree submodel

    @private
    @param {SC.RecordArray} cdmNodes
  */
  _createSubmodel: function (cdmNodes) {
    //create a fake node to be used as the root Node
    var listOfChild = [];
    listOfChild.push("t" + cdmNodes.firstObject().get('guid'));
    var rootNodeHash = {
        guid:         "tn00000",
        label:        "Root",
        children:     listOfChild
      };
    var newTreeNode = MvoEdge.store.createRecord(
        MvoEdge.Tree, rootNodeHash, "tn00000");
    MvoEdge.store.commitRecord(MvoEdge.Tree, "tn00000");
    // start the submodel creation from the CDM root node
    this._visitCdmNode(cdmNodes.firstObject());
    
    // TODO document this and define where to put it
    var treeNodes = 
        MvoEdge.store.findAll(MvoEdge.Tree).sortProperty('guid').enumerator();
    var treeNodesArray = [];
    for (var t = 0; t < treeNodes._length; t++) {
      var treeNodeHash = JSON.stringify(treeNodes.nextObject().attributes());
      treeNodesArray.push(treeNodeHash);
    }
    treeNodes.reset();
    var treeNodesJSON = JSON.stringify(treeNodesArray);
    console.log(treeNodesJSON);
  },
  
  /**
  @method
  
  Create the Tree structure using the model tree_content
  
  @private
  */  
  _buildTree: function () {
    console.info('building tree');
    var treeLabels = MvoEdge.store.find(SC.Query.create({recordType: MvoEdge.Tree})).sortProperty('guid');
    var tp =  MvoEdge.TreeContent.create(
      {label: treeLabels.firstObject().get('label'), guidId: treeLabels.firstObject().get('guid'), treeItemIsExpanded: YES});
    this._treeNodeById[tp.get('guidId')] = tp;
    this.set('content', tp);
    MvoEdge.logger.info('The tree has been created');
  },

  /**
    @method

    Recursive function that handles a CDM node during the construction of the
    tree submodel.

    There are 2 main kinds of CDM nodes:
    - A: leaf:
        they have a sequenceNumber, a urlDefault and no children; these are
        the nodes with content to be displayed
    - B: inner nodes, with two subkinds:
        - B.1: inner nodes with label
            they have a label and children; a new tree node is created for
            each CDM node of this kind
        - B.2: inner nodes without label:
            they have no label but they have children; they exist mainly in
            order to group a list of leaf nodes under no specific label, which
            means that the user cannot navigate

    General algorithm:
      start by visit(CDM root node)
      visit(CDM node):
        if CDM node is a leaf:
          return leaf id
        else:
          initialize list L1 of CDM leaf node ids (empty)
          initialize list L2 of child tree nodes (empty)
          for all CDM node children:
            visit(child)
            if child returned one or more ids:
              add id(s) to L1
            else if child returned a new tree node:
              add new tree node to L2
          if CDM node of kind B.1 (with label):
            return new tree node using:
              - L1 as associated CDM leaf node ids;
              - L2 as children;
              - first element of L1 as target CDM node
          else (CDM node of kind B.2, without label):
            return L1

    @returns {Object} hash table with keys {newNode, leaves};
    - 'newNode' is the id of a newly created tree node;
    - 'leaves' is a list of CDM leaf nodes collected during the execution;
    the properties are not both returned each time the function is called; if
    a new tree node is created, then 'newNode' holds a value, otherwise it is
    'leaves' that holds a value;
  */
  _visitCdmNode: function (cdmNode) {
    var cdmNodeLabel    = cdmNode.get('label'),
        cdmNodeChildren = cdmNode.get('children');

    // integrity check: cdmNode should be either a leaf node or an inner node
    if (!cdmNode.get('isLeafNode') && !cdmNode.get('isInnerNode')) {
      throw "cdmNode does not qualify either as leaf or as inner node";
    }

    // if CDM node is a leaf:
    if (cdmNode.get('isLeafNode')) {
      return {leaves: [cdmNode.get('guid')]};
    }
    else { // inner node
      var listOfLeaves   = [],
          listOfChildren = [];

      // visit cdmNode children
      if (!SC.none(cdmNodeChildren) && cdmNodeChildren.isEnumerable) {
        // recursively visit child nodes of cdmNode
        for (var i = 0; i < cdmNodeChildren.length(); i++) {
          var cdmChild = cdmNodeChildren.objectAt(i);
          if (!SC.none(cdmChild)) {
            var result = this._visitCdmNode(cdmChild);
            // if child returned a new tree node id
            if (!SC.none(result.newNode)) {
              listOfChildren.push(result.newNode.get('guid'));
            }
            else if (!SC.none(result.leaves)) { // child returned list of leaves
              listOfLeaves = listOfLeaves.concat(result.leaves);
            }
          }
        }
      }
      // if CDM node of kind B.1 (with label)
      if (SC.typeOf(cdmNodeLabel) === SC.T_STRING && cdmNodeLabel.length > 0) {
        // tree node guid is based on the id of cdmNode, for easier tracing
        var newTreeNodeId = 't%@'.fmt(cdmNode.get('guid'));
        // create hash
        var treeNodeHash = {
            guid:             newTreeNodeId,
            label:            cdmNodeLabel,
            cdmLeafNodeIds:   listOfLeaves
          };
          
        // if the new tree node has CDM leaf nodes of its own then the
        // 'targetCdmLeaf' property corresponds to its first CDM leaf node; if
        // the new tree node has child tree nodes, then its 'targetCdmLeaf'
        // property is inherited from its first child; if both are present, then
        // the 'targetCdmLeaf' property corresponds to the earliest of them in
        // the sequence
        if (listOfChildren.length > 0) {
          treeNodeHash.children = listOfChildren;

          var firstTreeChild =
              MvoEdge.store.find(MvoEdge.Tree, listOfChildren[0]);
          var firstTreeChildCdmLeaf =
              firstTreeChild.get('targetCdmLeaf').get('guid');

          if (SC.typeOf(firstTreeChildCdmLeaf) === SC.T_STRING) {
            if (SC.typeOf(listOfLeaves[0]) === SC.T_STRING) {
              // there is both a 'firstTreeChildCdmLeaf' and a first direct leaf;
              // pick the earliest (TODO: based on the id - not trustworthy!)
              if (firstTreeChildCdmLeaf < listOfLeaves[0]) {
                treeNodeHash.targetCdmLeaf = firstTreeChildCdmLeaf;
              }
              else {
                treeNodeHash.targetCdmLeaf = listOfLeaves[0];
              }
            }
            else {
              treeNodeHash.targetCdmLeaf = firstTreeChildCdmLeaf;
            }
          }
        }
        else {
          // 'targetCdmLeaf' is the first direct CDM leaf
          treeNodeHash.targetCdmLeaf = listOfLeaves[0];
        }
        // add the new tree node to the store and commit
        var newTreeNode = MvoEdge.store.createRecord(
            MvoEdge.Tree, treeNodeHash, newTreeNodeId);
        MvoEdge.store.commitRecord(MvoEdge.Tree, newTreeNodeId);
        // update the table _cdmNodeToTreeNode
        for (var j = 0; j < listOfLeaves.length; j++) {
          this._cdmNodeToTreeNode[listOfLeaves[j]] = treeNodeHash.guid;
        }
        return { newNode: newTreeNode };
      }
      else { // CDM node of kind B.2 (without label)
        return {leaves: listOfLeaves};
      }
    }
  },

  /**
    Updates the masterSelection binding if the currently selected tree node has
    changed.

    @observes treeSelection
   */
  _selectionDidChange: function () {
    var needToChange =  YES;
    var treeSelectionId = this.get('selection');
    if (!SC.none(this.get('selection')) && 
      !SC.none(this.get('selection').firstObject()))  {
      treeSelectionId = this.get('selection').firstObject().get('guidId');
      var treeSelection = MvoEdge.store.find(MvoEdge.Tree, treeSelectionId);
      if (!SC.none(treeSelection)) {
        var target = treeSelection.get('targetCdmLeaf');
        var cdmLeafNodeIds = treeSelection.get('cdmLeafNodeIds');
        var currentMasterSelection = this.get('masterSelection');
        var masterSelectionId = currentMasterSelection.get('guid');
        if (SC.typeOf(cdmLeafNodeIds) === SC.T_ARRAY) {
          for (var i = 0; i < cdmLeafNodeIds.length; i++) {
            if (cdmLeafNodeIds[i] === masterSelectionId) {
              // the change in the three selection does not imply a change of
              // the master selection
              needToChange = NO;
              break;
            }
          }
        }
        if (!SC.none(target) && this.get('masterSelection') !== target) {
          if (needToChange) {
            SC.RunLoop.begin();
            this.set('masterSelection', treeSelection.get('targetCdmLeaf'));
            SC.RunLoop.end();
          }
        }
      }
      console.info('MvoEdge.treeController#_selectionDidChange: %@'.
          fmt(treeSelectionId));
    }      
  }.observes('selection'),

  /**
    @method

    Updates selection by observing changes in master controller's master
    selection

    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    var cdmLeafNodeIdInArray = NO;
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      if (!SC.none(this.get('selection')) && !SC.none(this.get('selection').firstObject())) {
        var currentSelection = this.get('selection').firstObject().get('guidId');
        var treeSelection = MvoEdge.store.find(MvoEdge.Tree, currentSelection);
        if (!SC.none(treeSelection)) {
          var cdmLeafNodeIds = treeSelection.get('cdmLeafNodeIds');
          var masterSelectionId = currentMasterSelection.get('guid');
          if (SC.typeOf(cdmLeafNodeIds) === SC.T_ARRAY) {
            for (var i = 0; i < cdmLeafNodeIds.length; i++) {
              if (cdmLeafNodeIds[i] === masterSelectionId) {
                // the change in the content selection does not imply a change of
                // the tree selection
                cdmLeafNodeIdInArray = YES;
                break;
              }
            }
          }
          if (cdmLeafNodeIds.length === 0) { 
            if (treeSelection.get('targetCdmLeaf').get('guid') === masterSelectionId) {
              cdmLeafNodeIdInArray = YES;
            }
          }
        }
      }
      if (!cdmLeafNodeIdInArray) {
        var newSelection = this.get('_cdmNodeToTreeNode')[currentMasterSelection.get('guid')];
        this.set('selection', SC.SelectionSet.create().addObject(this._treeNodeById[newSelection]));
      }
      console.info('MvoEdge.treeController#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
    }
  }.observes('masterSelection')

});
