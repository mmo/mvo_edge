// ==========================================================================
// Project:   MvoEdge.Tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */
/** @class

  (Document Your View Here)

  @extends SC.View
*/
MvoEdge.TreeView = SC.View.extend(
/** @scope MvoEdge.Tree.prototype */ {

  /**
    Binds to the tree selection in the tree controller
    @property {MvoEdge.Tree}
   */
  treeSelectionBinding: "MvoEdge.treeController.treeSelection",

  handleNodes: [],
  listOfTreeNode: {},
  nodeById: {},
  
  /**
    For use in event subscription closure
  */
  absoluteThis: this,

  render: function (context, firstTime) {
    console.log('TreeView render :');
  },
  
  /**
    Build the TreeView
  */
  buildTree: function (divId) {
    console.log('TreeView buildTree :');

    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/

    var treeWidget = new YAHOO.widget.TreeView('treeId');
    var treeNodeRecords = MvoEdge.store.findAll(MvoEdge.Tree);
    
    //create hashtable of node
    var enumerator = treeNodeRecords.enumerator();
    console.log('TreeView buildTree number of label: ' + enumerator._length);
    for (var t = 0; t < enumerator._length; t++) {
      var obj = enumerator.nextObject();
      this.nodeById[obj.get('guid')] = obj;
    }
    enumerator.reset();

    //retreive all node
    for (var i = 0; i < enumerator._length; i++) {
      var currentNode = enumerator.nextObject();
      if (!this.handleNodes[currentNode]) {
        this._addNode(currentNode, treeWidget.getRoot());
      }
    }

    // subscribe to the clickEvent event on every tree node
    treeWidget.subscribe('clickEvent', function (node) {
      // when a tree node is selected, update the selection in the controller
      console.info('label ' + node.node.label);
      var tn = node.node.data.treeNode;
      console.info("TreeNode : " + tn);
      node.node.data.topTreeView._changeTreeSelection(tn);
    });
    console.log('TreeView buildTree treeWidget number of node : ' + treeWidget.getNodeCount());
    treeWidget.render();
    treeWidget.expandAll();
  },
  
  /**
    Add a node to his parent
    
    @param {Object} node the TreeNode
    @param {YAHOO.widget.Node} parentWidgetNode the TreeNode's parent node
  */
  _addNode: function (node, parentWidgetNode) {
    // Build TextNode with the label and the treeNode
    // Note: the 'topTreeView' must be included in 'obj' so that the function
    // that will be attached to the 'clickEvent' knows how to call this view
    // object, to notify it of a change in the selection
    var obj = {label: node.get('label'), treeNode: node, topTreeView: this};
    var currentWidgetNode = new YAHOO.widget.TextNode(obj, parentWidgetNode, false);

    // mark node as added
    this.listOfTreeNode[node.get('guid')] = currentWidgetNode;
    this.handleNodes[node] = true;
    // add children of the node
    var nodeChildren = node.get('children');
    if (nodeChildren) {
      for (var idx = 0; idx < nodeChildren.length; idx++) {
        this._addNode(this.nodeById[nodeChildren[idx]], currentWidgetNode);
      }
    }
  },
  
  /**
    update the treeSelection of the treeController
    
    @param {YAHOO:widget.Node} selected treeNode
    */
  _changeTreeSelection: function (treeNode) {
    SC.RunLoop.begin();
    this.set('treeSelection', treeNode );
    SC.RunLoop.end();
  },
   
  /**
    Update selected node in the tree widget.
  
    @observes treeSelection
  */
  _treeSelectionDidChange: function () {
    console.log('set focus '+ this.get('treeSelection'));
    var treeSelection = this.get('treeSelection');
    if (treeSelection) {
      var nodeToFocus = this.listOfTreeNode[treeSelection.get('guid')];
      if (nodeToFocus) {
        console.info('Set focus on the good treeNode ');
        nodeToFocus.focus();
      }
    }
  }.observes('treeSelection')

});