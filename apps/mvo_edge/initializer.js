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
    Binds to the properties of the configurator
    @property {MvoEdge.configurator.properties}
   */
  propertiesBinding: "MvoEdge.configurator.properties",
  
  /**
    @method

    Retrieve CDM.
    @observes {properties}     
  */
  _propertiesDidChange: function () {
    var url = !SC.none(this.get('properties')) ?
        this.get('properties').url : undefined;
    if (url !== undefined) {
      console.info('send this url' + url);
      var request = SC.Request.getUrl('/multivio/document/get?url=' + url).json().notify(this, this._storeCDM);  // to be used with the python server
      //var request = SC.Request.getUrl('/zircon/Client?cl=dfst.StructureParser&act=getDoc&recid=' + recid); // to be used with the Java servlet
      request.set('isAsynchronous', NO);
      request.set('isJSON', YES);
      request.send();
      console.info(request);
    }
    if (this.isFirstTime) {
      this.isFirstTime = NO;
    } else {
      this._initializeComponent();
    }
  }.observes('properties'),
 
  /**
    @method

    Parse and store the CDM response 

    @private  
    @param {String} {response} {response received from the server}
  */ 
  _storeCDM: function (response) {
    console.info('response received: ' + response.get("body"));
    var jsonRes = response.get("body");
		MvoEdge.store = SC.Store.create();
    for (var key in jsonRes) {
      if (jsonRes.hasOwnProperty(key)) {
        var oneNode = jsonRes[key];
        var cdmRecord = MvoEdge.store.createRecord(MvoEdge.CoreDocumentNode,
            oneNode, key);
      } 
    }
		MvoEdge.store.flush();
    console.info('number of CDM nodes: ' + 
		MvoEdge.store.find(SC.Query.create({recordType: MvoEdge.CoreDocumentNode})).length());
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
    MvoEdge.getPath('mainPage.mainPane').append();

    // adjust fixtures according to the selected example
    var type = MvoEdge.get('type');
    if (type === 1) {
      MvoEdge.CoreDocumentNode.FIXTURES = MvoEdge.CoreDocumentNode.FIXTURES_HTML;
    } else if (type === 2) {
      MvoEdge.CoreDocumentNode.FIXTURES = MvoEdge.CoreDocumentNode.FIXTURES_PDF_RENDERER;
    }

    // Step 2. Set the content property on your primary controller.
    // This will make your app come alive!
    // Set the content property on your primary controller
    // ex: .contactsController.set('content',.contacts);
    var nodes = MvoEdge.store.find(SC.Query.create({recordType: MvoEdge.CoreDocumentNode}));
    MvoEdge.masterController.initialize(nodes);
    MvoEdge.thumbnailController.initialize(nodes);
    MvoEdge.treeController.initialize(nodes);
    // Call the layout controller in order to setup the interface components
    if (type === 0 || type === 3) {
      MvoEdge.layoutController.initializeWorkspace();
    } else if (type === 1) {
      MvoEdge.layoutController.initializeHTMLWorkspace();
    } else if (type === 2) {
      MvoEdge.layoutController.initializePDFRendererWorkspace();
    }
  }

});
