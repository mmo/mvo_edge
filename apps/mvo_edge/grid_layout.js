/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  Manages the interface layout with a grid-based approach
  
  The screen is split into a grid of evenly distributed rows and columns so that
  the application's interface components can be laid out.


  @author mmo
  @extends SC.Object
  @since 0.0.1
*/

MvoEdge.gridLayout = SC.Object.create(
/** @scope MvoEdge.gridLayout.prototype */ {

  gridRows: 12,
  gridCols: 12,

  colWidth: 0,
  rowHeight: 0,
  gutter: 10,

  initializeWorkspace: function () {
    var paneWidth = MvoEdge.getPath('mainPage.mainPane').get('frame').width,
        paneHeight = MvoEdge.getPath('mainPage.mainPane').get('frame').height;

    this.colWidth =
        (paneWidth - ((this.gridCols - 1) * this.gutter)) / this.gridCols;
    this.rowHeight =
        (paneHeight - ((this.gridRows - 1) * this.gutter)) / this.gridRows;

    this.layoutView({col: 1, row: 1, numCols: 5, numRows: 5},
        'viewsPage.box1View');
    this.layoutView({col: 6, row: 1, numCols: 5, numRows: 5},
        'viewsPage.box2View');
    this.layoutView({col: 11, row: 1, numCols: 1, numRows: 5},
        'viewsPage.box3View');
    this.layoutView({col: 6, row: 6, numCols: 5, numRows: 5},
        'viewsPage.box4View');
  },

  /**
    Lays out a view (interface component) in the grid.

    The position is specified using grid coordinates:
    [column, row, numRolumns, numRows]
    column and row are 0-based
    
    @param coord {Hash} coordinates {col, row, numCols, numRows} where
    col and row are 0-based
    @param viewPath {String} the path leading to the view to be positioned
  */
  layoutView: function (coord, viewPath) {
    var child = MvoEdge.getPath(viewPath);

    var cLeft   = coord.col * this.colWidth + this.gutter * coord.col,
        cTop    = coord.row * this.rowHeight + this.gutter * coord.row,
        cRight  = (this.gridCols - coord.col - coord.numCols) *
            (this.colWidth + this.gutter),
        cBottom = (this.gridRows - coord.row - coord.numRows) *
            (this.rowHeight + this.gutter);

    child.set('layout', {
      left: cLeft,
      top: cTop,
      right: cRight,
      bottom: cBottom
    });

    MvoEdge.getPath('mainPage.mainPane').appendChild(child);
  }

});
