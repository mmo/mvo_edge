// ==========================================================================
// Project:   MvoEdge.layoutController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  This class handles the positioning of the interface components on the screen.

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
  configureWorkspace: function (componentLayoutName) {
    SC.RunLoop.begin();

    // apply the base layout to the main page
    var mainPage = MvoEdge.getPath('mainPage.mainPane');
    var baseLayoutName = MvoEdge.configurator.getPath(
        'componentLayouts.%@.baseLayout'.fmt(componentLayoutName));
    var baseLayoutConfig =
        MvoEdge.configurator.getPath('layouts.%@'.fmt(baseLayoutName));
    var layoutMixin = MvoEdge.getPath(baseLayoutConfig.layoutClass);
    if (SC.none(layoutMixin)) {
      var errMess = 'Unable to find layout mixin %@'.fmt(baseLayoutName);
      throw errMess;
    }
    SC.mixin(mainPage, layoutMixin);
    mainPage.layOutGrid(baseLayoutConfig.layoutParams);

    // lay out the components
    var components = MvoEdge.configurator.getPath(
        'componentLayouts.%@.components'.fmt(componentLayoutName));
    for (var i = 0; i < components.length; i++) {
      var c = components[i];
      mainPage.layOutComponent(c);
    }

    SC.RunLoop.end();
    MvoEdge.logger.info('layoutController workspace initialized');
  }
});
