// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  View that contains the tree

  @author {CHE}     
  @extends {ListView}  
  @since {0.1.0}    
*/
MvoEdge.TreeView = SC.ListView.extend(
/** @scope MvoEdge.TreeView.prototype */ {
  
  /**
    @property
    
    _childViewsDidChange is called every time the user 
    expand or collapse a branch of the tree. 
    IsFirstTime ensures we adjust the view only one time.
  */
  isFirstTime: YES,

  /**
    @method
  
    Update the treeView width.
    The new width is the width of the largest label.

    @observes childViews
  */
  _childViewsDidChange: function () {
    var childViews = this.get('childViews');
    if (childViews.get('length') > 0 & this.isFirstTime) {
      var maxWidth = 0;
      for (var i = 0; i < childViews.get('length'); i++) {
        var labelView = childViews[i];
        var labelWidth = labelView.content.get('labelWidth');
        //maxLabelWidth depends on the labelWidth, the outline and the position
        //of the label in the Tree (outlineLevel)
        var maxLabelWidth = (labelWidth * 6.5) + 
            (labelView.get('outlineIndent') * 
            (labelView.get('outlineLevel') + 1));
        
        if (maxLabelWidth > maxWidth) {            
          maxWidth = maxLabelWidth;
        }  
      }
      //update the View with the maxWidth
      this.adjust('width', maxWidth);
      this.isFirstTime = NO;
    }
  }.observes('childViews')

});