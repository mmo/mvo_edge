// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Model of a tree component. 
  To have more information see the documentation of the SC.TreeController. 

  @author {CHE}      
  @extends {Object}   
  @since {0.1.0} 
*/
MvoEdge.TreeContent = SC.Object.extend({

  treeItemIsExpanded: YES,
    
  label: 'undefined',
    
  guidId: 'undefined',
  
  treeItemChildren: function () {
    var ret = [];
    var oneLab = MvoEdge.store.find(
        SC.Query.create({recordType: MvoEdge.Tree, conditions: "guid = '" + this.guidId + "'"}));
    var oneLabChild = oneLab.firstObject().get('children');  
    if (oneLabChild.get('length') !== 0) {     
      for (var i = 0; i < oneLabChild.get('length'); i++) {
        var oneChild = MvoEdge.store.find(
            SC.Query.create(
              {recordType: MvoEdge.Tree, conditions: "guid = '" + oneLabChild.objectAt(i).get('guid') + "'"}));
        var tp = null;
        if (oneChild.firstObject().get('children').get('length') !== 0) {
          tp = MvoEdge.TreeContent.create(
            {label: oneChild.firstObject().get('label'), guidId: oneChild.firstObject().get('guid'), treeItemIsExpanded: YES}); 
        }
        else {
          tp = MvoEdge.TreeContent.create(
            {label: oneChild.firstObject().get('label'), guidId: oneChild.firstObject().get('guid'), treeItemIsExpanded: NO});
        }
        MvoEdge.treeController._treeNodeById[tp.get('guidId')] = tp;
        ret.push(tp);
      }
    }
    return ret;
  }.property().cacheable()
  
});