/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @mixin

  Adds support for grid-based interface layout.

  It can be applied to a view in order to manage the layout of child
  components on the view's canvas. The view is split into a grid of 3 rows
  and 3 columns so that components can be laid out according to grid-based
  coordinates.

  +-----+---------------+-----+
  |     |               |     | fixed height
  +-----+---------------+-----+
  |     |               |     |
  |     |               |     | elastic height
  |     |               |     |
  +-----+---------------+-----+
  |     |               |     | fixed height
  +----------------------------
   fixed    elastic      fixed
   width     width       width

  The top and bottom rows have fixed height, the leftmost and rightmost
  columns have fixed width, whereas the central row and column are elastic in
  order to fit the canvas.

  @author mmo
  @extends SC.Object
  @since 0.1.0
*/
MvoEdge.GridLayout3x3 = {

  /**
    @property {Array}

    Grid cell occupancy matrix
    
    Each position of this 2D array, if not null, points to a component in the
    componentsOnGrid table, and indicates that the cell is occupied by that
    component.

    @private
    @default []
  */
  _gridCells: [],

  /**
    @property {Hash}

    Registered components
    
    Each entry is composed as follows
      Key:  component {Object}
      Value: [coordinates {Array}, coveredCells {Array}]
        coordinates: [x, y, xlen, ylen]
        coveredCells: [[x, y], [x, y], [x, y] ... ]

        { {Object}:
          { 'coordinates': [x, y, w, h],
            'coveredCells': [
              [x, y],
              [x, y],
              ...
            ]
          }
        }
            

    @private
    @default []
  */
  _componentsOnGrid: {},

  // TODO document
  _layoutSnapshots: {},

  /**
    Grid dimension properties
  */

  /** @property {Integer} */
  _leftStripWidth  : 0,
  /** @property {Integer} */
  _rightStripWidth : 0,
  /** @property {Integer} */
  _headerHeight    : 0,
  /** @property {Integer} */
  _footerHeight    : 0,
  /** @property {Integer} */
  _margin          : 0,

  /**
    @method

    Initilize grid

    @param {Hash} params layout parameters hash with the following content:
        {Integer} leftStripWidth
        {Integer} rightStripWidth
        {Integer} headerHeight
        {Integer} footerHeight
        {Integer} marginTop
        {Integer} marginRight
        {Integer} marginBottom
        {Integer} marginLeft
  */
  layOutGrid: function (params) {
    // validate input parameters
    var errMess = MvoEdge.checkParams(params, {
        'leftStripWidth':  SC.T_NUMBER,
        'rightStripWidth': SC.T_NUMBER,
        'headerHeight':    SC.T_NUMBER,
        'footerHeight':    SC.T_NUMBER,
        'marginTop':       SC.T_NUMBER,
        'marginRight':     SC.T_NUMBER,
        'marginBottom':    SC.T_NUMBER,
        'marginLeft':      SC.T_NUMBER
      });

    if (errMess.length > 0) {
      throw 'Invalid parameters while laying out a GridLayout3x3: ' + errMess;
    }

    this._leftStripWidth  = params.leftStripWidth;
    this._rightStripWidth = params.rightStripWidth;
    this._headerHeight    = params.headerHeight;
    this._footerHeight    = params.footerHeight;
    this._marginTop       = params.marginTop;
    this._marginRight     = params.marginRight;
    this._marginBottom    = params.marginBottom;
    this._marginLeft      = params.marginLeft;

    this._resetLayout();
  },

  /**
    @method

    Lay out a component on this view's grid

    @param {Hash} params layout parameters hash with the following content:
        {String}  name   component name
        {Integer} x      x coordinate on grid
        {Integer} y      y coordinate on grid
        {Integer} xlen   x length on grid
        {Integer} ylen   y length on grid
  */
  layOutComponent: function (params) {
    // validate input parameters
    var errMess = MvoEdge.checkParams(params, {
        'name': SC.T_STRING,
        'x':    SC.T_NUMBER,
        'y':    SC.T_NUMBER,
        'xlen': SC.T_NUMBER,
        'ylen': SC.T_NUMBER
      });

    if (errMess.length > 0) {
      var m =
          'Invalid parameters while laying out a component ' +
          ' on a GridLayout3x3:' + errMess;
      throw m;
    }

    var componentName   = params.name;
    var componentObject = MvoEdge.getPath(componentName);
    var x =    params.x;
    var y =    params.y;
    var xlen = params.xlen;
    var ylen = params.ylen;

    errMess = '';
    // parameter checking
    if (x < 0 || x > 2 || xlen <= 0 || x + xlen > 3 ||
        y < 0 || y > 2 || ylen <= 0 || y + ylen > 3) {
      errMess = 'Coordinates are invalid: (%@, %@, %@, %@)'.fmt(
          x, y, xlen, ylen);
      console.error(errMess);
      throw errMess; 
    }

    var newLayout = {};

    // define component dimensions
    switch (x) {
    case 0:
      newLayout.left = this._marginLeft;
      break;
    case 1:
      newLayout.left = this._leftStripWidth + this._marginLeft + 1;
      break;
    case 2: 
      newLayout.width =
          this._rightStripWidth - this._marginLeft - this._marginRight;
      break;
    }
    switch (x + xlen) {
    case 1:
      newLayout.width =
          this._leftStripWidth - this._marginLeft - this._marginRight;
      break;
    case 2:
      newLayout.right = this._rightStripWidth + this._marginRight + 1;
      break;
    case 3:
      newLayout.right = this._marginRight;
      break;
    }
    switch (y) {
    case 0:
      newLayout.top = this._marginTop;
      break;
    case 1:
      newLayout.top = this._headerHeight + this._marginTop + 1;
      break;
    case 2:
      newLayout.height =
          this._footerHeight - this._marginTop - this._marginBottom;
      break;
    }
    switch (y + ylen) {
    case 1:
      newLayout.height =
          this._headerHeight - this._marginTop - this._marginBottom;
      break;
    case 2:
      newLayout.bottom = this._footerHeight + this._marginBottom + 1;
      break;
    case 3:
      newLayout.bottom = this._marginBottom;
      break;
    }

    // update cell occupancy registries
    for (var i = x; i < x + xlen; i++) {
      for (var j = y; j < y + ylen; j++) {
        // if cell was previously occupied by another component...
        var componentInCell = this._gridCells[i][j];        
        if (componentInCell !== null) {
          // ... remove it from this view
          this.removeComponent(componentInCell);
        }
        // occupy this cell with this component
        this._gridCells[i][j] = componentName;
        // update component's registry
        if (SC.none(this._componentsOnGrid[componentName])) {
          this._componentsOnGrid[componentName] = {
            'coordinates': [x, y, xlen, ylen],
            'coveredCells': []
          };
        }
        this._componentsOnGrid[componentName].coveredCells.push([x, y]);
      }
    }
    
    // append the component to this view with the defined layout
    componentObject.set('layout', newLayout);
    this.appendChild(componentObject);
    componentObject.set('isVisibleInWindow', YES);
  },

  /**
    @method

    Remove a component from the view

    @param {String} componentName
  */
  removeComponent: function (componentName) {
    // remove its reference from the cell occupancy matrix
    var componentCells = this._componentsOnGrid[componentName] || [];
    for (var c = 0; c < componentCells.length; c++) {
      if (SC.typeOf(componentCells[c]) === SC.T_ARRAY &&
          componentCells[c].length === 2) {
        var x = componentCells[c][0],
            y = componentCells[c][1];
        if (this._gridCells[x][y] === componentCells) {
          this._gridCells[x][y] = null;
        }
      }
    }
    // delete its reference from the registered components list
    if (!SC.empty(this._componentsOnGrid[componentName])) {
      // delete it from the component registry
      delete this._componentsOnGrid[componentName];
      // make the component invisible
      var componentObject = MvoEdge.getPath(componentName);
      if (componentObject.get('isVisibleInWindow')) {
        componentObject.set('isVisibleInWindow', NO);
      }
      // remove it from this view
      this.removeChild(componentObject);
    }
  },
  
  _resetLayout: function () {
    // remove all current components from the view
    for (var componentName in this._componentsOnGrid) {
      if (this._componentsOnGrid.hasOwnProperty(componentName)) {
        var componentObject = MvoEdge.getPath(componentName);
        if (componentObject.get('isVisibleInWindow')) {
          componentObject.set('isVisibleInWindow', NO);
        }
        // remove it from this view
        this.removeChild(componentObject);
      }
    }
    // reset the cell occupancy matrix
    this._gridCells = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
    
  },
  
  saveLayout: function (name) {
    this._layoutSnapshots[name] = SC.copy(this._componentsOnGrid);
  },

  applySavedLayout: function (name) {
    if (!SC.none(this._layoutSnapshots[name])) {
      for (var i = 0; i < this._layoutSnapshots.length; i++) {
        var component = 1;
        var c = [];
        this.layOutComponent(component, c[0], c[1], c[2], c[3]);
      }
    }
  }

};
