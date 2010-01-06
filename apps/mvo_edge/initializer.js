// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
/**
  @class

  Object that retrieves CDM and initialize all components. 

  @author {CHE}      
  @extends {Object}   
  @since {0.1.0} 
*/

MvoEdge.initializer = SC.Object.create( 
/** @scope MvoEdge.initializer.prototype */ {


  /**
    @method

    Main initializer function.
  */
  initialize: function () {
  },

  /**
    @property {Boolean}
    
    Is the first time the _inputParametersDidChange method is call
    This method is call a first time to create the binding => do nothing
  */
  isFirstTime: YES,

  /**
    Binds to the inputParameters of the configurator
    @property {MvoEdge.configurator.inputParameters}
   */
  inputParametersBinding: "MvoEdge.configurator.inputParameters",

  /**
    @method

    Retrieve CDM.
    @observes {properties}     
  */
  _inputParametersDidChange: function () {
    if (this.isFirstTime) {
      this.isFirstTime = NO;
    } else {
      var scenario = this.get('inputParameters').scenario;
      if (!SC.none(scenario)) {
        switch (scenario) {
        case 'get':
          MvoEdge.logger.info('initializer: using remote access with URL: %@');
          var url = !SC.none(this.get('inputParameters')) ?
              this.get('inputParameters').url : undefined;
          if (url !== undefined) {
            MvoEdge.logger.debug('initializer: sending url to the server: ' +
                url);
            var serverAdress = MvoEdge.configurator.getPath('baseUrlParameters.get');            
            var request = SC.Request.getUrl(serverAdress + url).
                json().notify(this, this._storeCDM);
            request.set('isAsynchronous', NO);
            request.set('isJSON', YES);
            request.send();
          }
          else {
            // stop the application now
            MvoEdge.logger.error('no URL parameter has been provided');
            alert(this._usageMessage);
            return NO;
          }
          break;
          
        case 'fixtures':
          MvoEdge.logger.info('initializer: using fixtures');
          var name = this.get('inputParameters').name;
          switch (name) {
          case 'VAA': 
            MvoEdge.logger.info('initializer: using VAA fixtures');
            break;
          case 'HTML':
            MvoEdge.logger.info('initializer: using HTML fixtures');
            MvoEdge.CoreDocumentNode.FIXTURES = 
                MvoEdge.CoreDocumentNode.FIXTURES_HTML;
            break;
          case 'PDF':
            MvoEdge.logger.info('initializer: using PDF fixtures');
            MvoEdge.CoreDocumentNode.FIXTURES = 
                MvoEdge.CoreDocumentNode.FIXTURES_PDF_RENDERER;
            break;
          default:
            MvoEdge.logger.error('"%@" is an invalid parameter'.fmt(name));
            break;
          }
          MvoEdge.store = SC.Store.create().from(SC.Record.fixtures);
          break;
        default:
          // stop the application now
          MvoEdge.logger.error('the "name" parameter is missing');
          alert(this._usageMessage);
          return NO;
        }
        this._initializeComponents();
      }
      else {
        MvoEdge.logger.error('invalid request');
        return NO;
      }
      
    }
  }.observes('inputParameters'),
 
  /**
    @method

    Parse and store the CDM response 

    @private  
    @param {String} {response} {response received from the server}
  */ 
  _storeCDM: function (response) {
    MvoEdge.logger.debug('initializer: response received from the server: %@'.
        fmt(response.get("body")));
    var jsonRes = response.get("body");
    MvoEdge.store = SC.Store.create();
    for (var key in jsonRes) {
      if (jsonRes.hasOwnProperty(key)) {
        var oneNode = jsonRes[key];
        var cdmRecord = MvoEdge.store.createRecord(MvoEdge.CoreDocumentNode,
            oneNode, key);
      } 
    }
    //MvoEdge.store.flush();
    MvoEdge.logger.info('initializer: number of CDM nodes: ' + 
      MvoEdge.store.find(MvoEdge.CoreDocumentNode).length());
  },
      
  /**
    @method

    Initialize controllers, views and layout

    @private  
  */
  _initializeComponents: function () { 
    // Step 1: Instantiate Your Views
    // The default code here will make the mainPane for your application visible
    // on screen.  If you app gets any level of complexity, you will probably 
    // create multiple pages and panes.
    SC.RunLoop.begin();
    MvoEdge.getPath('mainPage.mainPane').append();

    // Step 2. Set the content property on your primary controller.
    // This will make your app come alive!
    // Set the content property on your primary controller
    // ex: .contactsController.set('content',.contacts);
    var nodes = MvoEdge.store.find(MvoEdge.CoreDocumentNode);
    MvoEdge.logger.info("initializer: number of CDM nodes: " +
        nodes.get('length'));
    MvoEdge.thumbnailController.initialize(nodes);
    MvoEdge.treeController.initialize(nodes);
    MvoEdge.masterController.initialize(nodes);
    
    // Call the layout controller in order to setup the interface components
    var scenario = MvoEdge.configurator.getPath('inputParameters.scenario');
    switch (scenario) {
    case 'fixtures':
      var name = MvoEdge.configurator.getPath('inputParameters.name');
      switch (name) {
      case 'VAA': 
        MvoEdge.logger.info('initializer: using layout for VAA fixtures');
        MvoEdge.layoutController.initializeWorkspace();
        break;        
      case 'HTML':
        MvoEdge.logger.info('initializer: using layout for HTML fixtures');
        MvoEdge.layoutController.initializeHTMLWorkspace();
        break;
      case 'PDF':
        MvoEdge.logger.info('initializer: using layout for PDF fixtures');
        MvoEdge.layoutController.initializePDFRendererWorkspace();
        break;
      }
      break;
    default:
      MvoEdge.logger.info('initializer: using default layout');
      MvoEdge.layoutController.initializeWorkspace();
      break;
    }
    
    // initialize the selection with the first CDM leaf node
    var sortedNodes = nodes.sortProperty('guid');
    for (var i = 0; i < sortedNodes.length; i++) {
      if (sortedNodes[i].get('isLeafNode')) {
        MvoEdge.masterController.set('masterSelection', sortedNodes[i]);
        break;
      }
    }
    SC.RunLoop.end();
    MvoEdge.logger.info('end of initializer._initializeComponents()');
  },

  // TODO this message should be shown as HTML, replacing the usual application
  // layout, and not as a JS alert popup; the provided links should be clickable
  _currentBaseURL: '' + document.location.host + document.location.pathname,
  _usageMessage: 'The syntax for calling Multivio is:\n\n' +
      '%@#fixtures&name=<FIXTURE_SET>\n\n'.fmt(this._currentBaseURL) +
      'or\n\n' +
      '#get&url=<TARGET>\n\n' +
      'where <FIXTURE_SET> can be: "VAA", "HTML" or "PDF"\n' +
      'and <TARGET> is the URL of the content to be presented by Multivio\n\n' +
      'Examples:\n\n' +
      '%@#get&url=http://doc.rero.ch/record/9495/export/xd (Dublin Core target)\n\n'.fmt(this._currentBaseURL) +
      '%@#get&url=http://era.ethz.ch/oai?verb=GetRecord&metadataPrefix=mets&identifier=oai:era.ethz.ch:34314 (METS target)'.fmt(this._currentBaseURL)

});
