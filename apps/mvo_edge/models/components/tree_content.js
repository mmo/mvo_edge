/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
/*globals MvoEdge */

/**
  @mixin

  Model of a tree component.
  A treeController controls objects that implement 
  the treeItemChildren property. This property returns the current array
  of child tree items.
   
  To have more information see the documentation of the SC.TreeController, 
  SC.TreeItemContent and the demo outline. 

  @author {CHE}      
  @extends {Object}   
  @since {0.1.0} 
*/

MvoEdge.TreeContent = {
  
  /**
  @property {Boolean}
  
  */
  treeItemIsExpanded: undefined,
  
  /**
  @property {Number}
  
  The size of the label
  
  */
  labelWidth: undefined,

  /**
    @method 
     
    Return the list of the children of this MvoEdge.Tree as TreeContent
  */
  treeItemChildren: function () {
    var ret = [];
    var children = this.get('children');
    this.labelWidth = this.get('label').length;
    if (children.get('length') > 0) {
      this.treeItemIsExpanded = YES;
    }
    else {
      this.treeItemIsExpanded = NO;
    } 
    
    for (var i = 0; i < children.get('length'); i++) {
      var oneChild = MvoEdge.store.find(
          MvoEdge.Tree, children.objectAt(i).get('guid'));
      var newTreeContent = SC.mixin(oneChild, MvoEdge.TreeContent);
      MvoEdge.treeController._treeNodeById[newTreeContent.get('guid')] = 
          newTreeContent;
      ret.push(newTreeContent);
    }
    
    if (ret.length === 0) ret = null;
    return ret;
  }.property().cacheable() 

};