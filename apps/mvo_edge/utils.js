/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  General utilities
*/


/**
  @function

  Validates a hash of parameters against a set of conditions

  This method is useful for validating a set of parameters given to a
  function as a hash, instead of separately as independent values.
  
  It takes two hashes: one with the parameters and the other with the
  conditions. It then checks if all the required parameters are present and
  of the required type.

  It does not check for parameter values.
  
  The return value is simply a string with validation messages. The
  validation is successful if the string is empty. No exception is raised.

  @param {Object} params
  @param {Object} conditions
  @returns {String} validation message; validation is successful if empty
*/
MvoEdge.checkParams = function (params, conditions) {
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
};
