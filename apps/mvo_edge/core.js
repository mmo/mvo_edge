/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
/*globals MvoEdge */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
MvoEdge = SC.Object.create(
  /** @scope MvoEdge.prototype */ {

  NAMESPACE: 'MvoEdge',
  VERSION: '0.1.0',
  
  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create()

  // TODO: Add global constants or singleton objects needed by your app here.

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
