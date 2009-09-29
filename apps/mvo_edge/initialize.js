// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
/**
  @class

  Object that initializes components. 

  @author {CHE}      
  @extends {Object}   
  @since {0.1.0} 
*/

MvoEdge.initialize = SC.Object.create( 
/** @scope MvoEdge.initialize.prototype */ {

  /**
    @method

    Initialize controllers, view and layout
  */
  initializeComponent: function () { 
    MvoEdge.getPath('mainPage.mainPane').append();
    var nodes = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
    MvoEdge.masterController.initialize(nodes);
    MvoEdge.thumbnailController.initialize(nodes);
    MvoEdge.treeController.initialize(nodes);
    MvoEdge.layoutController.initializeWorkspace();
  }

});