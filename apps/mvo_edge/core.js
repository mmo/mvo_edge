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
  
  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create(),

  // TODO: Add global constants or singleton objects needed by your app here.


  /**
    @method

    Validates a hash of parameters against a set of conditions

    This method is useful for validating a set of parameters given to a
    function as a hash, instead of separately as independent values.
    
    It takes two hashes: one with the parameters and the other with the
    conditions. It then checks if all the required parameters are present and
    of the required type.

    It does not check for parameter values.
    
    The return value is simply a string with validation messages. The
    validation is successful if the string is empty. No exception is raised.

    @param {Hash} params
    @param {Hash} conditions
    @returns {String} validation message; validation is successful if empty
  */
  checkParams: function (params, conditions) {
    var message = '';
    for (var key in conditions) {
      if (conditions.hasOwnProperty(key)) {
        if (SC.typeOf(params[key]) !== conditions[key]) {
          message.push(
              'parameter %@ of type %@ required; '.fmt(key, conditions[key]));
        }
      }
    }
    return message;
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
