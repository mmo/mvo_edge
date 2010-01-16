// ==========================================================================
// Project:   MvoEdge - mainPage
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

// This page describes the main user interface for your application.
/**
  The initial view defines a layout with different regions
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
*/

MvoEdge.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    //childViews: 'headerView middleView footerView'.w(),

    /**
      HEADER
    */
    // headerView: SC.View.design(SC.Border, {
    //   layout: { top: 10, left: 20, right: 20, height: 60 },
    //   borderStyle: SC.BORDER_GRAY
    // }),

    // middleView: SC.View.design({
    //   hasHorizontalScroller: NO,
    //   layout: { top: 71, bottom: 61, left: 20, right: 20 },
    //   childViews: 'leftView centralView rightView'.w(),
  
      /**
        LEFT
      */
      // leftView: SC.View.design(SC.Border, {
      //   layout: { top: 10, bottom: 10, left: 0, width: 100 },
      //   borderStyle: SC.BORDER_GRAY
      // }),

      /**
        CENTRAL
      */
      // centralView: SC.View.design(SC.Border, {
      //   layout: { top: 10, bottom: 10, left: 110, right: 170 },
      //   borderStyle: SC.BORDER_GRAY
      // }),

      /**
        RIGHT
      */
      // rightView: SC.View.design(SC.Border, {
      //   layout: { top: 10, bottom: 10, right: 0, width: 160 },
      //   borderStyle: SC.BORDER_GRAY
      // })
    //}),

    /**
      FOOTER
    */
    // footerView: SC.View.design(SC.Border, {
    //   layout: { bottom: 10, left: 20, right: 20, height: 50 },
    //   borderStyle: SC.BORDER_GRAY
    // })
  }).classNames('workspace')

});
