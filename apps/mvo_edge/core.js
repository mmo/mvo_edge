// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
MvoEdge = SC.Object.create(
  /** @scope MvoEdge.prototype */ {

  NAMESPACE: 'MvoEdge',
  VERSION: '0.1.0',
  
  /** 
    Type of document.

    TODO put this in the configurator, and maybe retrieve the info from the
    parameters

    @property {Integer}
    @default 0
  */
  //type: 0, // to be used with the classic VAA example (based on fixtures)
  // type: 1, // to be used with PDFTOHTML fixtures
  // type: 2, // to be used with PDFRenderer fixtures
  // type: 3, // to be used with a server
  
  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  //store: SC.Store.create().from(SC.Record.fixtures),
  store: SC.Store.create(),
  // 0 = unknown scenario
  // 1 = remote access
  // 2 = local acces (use Fixtures)
  SCENARIO: 0,
  
  // TODO: Add global constants or singleton objects needed by your app here.
  /**
Define Config file
*/
  CONFIG: {
    "log": {
      "ajax" : "LOG_ERROR",
      "console" : "LOG_INFO",
      "browserConsole" : "LOG_INFO"
    },
    "logFile": "/multivio/log" // to be used with the python server
    //"logFile": "/zircon/Client?cl=error.Logger&act=add" // to be used with the Java servlet
  }

});

/**
  Binding template for transforming the return value of the binding into a
  single object if it is an array (returns the first object in the array)

  @see <a href="http://docs.sproutcore.com/symbols/SC.html">Adding Custom
  Transforms</a> in SC.Binding
  @see SC.Binding
 */
SC.Binding.reduceFromArray = function () {
  return this.transform(function (value, binding) {
    var result = value;
    if (value && value.isEnumerable) {
      result = value.firstObject();
    }
    return result;
  });
};
