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
        coordinates: [xCoord, yCoord, xLen, yLen]
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

    @param {Integer} leftStripWidth
    @param {Integer} rightStripWidth
    @param {Integer} headerHeight
    @param {Integer} footerHeight
    @param {Integer} marginTop
    @param {Integer} marginRight
    @param {Integer} marginBottom
    @param {Integer} marginLeft
  */
  layOutGrid: function (
      leftStripWidth, rightStripWidth, headerHeight, footerHeight,
      marginTop, marginRight, marginBottom, marginLeft) {
    this._leftStripWidth  = leftStripWidth;
    this._rightStripWidth = rightStripWidth;
    this._headerHeight    = headerHeight;
    this._footerHeight    = footerHeight;
    this._marginTop       = marginTop;
    this._marginRight     = marginRight;
    this._marginBottom    = marginBottom;
    this._marginLeft      = marginLeft;

    this._resetLayout();
  },

  /**
    @method

    Lay out a component on this view's grid

    @param {Object}  component
    @param {Integer} xCoord x coordinate on grid
    @param {Integer} yCoord y coordinate on grid
    @param {Integer} xLen   x length on grid
    @param {Integer} yLen   y length on grid
  */
  layOutComponent: function (component, xCoord, yCoord, xLen, yLen) {
    var errMess = "";
    // parameter checking
    if (xCoord < 0 || xCoord > 2 || xLen <= 0 || xCoord + xLen > 3 ||
        yCoord < 0 || yCoord > 2 || yLen <= 0 || yCoord + yLen > 3) {
      errMess = "Coordinates are invalid: (%@, %@, %@, %@)".fmt(
          xCoord, yCoord, xLen, yLen);
      console.error(errMess);
      throw errMess; 
    }

    // check if component is already laid out
    /*
    if (this._componentsOnGrid[component]) {
      errMess = "Cannot lay out an already laid out component: %@".fmt(
          component);
      console.error(errMess);
      throw errMess; 
    }
    */
    
    var newLayout = {};
    // 
    switch (xCoord) {
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
    switch (xCoord + xLen) {
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
    switch (yCoord) {
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
    switch (yCoord + yLen) {
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
    for (var x = xCoord; x < xCoord + xLen; x++) {
      for (var y = yCoord; y < yCoord + yLen; y++) {
        // if cell was previously occupied by another component...
        var componentInCell = this._gridCells[x][y];        
        if (componentInCell !== null) {
          // ... remove it from this view
          this.removeComponent(componentInCell);
        }
        // occupy this cell with this component
        this._gridCells[x][y] = component;
        // update component's registry
        if (SC.none(this._componentsOnGrid[component])) {
          this._componentsOnGrid[component] = {
            'coordinates': [xCoord, yCoord, xLen, yLen],
            'coveredCells': []
          };
        }
        this._componentsOnGrid[component].coveredCells.push([x, y]);
      }
    }
    
    // append the component to this view with the defined layout
    component.set('layout', newLayout);
    this.appendChild(component);
    component.set('isVisibleInWindow', YES);
  },

  /**
    @method

    Remove a component from the view

    @param {Object} component
  */
  removeComponent: function (component) {
    // remove its reference from the cell occupancy matrix
    var componentCells = this._componentsOnGrid[component] || [];
    for (var c = 0; c < componentCells.length; c++) {
      if (SC.typeOf(componentCells[c]) === SC.T_ARRAY &&
          componentCells[c].length === 2) {
        var x = componentCells[c][0],
            y = componentCells[c][1];
        if (this._gridCells[x][y] === component) this._gridCells[x][y] = null;
      }
    }
    // delete its reference from the registered components list
    if (!SC.empty(this._componentsOnGrid[component])) {
      // delete it from the component registry
      delete this._componentsOnGrid[component];
      // make the component invisible
      if (component.get('isVisibleInWindow')) {
        component.set('isVisibleInWindow', NO);
      }
      // remove it from this view
      this.removeChild(component);
    }
  },
  
  _resetLayout: function () {
    // remove all current components from the view
    for (var component in this._componentsOnGrid) {
      if (this._componentsOnGrid.hasOwnProperty(component)) {
        if (component.get('isVisibleInWindow')) {
          component.set('isVisibleInWindow', NO);
        }
        // remove it from this view
        this.removeChild(component);
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
