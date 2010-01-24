// ==========================================================================
// Project:   MvoEdge - mainPage
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

// This page describes the main user interface for your application.

MvoEdge.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    //childViews: 'headerView middleView footerView'.w(),
    // child view are defined in views.js
  }).classNames('workspace_black')

});
