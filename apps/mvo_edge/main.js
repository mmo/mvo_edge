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
  //retreive parameters contain in the URL
  SC.routes.add(':', MvoEdge.configurator, 'initialize');

};

function main() {
  MvoEdge.main();
}