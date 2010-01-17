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
  components on the view's canvas. The view is split into a grid of rows and
  columns so that components can be laid out according to grid-based
  coordinates.

  @author mmo
  @extends SC.Object
  @since 0.0.1
*/
MvoEdge.GridLayout4x4 = {

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
    @property {Array}

    Registered components

    @private
    @default []
  */
  _componentsOnGrid: {},

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
  _xCenter         : 0,
  /** @property {Integer} */
  _yCenter         : 0,

  /**
    @method

    Initilize grid

    @param {Integer} leftStripWidth
    @param {Integer} rightStripWidth
    @param {Integer} headerHeight
    @param {Integer} footerHeight
    @param {Integer} xCenter
    @param {Integer} yCenter
  */
  layOutGrid: function (
      leftStripWidth, rightStripWidth, headerHeight, footerHeight,
      xCenter, yCenter) {
    this._leftStripWidth  = leftStripWidth;
    this._rightStripWidth = rightStripWidth;
    this._headerHeight    = headerHeight;
    this._footerHeight    = footerHeight;
    this._xCenter         = xCenter;
    this._yCenter         = yCenter;

    this._gridCells = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
      ];
  },

  /**
    @method

    Lay out a component on this view's grid

    @param {Object}  component
    @param {Integer} xCoord x coordinate on grid
    @param {Integer} xLen   x length on grid
    @param {Integer} yCoord y coordinate on grid
    @param {Integer} yLen   y length on grid
  */
  layOutComponent: function (component, xCoord, xLen, yCoord, yLen) {
    var errMess = "";
    // parameter checking
    if (xCoord < 0 || xCoord > 3 || xLen <= 0 || xCoord + xLen > 4 ||
        yCoord < 0 || yCoord > 3 || yLen <= 0 || yCoord + yLen > 4) {
      errMess = "Coordinates are invalid: (%@, %@, %@, %@)".fmt(
          xCoord, xLen, yCoord, yLen);
      console.error(errMess);
      throw {message: errMess};
    }

    // check if component is already laid out
    if (this._componentsOnGrid[component]) {
      errMess = "Cannot lay out an already laid out component: %@".fmt(
          component);
      console.error(errMess);
      throw {message: errMess};
    }
    
    var newLayout = {};
    // 
    switch (xCoord) {
    case 0:
      newLayout.left = 0;
      break;
    case 1:
      newLayout.left = this._leftStripWidth + 1;
      break;
    case 2: 
      newLayout.left = this._xCenter;
      break;
    case 3: 
      newLayout.right = this._rightStripWidth;
      break;
    }
    switch (xCoord + xLen) {
    case 1:
      newLayout.width = 100;
      break;
    case 2:
      newLayout.right = '50%';
      break;
    case 3:
      newLayout.right = 100;
      break;
    case 4:
      newLayout.right = 0;
      break;
    }
    switch (yCoord) {
    case 0:
      newLayout.top = 0;
      break;
    case 1:
      newLayout.top = this._headerHeight + 1;
      break;
    case 2:
      newLayout.top = this._yCenter;
      break;
    case 3:
      newLayout.bottom = this._footerHeight;
      break;
    }
    switch (yCoord + yLen) {
    case 1:
      newLayout.height = 100;
      break;
    case 2:
      newLayout.bottom = '50%';
      break;
    case 3:
      newLayout.bottom = 100;
      break;
    case 4:
      newLayout.bottom = 0;
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
          this._componentsOnGrid[component] = [];
        }
        this._componentsOnGrid[component].push([x, y]);
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
    delete this._componentsOnGrid[component];
    // make the component invisible
    if (component.get('isVisibleInWindow')) {
      component.set('isVisibleInWindow', NO);
    }
    // remove it from this view
    this.removeChild(component);    
  }

};
