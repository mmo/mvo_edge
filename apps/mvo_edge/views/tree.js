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

  handleNodes: [],
  listOfTreeNode: {},
  nodeById: {},

  render: function (context, firstTime) {
    console.log('TreeView render :');
  },
  
  /**
    Build the TreeView
  */
  buildTree: function () {
    console.log('TreeView buildTree :');

    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/
    // Every TreeNode is an object with a type: 'text' and a label:
    var div = MvoEdge.getPath('viewsPage.treeView');
    //create a new treeWidget
    //id of the div: this solution works but it's not optimal
    //var divTree = div.parentView.toString().split(':')[1];
    //var treeWidget = new YAHOO.widget.TreeView(div.parentView._view_layer.id); 
    // div.parentView._view_layer.id
    var treeWidget = new YAHOO.widget.TreeView(div.parentView.toString().split(':')[1]);
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
        this.addNode(currentNode, treeWidget.getRoot());
      }
    }

    // subscribe to the clickEvent event on every tree node
    treeWidget.subscribe('clickEvent', function (node) {
      // when a tree node is selected, update the selection in the controller
      console.info('label ' + node.node.label);
      var tn = node.node.data.treeNode;
      console.info("TreeNode : " + tn);
      MvoEdge.treeController.set('treeSelection', tn);
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
  addNode: function (node, parentWidgetNode) {
    // Build TextNode with the label and the treeNode
    var obj = {label: node.get('label'), treeNode: node};
    var currentWidgetNode = new YAHOO.widget.TextNode(obj, parentWidgetNode, false);

    // mark node as added
    this.listOfTreeNode[node.get('guid')] = currentWidgetNode;
    this.handleNodes[node] = true;
    // add children of the node
    var nodeChildren = node.get('children');
    if (nodeChildren) {
      for (var idx = 0; idx < nodeChildren.length; idx++) {
        this.addNode(this.nodeById[nodeChildren[idx]], currentWidgetNode);
      }
    }
  },
   
  /**
    Update selected node in the tree widget.
  
    @observes MvoEdge.treeController.treeSelection
  */
  selectNode: function () {
    var treeSelection = MvoEdge.treeController.get('treeSelection');
    if (treeSelection) {
      var nodeToFocus = this.listOfTreeNode[treeSelection.get('guid')];
      if (nodeToFocus) {
        console.info('Set focus on the good treeNode');
        nodeToFocus.focus();
      }
    }
  }.observes('MvoEdge.treeController.treeSelection')

});