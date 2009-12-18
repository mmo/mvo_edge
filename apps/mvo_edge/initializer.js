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
          MvoEdge.logger.info('remote access');
          var url = !SC.none(this.get('inputParameters')) ?
          this.get('inputParameters').url : undefined;
          if (url !== undefined) {
            MvoEdge.logger.info('send this url ' + url);
            var serverAdress = MvoEdge.configurator.get('urlParameters').get;            
            var request = SC.Request.getUrl(
            serverAdress + url).json().notify(this, this._storeCDM);  // to be used with the python server
            request.set('isAsynchronous', NO);
            request.set('isJSON', YES);
            request.send();
          }
          else {
            //stop the application now
            MvoEdge.logger.error('there is no url parameter');
            alert("You have to call Multivio with : \n" +
            "#fixtures&name=VAA or\n #get&url=http://doc.rero.ch/record/9495/export/xd");
            return NO;
          }
          break;
        case 'fixtures':
          MvoEdge.logger.info('using fixtures');
          var name = this.get('inputParameters').name;
          switch (name) {
          case 'VAA': 
            MvoEdge.logger.info('VAA fixtures used');
            break;
          case 'HTML':
            MvoEdge.logger.info('HTML fixtures used');
            MvoEdge.CoreDocumentNode.FIXTURES = 
              MvoEdge.CoreDocumentNode.FIXTURES_HTML;
            break;
          case 'PDF':
            MvoEdge.logger.info('PDF fixtures used');
            MvoEdge.CoreDocumentNode.FIXTURES = 
              MvoEdge.CoreDocumentNode.FIXTURES_PDF_RENDERER;
            break;
          default:
            MvoEdge.logger.error(name + ' is an invalid parameter');
            break;
          }
          MvoEdge.store = SC.Store.create().from(SC.Record.fixtures);
          break;
        default:
          // stop the application now
          MvoEdge.logger.error('there is no name parameter');
          alert("You have to call Multivio with : \n" +
          "#fixtures&name=VAA or\n #get&url=http://doc.rero.ch/record/9495/export/xd");
          return NO;
        }
      }
      else {
        MvoEdge.logger.error('invalid request');
      }
      this._initializeComponent();
    }
  }.observes('inputParameters'),
 
  /**
    @method

    Parse and store the CDM response 

    @private  
    @param {String} {response} {response received from the server}
  */ 
  _storeCDM: function (response) {
    MvoEdge.logger.info('response received: ' + response.get("body"));
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
    MvoEdge.logger.info('number of CDM nodes: ' + 
      MvoEdge.store.find(MvoEdge.CoreDocumentNode).length());
  },
      
  /**
    @method

    Initialize controllers, view and layout

    @private  
  */
  _initializeComponent: function () { 
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
    MvoEdge.logger.info("nodes = " + nodes.get('length'));
    MvoEdge.thumbnailController.initialize(nodes);
    MvoEdge.treeController.initialize(nodes);
    MvoEdge.masterController.initialize(nodes);
    
    // Call the layout controller in order to setup the interface components
    var scenario = MvoEdge.configurator.get('inputParameters').scenario;
    switch (scenario) {
    case 'fixtures':
      var name = MvoEdge.configurator.get('inputParameters').name;
      switch (name) {
      case 'VAA': 
        MvoEdge.logger.info('normal layout');
        MvoEdge.layoutController.initializeWorkspace();
        break;        
      case 'HTML':
        MvoEdge.logger.info('create HTML layout');
        MvoEdge.layoutController.initializeHTMLWorkspace();
        break;
      case 'PDF':
        MvoEdge.logger.info('create PDF layout');
        MvoEdge.layoutController.initializePDFRendererWorkspace();
        break;
      }
      break;
    default:
      MvoEdge.logger.info('default normal layout');
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
    MvoEdge.logger.info('end initializer');
  }

});
