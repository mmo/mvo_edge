// ==========================================================================
// Project:   MvoEdge
// Copyright: ©2009 RERO
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
    log: {
      console:        "LOG_INFO",
      browserConsole: "LOG_INFO",
      ajax:           "LOG_ERROR"
    },
    logFile: "/multivio/log"
  },
  
  /**
    @property {Object}
  
    This object contains all urls used by the application
  
  */
  baseUrlParameters: {
    get: "/multivio/document/get?url=",
    
    thumbnail: "/multivio/document/thumbnail?size=100&url=",
    
    image: {
      small:  "/multivio/document/thumbnail?size=500&url=",
      normal: "/multivio/document/thumbnail?size=1000&url=",
      big:    "/multivio/document/thumbnail?size=1500&url="
    },
    
    fixtures: {
      VAA: "/static/mvo_edge/en/current/images/VAA",
      PDF:  "/static/mvo_edge/en/current/PDFRenderer",
      HTML: "/static/mvo_edge/en/current/PDFHTML"
    }
  },

  layouts: {
    'default': {
      layoutClass: 'GridLayout3x3',
      layoutParams: {
        'leftStripWidth':  400,
        'rightStripWidth': 120,
        'headerHeight':     80,
        'footerHeight':     80,
        'marginTop':         5,
        'marginRight':       5,
        'marginBottom':      5,
        'marginLeft':        5
      }
    }
  },
  
  componentLayouts: {
    'pageBased': {
      baseLayout: 'default',
      components: [
        {name: 'views.metadataView',    x: 0, y: 0, xlen: 3, ylen: 1},
        {name: 'views.treeView',        x: 0, y: 1, xlen: 1, ylen: 1},
        {name: 'views.mainContentView', x: 1, y: 1, xlen: 1, ylen: 1},
        {name: 'views.thumbnailView',   x: 2, y: 1, xlen: 1, ylen: 1},
        {name: 'views.navigationView',  x: 0, y: 2, xlen: 3, ylen: 1}
      ]
    },
    'contentFullScreen': {
      baseLayout: 'default',
      components: [
        {name: 'views.mainContentView', x: 0, y: 0, xlen: 3, ylen: 3}
      ]
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
    if (SC.typeOf(configPath) !== SC.T_STRING) {
      throw 'Configuration path type "%@" is invalid'.fmt(
          SC.typeOf(configPath));
    }
    var result = undefined;
    var pathComponents = configPath.split('.');
    if (!SC.none(pathComponents) && pathComponents.length > 0) {
      // extract the first path component, which corresponds to the target
      // dictionary of MvoEdge.configurator
      result = this[pathComponents[0]];
      // raise an exception if path component is invalid
      if (SC.none(result)) {
        throw 'Configuration path "%@" is invalid'.fmt(configPath);
      }
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
    var modifiedUrl = '';
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
      modifiedUrl = this.getPath('baseUrlParameters.fixtures.%@'.fmt(name));
      modifiedUrl += url.substring(url.lastIndexOf("/"));
      break;
    
    default:
      modifiedUrl = undefined;
      break;
    }
    return modifiedUrl;
  }

});
