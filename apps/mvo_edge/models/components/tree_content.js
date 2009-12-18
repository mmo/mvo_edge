// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Model of a tree component. 
  To have more information see the documentation of the SC.TreeController
  and the demo outline. 

  @author {CHE}      
  @extends {Object}   
  @since {0.1.0} 
*/
MvoEdge.TreeContent = SC.Object.extend({

  treeItemIsExpanded: YES,
    
  label: undefined,
    
  treeNodeId: undefined,
  
  /**
    @method 
    
    Return the list of the children of this TreeItem
  */
  treeItemChildren: function () {
    var ret = [];
    var oneLabel = MvoEdge.store.find(MvoEdge.Tree, this.treeNodeId);
    var oneLabelChildren = oneLabel.get('children');  
    
    if (oneLabelChildren.get('length') !== 0) {
      //for each children create a new TreeContent     
      for (var i = 0; i < oneLabelChildren.get('length'); i++) {
        var oneChildLabel = MvoEdge.store.find(
          MvoEdge.Tree, oneLabelChildren.objectAt(i).get('guid'));
        var newTreeContent;
        // child with children => continue to explore the Tree 
        //=> treeItemIsExpanded = YES 
        if (oneChildLabel.get('children').get('length') !== 0) {
          newTreeContent = MvoEdge.TreeContent.create(
            {label: oneChildLabel.get('label'),
            treeNodeId: oneChildLabel.get('guid'),
            treeItemIsExpanded: YES}); 
        }
        //child with no children
        else {
          newTreeContent = MvoEdge.TreeContent.create(
            {label: oneChildLabel.get('label'), 
            treeNodeId: oneChildLabel.get('guid'), 
            treeItemIsExpanded: NO});
        }
        MvoEdge.treeController._treeNodeById[newTreeContent.get('treeNodeId')] =
         newTreeContent;
        ret.push(newTreeContent);
      }
    }
    return ret;
  }.property().cacheable()
  
});