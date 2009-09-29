// ==========================================================================
// Project:   MvoEdge.server
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Object that starts the application into local mode (using fixtures) or  remote mode (using backend informations). 

  @author {CHE}     
  @extends {Object}  
  @since {0.1.0}    
*/
MvoEdge.routes = SC.Object.create(
/** @scope MvoEdge.routes.prototype */ {

  /**
    @method

    Check witch mode to use and if necessary get parameters of the url
    before initializing the application
    
    TO DO MODIFY THIS METHOD => MAPI INFORMATION NEEDED

    @param {String} {params} 
  */
  routeHandler: function (params) {
    if (params.recid) {
      this.getCDM(params.recid);
    }
    MvoEdge.initialize.initializeComponent();
  },
  
  /**
    @method

    Ask the server to get the CDM of the corresponding id

    @param {Integer} {recid} {the record id }  
  */
  getCDM: function (recId) {
    var request = SC.Request.getUrl('/zircon/Client?req=' + recId);
    request.set('isAsynchronous', NO);
    var resp = request.send();
    this.parseResponse(request.response());
  },
  
  /*responseDidChange: function() {
    console.log('response change ');
  }.observes('.request.response'),*/
  
  /**
    @method

    Parse the JSON response and store CoreDocumentNodes  

    @param {String} {resp} {response receives from the server}   
  */
  parseResponse: function (resp) {
    console.info('response received: ' + resp);
    var jsonRes = SC.json.decode(resp);
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
  }

});
