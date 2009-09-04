// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
MvoEdge.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.
  
  var type = MvoEdge.get('type');
  
  if (type === 1) {
    MvoEdge.CoreDocumentNode.FIXTURES = MvoEdge.CoreDocumentNode.FIXTURES_HTML;
    MvoEdge.Tree.FIXTURES = MvoEdge.Tree.FIXTURES_HTML;
    MvoEdge.Thumbnail.FIXTURES = MvoEdge.Thumbnail.FIXTURES_HTML;
  }
  
  MvoEdge.getPath('mainPage.mainPane').append();
  
  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!
  // Set the content property on your primary controller
  // ex: .contactsController.set('content',.contacts);
  var nodes = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
  MvoEdge.masterController.set('content', nodes);
  var images = MvoEdge.store.findAll(MvoEdge.Thumbnail);
  MvoEdge.thumbnailController.set('content', images);
  var labels = MvoEdge.store.findAll(MvoEdge.Tree);
  MvoEdge.treeController.set('content', labels);
  
  // Call the layout controller in order to setup the interface components
  if (type === 0) {
    MvoEdge.layoutController.initializeWorkspace();
  } else if (type === 1) {
    MvoEdge.layoutController.initializeHTMLWorkspace();
  }
  
};

function main() {
  MvoEdge.main();
}