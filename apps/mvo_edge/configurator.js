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
      "ajax": "LOG_ERROR",
      "console": "LOG_INFO",
      "browserConsole": "LOG_INFO"
    },
    "logFile": "/multivio/log" // to be used with the python server
      //"logFile": "/zircon/Client?cl=error.Logger&act=add" // to be used with the Java servlet
  },
  
  /**
    @property {Object}
  
    This object contains all urls used by the application
  
  */
  urlParameters: {
    "get": "/multivio/document/get?url=", // to be used with the python server
    //"get": "/zircon/Client?cl=dfst.StructureParser&act=getDoc&recid=" // to be used with the Java servlet
    
    "thumbnail": "/multivio/document/thumbnail?size=100&url=",
    
    "image": {
      "small": "/multivio/document/thumbnail?size=500&url=",
      "normal": "/multivio/document/thumbnail?size=1000&url=",
      "bigg": "/multivio/document/thumbnail?size=1500&url="
    },
    
    "fixtures": {
      "VAA": "/static/mvo_edge/en/current/images/VAA",
      "PDF": "/static/mvo_edge/en/current/PDFRenderer",
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
    MvoEdge.logger.info('end readInputParameters');
  },
  
  /**
    @method
  
    Return the adapted url for the main image
  
  */
  getImageUrl: function (url) {
    var scenario = this.get('inputParameters').scenario;
    var modifiedUrl;
    switch (scenario) {
    
    case 'get':
      modifiedUrl = this.get('urlParameters').image.small;
      modifiedUrl += url;        
      break;
    
    case 'fixtures':
      var name = this.get('inputParameters').name;
      switch (name) {
      case 'VAA': 
        modifiedUrl = this.get('urlParameters').fixtures.VAA;
        break;
      case 'HTML':
        modifiedUrl = this.get('urlParameters').fixtures.HTML;
        break;
      case 'PDF':
        modifiedUrl = this.get('urlParameters').fixtures.PDF;
        break;
      }
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
      modifiedUrl = this.get('urlParameters').thumbnail;
      modifiedUrl += url;
      break;
    
    case 'fixtures':
      var name = this.get('inputParameters').name;
    
      switch (name) {
      case 'VAA': 
        modifiedUrl = this.get('urlParameters').fixtures.VAA;
        break;
      case 'HTML':
        modifiedUrl = this.get('urlParameters').fixtures.HTML;
        break;
      case 'PDF':
        modifiedUrl = this.get('urlParameters').fixtures.PDF;
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
