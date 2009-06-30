// ==========================================================================
// Project:   MvoEdge.tree
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
MvoEdge.treeController = SC.ArrayController.create(
/** @scope MvoEdge.treeController.prototype */ {

  treeSelection: undefined,
  // TODO: Add your own code here.
  selectedTree: function(){
    alert('label ');
  }.property('treeSelection'),

  masterObjectSelectionDidChange: function() {
  }.observes('MvoEdge.masterController.selectedObjectId')

}) ;
