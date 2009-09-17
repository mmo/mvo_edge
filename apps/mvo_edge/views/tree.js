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
    @property {String}
   */
  treeSelectionBinding: "MvoEdge.treeController.treeSelection",

  handleNodes: [],
  listOfTreeNode: {},
  nodeById: {},
  
  render: function (context) {
    context.push("<div id='treeContainer'></div>");
  },
  
  /**
    Create the TreeView using YAHOO tree widget.
    
    This method is launched automatically when the view's layer is ready and
    integrated in the DOM
  */
  buildTree: function () {
    // Tree widget implemented with YUI TreeView
    // See http://developer.yahoo.com/yui/treeview/
    var treeWidget = new YAHOO.widget.TreeView('treeContainer');

    var treeNodeRecords =
        MvoEdge.store.findAll(MvoEdge.Tree).sortProperty('guid');
    for (var i = 0; i < treeNodeRecords.length; i++) {
      var node = treeNodeRecords[i];
      this.nodeById[node.get('guid')] = node;
    }

/*
    for (i = 0; i < treeNodeRecords.length; i++) {
      node = treeNodeRecords[i];
      if (!this.handleNodes[node]) {
        this._addNode(node, treeWidget.getRoot());
      }
    }
*/
    this._addNode(treeNodeRecords[0], treeWidget.getRoot());


    // subscribe to the clickEvent event on every tree node
    treeWidget.subscribe('clickEvent', function (node) {
      SC.RunLoop.begin();
      // when a tree node is selected, update the selection in the controller
      var tn = node.node.data.treeNode;
      node.node.data.topTreeView._changeTreeSelection(tn);
      SC.RunLoop.end();
    });
    treeWidget.render();
    treeWidget.expandAll();
  },
  
  /**
    Add a node to his parent
    
    @private
    @param {Object} node the TreeNode
    @param {YAHOO.widget.Node} parentWidgetNode the TreeNode's parent node
  */
  _addNode: function (node, parentWidgetNode) {
    // Build TextNode with the label and the treeNode
    // Note: the 'topTreeView' must be included in 'obj' so that the function
    // that will be attached to the 'clickEvent' knows how to call this view
    // object, to notify it of a change in the selection
    var obj = {label: node.get('label'), treeNode: node, topTreeView: this};
    var currentWidgetNode =
        new YAHOO.widget.TextNode(obj, parentWidgetNode, false);

    // mark node as added
    this.listOfTreeNode[node.get('guid')] = currentWidgetNode;
    this.handleNodes[node] = true;
    // add children of the node
    var nodeChildren = node.get('children');
    if (nodeChildren) {
      for (var i = 0; i < nodeChildren.length(); i++) {
        this._addNode(this.nodeById[nodeChildren.objectAt(i).get('guid')],
            currentWidgetNode);
      }
    }
  },
  
  /**
    Event 'clickEvent' need to update the treeSelection
    
    Note: Need to call 'set('treeSelection')' into an outer
    function to notify the change. 
    
    @private
    @param {YAHOO:widget.Node} selected treeNode
    */
  _changeTreeSelection: function (treeNode) {
    SC.RunLoop.begin();
    this.set('treeSelection', treeNode.get('guid'));
    SC.RunLoop.end();
  },
   
  /**
    Update selected node in the tree widget.
  
    @observes treeSelection
  */
  _treeSelectionDidChange: function () {
    var treeSelection = this.get('treeSelection');
    if (!SC.none(treeSelection)) {
      var nodeToFocus = this.listOfTreeNode[treeSelection];
      if (nodeToFocus) {
        nodeToFocus.focus();
      }
    }
  }.observes('treeSelection')

});