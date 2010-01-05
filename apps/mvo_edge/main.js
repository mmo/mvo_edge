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

  // MvoEdge.configurator#readInputParameters() is declared as the callback
  // function that parses the parameters given in the applications's URL; this
  // is done using the SC.routes mechanism.
  SC.routes.add(':', MvoEdge.configurator, 'readInputParameters');
  
  // Launch the initalization process using MvoEdge.initializer
  MvoEdge.initializer.initialize();
};

function main() {
  MvoEdge.main();
}
