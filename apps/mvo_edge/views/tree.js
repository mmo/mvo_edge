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

  render: function(context, firstTime) {
    console.log('TreeView render :');
  },
  
  /**
	Build the TreeView
  */
  buildTree: function() {
    console.log('TreeView buildTree :');

    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/
    // Every TreeNode is an object with a type: 'text' and a label:
    var div = MvoEdge.getPath('viewsPage.treeView');
    //create a new treeWidget
    //id of the div: this solution works but it's not optimal
    //var divTree = div.parentView.toString().split(':')[1];
    //var treeWidget = new YAHOO.widget.TreeView(div.parentView._view_layer.id); // div.parentView._view_layer.id
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

    // subscribe to the labelClick event on every tree node
    treeWidget.subscribe('clickEvent', function(node) {
		// when a tree node is selected, update the selection in the controller
		console.info('label ' + node.node.label);
		var f = node.node.data.treeNode;
		console.info("guid : " + f);
		MvoEdge.treeController.set('treeSelection', f);
    });
    console.log('TreeView buildTree treeWidget number of node : ' + treeWidget.getNodeCount());
    treeWidget.render();
    treeWidget.expandAll();
  },
  
  /**
	Add a node to his parent
  */
  addNode: function(node, parentWidgetNode) {
	var o = {label: node.get('label'), treeNode: node};
    var currentWidgetNode = new YAHOO.widget.TextNode(o, parentWidgetNode, false);

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
	Update selected node in the tree widget
  */
  selectNode: function() {
    console.log('TreeView, call selectNode');
    var treeSelection = MvoEdge.treeController.get('treeSelection');
    console.info('treeSelection : '+treeSelection);
	if (treeSelection) {
		var nodeToFocus = this.listOfTreeNode[treeSelection.get('guid')];
		console.info('nodeToFocus : '+nodeToFocus);
		if (nodeToFocus) {
			console.info('Focus done');
			nodeToFocus.focus();
		}
	}
	console.log('TreeView, end of call selectNode');
	}.observes('MvoEdge.treeController.treeSelection')

});
