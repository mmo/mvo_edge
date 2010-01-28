/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  View that contains a custom thumbnail. A thumbnailContentView is composed of 
  an imageView and a labelView.
  
  For more explanation see:  
  http://frozencanuck.wordpress.com/2009/09/06/creating-a-simple-custom-list-item-view-part-1/

  @author {CHE}     
  @extends {View}  
  @since {0.1.0}    
*/
MvoEdge.ThumbnailContentView = SC.View.extend(SC.ContentDisplay, {

  classNames: ['custom-thumbnail-item-view'],
    
  displayProperties: 'isSelected'.w(),
  
  /**
    @method
    
    Override render method to add 'isSelected' property 
  */  
  render: function (context, firstTime) {
    var isSelected = this.get('isSelected');
    var labelView = this.get('childViews')[1];
    
    if (isSelected) {
      labelView.set('isSelected', YES);
    }
    else {
      labelView.set('isSelected', NO); 
    }
    
    sc_super();
  },

  /**
    @method
    
    Overwrite createChildViews to set up the internal child view 
  */
  createChildViews: function () {
    var childViews = [];
    var view;
    //Add ImageView
    view = this.createChildView(
      SC.View.design({
        layout:  { top: 4, height: 90, centerX: 0, width: 90 },
        classNames: 'mvo_transparent'.w(),
        childViews: [
          SC.ImageView.design({
            useImageCache: NO,
            classNames: 'centered-image',
            contentBinding: '.parentView.parentView.content',
            contentValueKey: 'url'
          })
        ]
      }),
      { rootElementPath: [0] }
    );
    childViews.push(view);
    //Add LabelView
    view = this.createChildView(
      MvoEdge.LabelView.design({
        layout:  { bottom: 4, height: 18, centerX: 0, width: 46 },
        textAlign: SC.ALIGN_CENTER,
        contentBinding: '.parentView.content',
        contentValueKey: 'pageNumber'
      }),
      { rootElementPath: [1] }
    );
    childViews.push(view);
 
    this.set('childViews', childViews); 
  }

});
/**
  @class

  Custom label view
  
  this class contains only the render method

  @author {CHE}     
  @extends {LabelView}  
  @since {0.1.0}    
*/
MvoEdge.LabelView = SC.LabelView.extend({
  
  /**
    @method
    
    Override render method to add 'isSelected' property 
  */
  render: function (context, firstTime) {
    var isSelected = this.get('isSelected');
    var standard = !isSelected;
    var selected = isSelected;
    var classes = { 'standard': standard, 'selected': selected };

    context.setClass(classes); 

    sc_super();
  }
  
});