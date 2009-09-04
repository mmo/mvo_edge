// ==========================================================================
// Project:   MvoEdge.layoutController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

MvoEdge.LAYOUT_HEADER  = 'headerView';
MvoEdge.LAYOUT_LEFT    = 'middleView.leftView';
MvoEdge.LAYOUT_CENTRAL = 'middleView.centralView';
MvoEdge.LAYOUT_RIGHT   = 'middleView.rightView';
MvoEdge.LAYOUT_FOOTER  = 'footerView';

/** @class

  This class handles the positioning of the interface components on the screen.

  It uses the regions defined in MvoEdge.mainPage:
  header/left/central/right/footer and attaches available widgets (components)
  to each region.

  +-----------------------------------+
  | HEADER                            |
  +-----------------------------------+
  | LEFT   | CENTRAL         | RIGHT  |
  |        |                 |        |
  |        |                 |        |
  |        |                 |        |
  |        |                 |        |
  +-----------------------------------+
  | FOOTER                            |
  +-----------------------------------+

  @extends SC.Object
  @see MvoEdge.mainPage
*/

MvoEdge.layoutController = SC.Object.create(
/** @scope MvoEdge.layoutController.prototype */ {

  /**
    Sets up the views in the workspace.

    This setup cannot be done in this object's init() function because when
    this object is created, the other views have not yet been initialized, so
    they cannot yet be referenced.

    This function must therefore be explicitly called from the main() function
    during application setup.
    
    @see MvoEdge.main
  */
  initializeWorkspace: function () {
    //this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.titleView');
    this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.metadataView');
    this.layoutView(MvoEdge.LAYOUT_LEFT, 'viewsPage.thumbnailView');
    this.layoutView(MvoEdge.LAYOUT_CENTRAL, 'viewsPage.mainContentView');
    this.layoutView(MvoEdge.LAYOUT_RIGHT, 'viewsPage.treeView');
    MvoEdge.getPath('viewsPage.treeView.contentView').buildTree();
  },
  
  
  /**
    Sets up the views for the HTML pages in the workspace.

    This setup cannot be done in this object's init() function because when
    this object is created, the other views have not yet been initialized, so
    they cannot yet be referenced.

    This function must therefore be explicitly called from the main() function
    during application setup.
    
    @see MvoEdge.main
  */
  initializeHTMLWorkspace: function () {
    //this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.titleView');
    SC.RunLoop.begin();
    this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.metadataView');
    this.layoutView(MvoEdge.LAYOUT_LEFT, 'viewsPage.htmlThumbnailView');
    this.layoutView(MvoEdge.LAYOUT_CENTRAL, 'viewsPage.htmlMainContentView');
    this.layoutView(MvoEdge.LAYOUT_RIGHT, 'viewsPage.treeView');
    SC.RunLoop.end();
    MvoEdge.getPath('viewsPage.treeView.contentView').buildTree();
  },

  /**
    This method lays out a view in one of the defined screen regions.
    
    The regions are named using constants, as follows:

    * MvoEdge.LAYOUT_HEADER
    * MvoEdge.LAYOUT_LEFT
    * MvoEdge.LAYOUT_CENTRAL
    * MvoEdge.LAYOUT_RIGHT
    * MvoEdge.LAYOUT_FOOTER
    
    @param location {String} must correspond to one of the defined region constants
    @param viewPath {String} the path leading to the view to be positioned
  */
  layoutView: function (location, viewPath) {
    MvoEdge.getPath('mainPage.mainPane.' + location)
      .appendChild(MvoEdge.getPath(viewPath));
  }

});