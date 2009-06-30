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
  
  nodeById:{},

  // TODO: Add your own code here.
  render: function(context, firstTime) {
    //alert(context.get('id'));
    this.buildTree();
  },
    
  buildTree: function () {
    alert('construisons arbre');
    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/
    // Every TreeNode is an object with a type: 'text' and a label:
    var div = MvoEdge.getPath('viewsPage.treeView');
    var treeWidget = new YAHOO.widget.TreeView(div.parentView._view_layer.id);
    var treeNodeRecords = MvoEdge.Tree.FIXTURES;
    
    //create hashtable
    for (var idx = 0; idx < treeNodeRecords.length; idx++) { 
      this.nodeById[treeNodeRecords[idx].guid] = treeNodeRecords[idx];
    }
       
    //alert('treeNode '+treeNodeRecords.length);
    for (var idx = 0; idx < treeNodeRecords.length; idx++) {
      var currentNode = treeNodeRecords[idx];
      if(!this.handleNodes[currentNode]){
        this.addNode(currentNode, treeWidget.getRoot());
      }
    }
    

    // subscribe to the labelClick event on every tree node
    treeWidget.subscribe('labelClick', function (node) {
      // when a tree node is selected, update the selection in the controller
      alert('label '+node.data.coreDocumentNode);
      MvoEdge.treeController.set('treeSelection', node.data.coreDocumentNode);
    });
    
    treeWidget.subscribe('collapse', function(node){
      alert('collapse node '+ node.data.label);
    });
    
    treeWidget.draw();
    treeWidget.getNodeByIndex(4).focus();
  },
    
  addNode: function (node, parentWidgetNode) {
    // add node to the tree
    var currentWidgetNode = new YAHOO.widget.TextNode(
      {
        label: node.label,
        coreDocumentNode: node.coreDocumentNode,
        expanded: true
      },
        parentWidgetNode);
    // mark node as added
    this.handleNodes[node] = true;
    // add children
    var nodeChildren = node.children;
    if (nodeChildren) {
      for (var idx = 0; idx < nodeChildren.length; idx++) {
        this.addNode(this.nodeById[nodeChildren[idx]], currentWidgetNode);
      }
    }
  },
    
});
