// ==========================================================================
// Project:   MvoEdge.layoutController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
//require('layout_definition');

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
    SC.RunLoop.begin();
    this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.metadataView');
    this.layoutView(MvoEdge.LAYOUT_LEFT, 'viewsPage.thumbnailView');
    this.layoutView(MvoEdge.LAYOUT_CENTRAL, 'viewsPage.mainContentView');
    this.layoutView(MvoEdge.LAYOUT_RIGHT, 'viewsPage.treeView');
    this.layoutView(MvoEdge.LAYOUT_FOOTER, 'viewsPage.navigationView');
    SC.RunLoop.end();
    MvoEdge.logger.info('layoutController workspace initialized');
  },
  


  initializeWorkspaceWithGrid: function () {
    //this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.titleView');
    SC.RunLoop.begin();
    this.applyLayout(this.pageBasedLayout);
    SC.RunLoop.end();
    MvoEdge.logger.info('layoutController workspace initialized');
    
    /*
    SC.RunLoop.begin();
    mainPage.layOutComponent(
        MvoEdge.getPath('viewsPage.mainContentView'), 0, 0, 3, 3);
    SC.RunLoop.end();
    */
  },

  applyLayout: function (layout) {
    // apply the base layout to the main page
    var mainPage = MvoEdge.getPath('mainPage.mainPane');
    var layoutMixin = MvoEdge.getPath(layout.baseLayoutName);
    if (SC.none(layoutMixin)) {
      var errMess =
        'Unable to find layout mixin %@'.fmt(layout.baseLayoutName);
      throw errMess;
    }
    SC.mixin(mainPage, layoutMixin);
    mainPage.layOutGrid(
        layout.baseLayoutParams.leftStripWidth,
        layout.baseLayoutParams.rightStripWidth,
        layout.baseLayoutParams.headerHeight,
        layout.baseLayoutParams.footerHeight,
        layout.baseLayoutParams.marginTop,
        layout.baseLayoutParams.marginRight,
        layout.baseLayoutParams.marginBottom, 
        layout.baseLayoutParams.marginLeft
    );

    // lay out the components
    for (var i = 0; i < layout.components.length; i++) {
      var c = layout.components[i];
      mainPage.layOutComponent(MvoEdge.getPath(c[0]), c[1], c[2], c[3], c[4]);
    }
  },

  pageBasedLayout: MvoEdge.LayoutDefinition.create({
    baseLayoutName: 'GridLayout3x3',
    baseLayoutParams: {
      'leftStripWidth':  400,
      'rightStripWidth': 120,
      'headerHeight':     80,
      'footerHeight':     80,
      'marginTop':         5,
      'marginRight':       5,
      'marginBottom':      5,
      'marginLeft':        5
    },
    components: [
      ['views.metadataView',    0, 0, 3, 1],
      ['views.treeView',        0, 1, 1, 1],
      ['views.mainContentView', 1, 1, 1, 1],
      ['views.thumbnailView',   2, 1, 1, 1],
      ['views.navigationView',  0, 2, 3, 1]
    ]
  }),

  contentFullScreenLayout: MvoEdge.LayoutDefinition.create({
    baseLayoutName: 'GridLayout3x3',
    baseLayoutParams: {
      'leftStripWidth':  0,
      'rightStripWidth': 0,
      'headerHeight':    0,
      'footerHeight':    0,
      'marginTop':       5,
      'marginRight':     5,
      'marginBottom':    5,
      'marginLeft':      5
    },
    components: [
      ['views.mainContentView', 0, 0, 3, 3]
    ]
  }),

  
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
    this.layoutView(MvoEdge.LAYOUT_FOOTER, 'viewsPage.navigationView');
    SC.RunLoop.end();
    MvoEdge.logger.info('layoutController HTMLworkspace initialized');
  },

  /**
    Sets up the views for the PDFRenderer pages in the workspace.

    This setup cannot be done in this object's init() function because when
    this object is created, the other views have not yet been initialized, so
    they cannot yet be referenced.

    This function must therefore be explicitly called from the main() function
    during application setup.
    
    @see MvoEdge.main
  */
  initializePDFRendererWorkspace: function () {
    //this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.titleView');
    SC.RunLoop.begin();
    this.layoutView(MvoEdge.LAYOUT_HEADER, 'viewsPage.metadataView');
    this.layoutView(MvoEdge.LAYOUT_LEFT, 'viewsPage.htmlThumbnailView');
    this.layoutView(MvoEdge.LAYOUT_CENTRAL, 'viewsPage.pdfRendererMainContentView');
    this.layoutView(MvoEdge.LAYOUT_RIGHT, 'viewsPage.treeView');
    this.layoutView(MvoEdge.LAYOUT_FOOTER, 'viewsPage.navigationView');
    SC.RunLoop.end();
    MvoEdge.logger.info('layoutController PDFworkspace initialized');
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
