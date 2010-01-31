// ==========================================================================
// Project:   MvoEdge
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Object that get and store all config parameters.

  @author CHE
  @extends {SC.Object}
  @since 0.1.0
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
      //console:        "LOG_INFO",
      browserConsole: "LOG_INFO",
      ajax:           "LOG_ERROR"
    },
    logFile: "/server/log/post"
  },
  
  /**
    @property {Object}
  
    This object contains all urls used by the application
  
  */
  baseUrlParameters: {
    get: "/server/cdm/get?url=",
    
    thumbnail: "/server/document/get?width=100&url=",
    
    image: {
      small:  "/server/document/get?width=1500&url=",
      normal: "/server/document/get?width=2000&url=",
      big:    "/server/document/get?width=2500&url="
    },
    
    fixtures: {
      VAA: "/static/mvo_edge/en/current/images/VAA",
      HTML: "/static/mvo_edge/en/current/PDFHTML"
    }
  },

  /**
    @property {Object}

    Definition of the different layouts that can be set on the main page 
  */
  layouts: {
    'default': {
      layoutClass: 'GridLayout3x3',
      layoutParams: {
        'leftStripWidth':  200,
        'rightStripWidth': 200,
        'headerHeight':     80,
        'footerHeight':     60,
        'marginTop':        10,
        'marginRight':      10,
        'marginBottom':     10,
        'marginLeft':       10
      }
    }
  },

  /**
    @property {Object}

    Definition of different possible component arrangements on the screen.
    The 'baseLayout' key points to the one of the members of the property
    'this.layouts'.
  */
  componentLayouts: {
    'pageBased': {
      baseLayout: 'default',
      components: [
        {name: 'views.headerView',      x: 0, y: 0, xlen: 3, ylen: 1},
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
    },
    'usage': {
      baseLayout: 'default',
      components: [
        {name: 'views.usageView', x: 0, y: 0, xlen: 3, ylen: 3}
      ]
    },
    'waiting': {
      baseLayout: 'default',
      components: [
        {name: 'views.waitingView', x: 0, y: 0, xlen: 3, ylen: 3}
      ]
    }
  },

  fixtureSets: {
    'VAA': {
      componentLayout: 'pageBased'
    },
    'HTML': {
      componentLayout: 'pageBased'
    },
    'PDF': {
      componentLayout: 'pageBased'
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
    returns the equivalent of this.get('baseUrlParameters').image.small

    @param {String} configPath
    @returns {String}
  */
  getPath: function (configPath) {
    if (SC.typeOf(configPath) !== SC.T_STRING) {
      throw {message: 'Configuration path type "%@" is invalid'.fmt(
          SC.typeOf(configPath))};
    }
    var result = undefined;
    var pathComponents = configPath.split('.');
    if (!SC.none(pathComponents) && pathComponents.length > 0) {
      // extract the first path component, which corresponds to the target
      // dictionary of MvoEdge.configurator
      result = this[pathComponents[0]];
      // raise an exception if path component is invalid
      if (SC.none(result)) {
        throw {message: 'Configuration path "%@" is invalid'.fmt(configPath)};
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

    Return the adapted url for a file

    @param {String} url the url of the file
    @param {Number} the page number is optional
    @return {String} the new encoded url
  */
  getImageUrl: function (url, pageNumber) {
    var scenario = this.getPath('inputParameters.scenario');
    var modifiedUrl = '';
    switch (scenario) {
    
    case 'get':
      modifiedUrl = this.getPath('baseUrlParameters.image.normal');
      modifiedUrl += url;
      modifiedUrl += "&pagenr=" + pageNumber;      
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

    @param {String} url the default url of the file
    @param {Number} the page number is optional
    @return {String} the new encoded url
  */
  getThumbnailUrl: function (url, pageNumber) {
    var scenario = this.get('inputParameters').scenario;
    var modifiedUrl;
    
    switch (scenario) {
    
    case 'get':
      modifiedUrl = this.get('baseUrlParameters').thumbnail;
      modifiedUrl += url;
      modifiedUrl += "&pagenr=" + pageNumber;
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
  },

  usageText: '' +
    '<img src="%@" class="sc-icon-info-48">'.fmt(SC.BLANK_IMAGE_URL) +
    '<div class="mvo_info_full_message">' +
    '<h3>' + '_How to launch Multivio'.loc() + '</h3>' +
    '<p>' +
    '_The calling syntax is'.loc() + ':' +
    '<ul><li>http://demo.multivio.org/client/#get&url={TARGET}</li></ul>' +
    '_The {TARGET} URL can link to'.loc() + ':' +
    '<ul>' +
    '  <li>' + '_A Dublin Core record'.loc() + '</li>' +
    '  <li>' + '_A METS record (supported profiles only)'.loc() + '</li>' +
    '</ul>' +
    '_Examples'.loc() + ':' +
    '<ul>' +
    '  <li>http://demo.multivio.org/client/#get&url=http://doc.rero.ch/record/9495/export/xd</li>' +
    '  <li>http://demo.multivio.org/client/#get&url=http://era.ethz.ch/oai?verb=GetRecord&metadataPrefix=mets&identifier=oai:era.ethz.ch:34314</li>' +
    '</ul>' +
    '</p>' +
    '</div>'
  
});
