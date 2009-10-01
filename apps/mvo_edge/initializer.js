// ==========================================================================
// Project:   MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
/**
  @class

  Object that retreives CDM and initialize all components. 

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

    Retreive CDM.
    @observes {properties}     
  */
  _propertiesDidChange: function () {
    var recid = !SC.none(this.get('properties')) ?
        this.get('properties').recid : undefined;
    if (recid !== undefined) {
      console.info('send this request id ' + recid);
      var request = SC.Request.getUrl('/zircon/Client?req=' + recid);
      request.set('isAsynchronous', NO);
      request.send();
      this._storeCDM(request.response());
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
    console.info('response received: ' + response);
    var jsonRes = SC.json.decode(response);
    for (var key in jsonRes) {
      if (jsonRes.hasOwnProperty(key)) {
        var oneNode = jsonRes[key];
        var cdmRecord = MvoEdge.store.createRecord(MvoEdge.CoreDocumentNode,
        oneNode, key);
        var res = MvoEdge.store.commitRecord(MvoEdge.CoreDocumentNode,
        cdmRecord.get('id'), cdmRecord.storeKey); 
      } 
    }
    console.info('number of CDM nodes: ' + 
    MvoEdge.store.findAll(MvoEdge.CoreDocumentNode).length());
  },
      
  /**
    @method

    Initialize controllers, view and layout

    @private  
  */
  _initializeComponent: function () { 
    MvoEdge.getPath('mainPage.mainPane').append();
    var nodes = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
    MvoEdge.masterController.initialize(nodes);
    MvoEdge.thumbnailController.initialize(nodes);
    MvoEdge.treeController.initialize(nodes);
    MvoEdge.layoutController.initializeWorkspace();
  }

});