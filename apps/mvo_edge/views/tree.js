// ==========================================================================
// Project:   MvoEdge.Tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */
require('core');
/** @class

  (Document Your View Here)

  @extends SC.View
*/
MvoEdge.TreeView = SC.View.extend(
/** @scope MvoEdge.Tree.prototype */ {

  handleNodes: [],
  listOfTreeNode: {},
  nodeById:{},

  // TODO: Add your own code here.
  render: function(context, firstTime) {
    console.log('TreeView render :');
  },
    
  buildTree: function () {
    console.log('TreeView buildTree :');

    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/
    // Every TreeNode is an object with a type: 'text' and a label:
    var div = MvoEdge.getPath('viewsPage.treeView');
    var treeWidget = new YAHOO.widget.TreeView(div.parentView.toString().split(':')[1]);
    var treeNodeRecords = MvoEdge.store.findAll(MvoEdge.Tree);
    
    //create hashtable
    var enumerator = treeNodeRecords.enumerator();
    console.log('TreeView buildTree number of label: '+enumerator._length);
    for(var t=0; t <enumerator._length; t++){
      var obj = enumerator.nextObject();
      this.nodeById[obj.get('guid')] = obj;
    }    
    enumerator.reset();   
    for ( var i = 0; i < enumerator._length; i++){
      var currentNode = enumerator.nextObject();
      if(!this.handleNodes[currentNode]){
        this.addNode(currentNode, treeWidget.getRoot());
      }
    }
                          
    // subscribe to the labelClick event on every tree node
    treeWidget.subscribe('clickEvent', function (node) {
      // when a tree node is selected, update the selection in the controller
      alert('label '+node.node.label);
    });
    console.log('TreeView buildTree treeWidget number of node : '+treeWidget.getNodeCount());
    treeWidget.render();
    treeWidget.expandAll();
  },
    
  addNode: function (node, parentWidgetNode) {
    // add node to the tree
    console.log('TreeView addNode :' + node.get('label') + ' adding to '+ parentWidgetNode.index);
    var currentWidgetNode = new YAHOO.widget.TextNode(
      node.get('label'), parentWidgetNode, false);
      
    // mark node as added
    this.listOfTreeNode[node.get('guid')] = currentWidgetNode;
    this.handleNodes[node] = true;
    // add children
    var nodeChildren = node.get('children');
    if (nodeChildren) {
      for (var idx = 0; idx < nodeChildren.length; idx++) {
        this.addNode(this.nodeById[nodeChildren[idx]], currentWidgetNode);
      }
    }
  },
   
  // update selected node in the tree widget
  selectNode: function () {
    console.log('TreeView selectNode :');
		// TODO
	}.observes('MvoEdge.treeController.treeSelection')

});
