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

    // TODO separate input properties from other properties, in order to allow
    // separate bindings to the former

    @default {}
  */
  properties: {},

  /**
    @method

    Read and store parameters of the Url

    @param {String} {params} 
  */
  initialize: function (params) {
    //console.info('init...');
    var prop = {};
    for (var key in params) {
      //console.info('key: '+ key+" =  "+params[key]);
      if (params.hasOwnProperty(key)) {
        if (key === "") {
          if (params[key] === 'get') {
            MvoEdge.SCENARIO = 1;
          }
          if (params[key] === 'fixtures') {
            MvoEdge.SCENARIO = 2;
          }
        } else {
          var value = params[key];
          prop[key] = value;
        }
      }
    }
    this.set('properties', prop);
  }
  
});
