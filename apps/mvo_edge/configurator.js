// ==========================================================================
// Project:   MvoEdge.server
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Object that get and store all parameters of the call Url.

  @author {CHE}     
  @extends {Object}  
  @since {0.1.0}    
*/
MvoEdge.configurator = SC.Object.create(
/** @scope MvoEdge.configurator.prototype */ {

  /**
    @property {Object}

    This object contains all parameters of the Url

    @default {}
  */
  properties: {},

  /**
    @method

    Read and store parameters of the Url

    @param {String} {params} 
  */
  initialize: function (params) {
    var prop = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && key !== "") {
        var value = params[key];
        prop[key] = value;
      }
    }
    this.set('properties', prop);
  }
  
});
