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
    console.log('treeController selectedTree :');
  }.property('treeSelection'),

  masterObjectSelectionDidChange: function() {
    console.log('treeController masterObjectSelectionDidChange :');
  }.observes('MvoEdge.masterController.selectedObjectId')

}) ;
