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
MvoEdge.layoutManager = SC.Object.create(
/** @scope MvoEdge.layoutManager.prototype */ {

  gridCells: {
    '00': null, '01': null, '02': null, '03': null,
    '10': null, '11': null, '12': null, '13': null,
    '20': null, '21': null, '22': null, '23': null,
    '30': null, '31': null, '32': null, '33': null
  },

  layoutGrid: function (targetView,
      leftStripWidth, rightStripWidth, headerHeight, footerHeight,
      xCenter, yCenter) {
    this.targetView      = targetView;
    this.leftStripWidth  = leftStripWidth;
    this.rightStripWidth = rightStripWidth;
    this.headerHeight    = headerHeight;
    this.footerHeight    = footerHeight;
    this.xCenter         = xCenter;
    this.yCenter         = yCenter;
  },

  layoutComponent: function (component, xCoord, xLen, yCoord, yLen) {
    // parameter checking
    if (xCoord < 0 || xCoord > 3 || xLen <= 0 || xCoord + xLen > 4 ||
        yCoord < 0 || yCoord > 3 || yLen <= 0 || yCoord + yLen > 4) {
      var errMess = "Coordinates are invalid";
      console.error(errMess);
      throw errMess; 
    }
    
    var newLayout = {};
    // 
    switch (xCoord) {
    case 0: newLayout.left = 0; break;
    case 1: newLayout.left = this.leftStripWidth + 1; break;
    case 2: newLayout.left = this.xCenter; break;
    case 3: newLayout.right = this.rightStripWidth; break;
    }
    switch (xCoord + xLen) {
    case 1: newLayout.width = 100; break;
    case 2: newLayout.right = '50%'; break;
    case 3: newLayout.right = 100; break;
    case 4: newLayout.right = 0; break;
    }
    switch (yCoord) {
    case 0: newLayout.top = 0; break;
    case 1: newLayout.top = this.headerHeight + 1; break;
    case 2: newLayout.top = this.yCenter; break;
    case 3: newLayout.bottom = this.footerHeight; break;
    }
    switch (yCoord + yLen) {
    case 1: newLayout.height = 100; break;
    case 2: newLayout.bottom = '50%'; break;
    case 3: newLayout.bottom = 100; break;
    case 4: newLayout.bottom = 0; break;
    }
    
    component.set('layout', newLayout);
    this.targetView.appendChild(component);
  }

});
