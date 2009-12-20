// ==========================================================================
// Project:   MvoEdge.server
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Object that get and store all config parameters.

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
  inputParameters: {},
  
  /**
    @property {Object}
  
    This object contains all parameters for logs
  
  */
  logParameters: {
    "log": {
      // "console":        "LOG_INFO"
      // "browserConsole": "LOG_INFO",
      // "ajax":           "LOG_ERROR",
    },
    "logFile": "/multivio/log" // to be used with the python server
      //"logFile": "/zircon/Client?cl=error.Logger&act=add" // to be used with the Java servlet
  },
  
  /**
    @property {Object}
  
    This object contains all urls used by the application
  
  */
  baseUrlParameters: {
    "get": "/multivio/document/get?url=", // to be used with the python server
    //"get": "/zircon/Client?cl=dfst.StructureParser&act=getDoc&recid=" // to be used with the Java servlet
    
    "thumbnail": "/multivio/document/thumbnail?size=100&url=",
    
    "image": {
      "small":  "/multivio/document/thumbnail?size=500&url=",
      "normal": "/multivio/document/thumbnail?size=1000&url=",
      "big":    "/multivio/document/thumbnail?size=1500&url="
    },
    
    "fixtures": {
      "VAA": "/static/mvo_edge/en/current/images/VAA",
      "PDF":  "/static/mvo_edge/en/current/PDFRenderer",
      "HTML": "/static/mvo_edge/en/current/PDFHTML"
    }
  },

  /**
    @method
    
    Read and store parameters of the Url
    
    @param {String} {params} 
  */
  readInputParameters: function (params) {
    var prop = {};
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === "") {
          prop.scenario = params[key];
        } else {
          var value = params[key];
          prop[key] = value;
        }
      }
    }
    this.set('inputParameters', prop);
    MvoEdge.logger.debug('end of configurator.readInputParameters()');
  },
  
  /**
    @method

    Return a configuration value given its path.

    Example: if configPath = 'baseUrlParameters.image.small.' the function
    returns the equivalent of this.get(baseUrlParameters').image.small

    @param {String} configPath
    @returns {String}
  */
  getPath: function (configPath) {
    var result = undefined;
    var pathComponents = configPath.split('.');
    if (!SC.none(pathComponents) && pathComponents.length > 0) {
      // extract the first path component, which corresponds to the target
      // dictionary of MvoEdge.configurator
      result = this[pathComponents[0]];
      // dive deeper in the dictionary structure following the successive path
      // components
      for (var i = 1; i < pathComponents.length; i++) {
        result = result[pathComponents[i]];
      }
    }
    return result;
  },

  /**
    @method
  
    Return the adapted url for the main image
  
  */
  getImageUrl: function (url) {
    var scenario = this.getPath('inputParameters.scenario');
    var modifiedUrl;
    switch (scenario) {
    
    case 'get':
      modifiedUrl = this.getPath('baseUrlParameters.image.small');
      modifiedUrl += url;
      break;
    
    case 'fixtures':
      var name = this.getPath('inputParameters.name');
      modifiedUrl = this.getPath('baseUrlParameters.fixtures.%@'.fmt(name));
      modifiedUrl += url.substring(url.lastIndexOf("/"));
      break;
    
    default:
      modifiedUrl = undefined;        
      break;
    }
    return modifiedUrl;
  },
  
  /**
    @method
  
    Return the adapted url for the thumbnail image
  
  */
  getThumbnailUrl: function (url) {
    var scenario = this.get('inputParameters').scenario;
    var modifiedUrl;
    
    switch (scenario) {
    
    case 'get':
      modifiedUrl = this.get('baseUrlParameters').thumbnail;
      modifiedUrl += url;
      break;
    
    case 'fixtures':
      var name = this.get('inputParameters').name;
    
      switch (name) {
      case 'VAA': 
        modifiedUrl = this.get('baseUrlParameters').fixtures.VAA;
        break;
      case 'HTML':
        modifiedUrl = this.get('baseUrlParameters').fixtures.HTML;
        break;
      case 'PDF':
        modifiedUrl = this.get('baseUrlParameters').fixtures.PDF;
        break;
      }
      modifiedUrl += url.substring(url.lastIndexOf("/"));
      break;
    
    default:
      modifiedUrl = undefined;
      break;
    }
    return modifiedUrl;
  }

});
