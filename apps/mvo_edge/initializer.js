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
    @property {String}
    
    The name of the fixture set used
  */
  fixtureSet: '',

  /**
    @method

    Read input parameters in order to decide how to fetch application data
    @observes {inputParameters}
  */
  _inputParametersDidChange: function () {
    if (this.isFirstTime) {
      this.isFirstTime = NO;
    }
    else {
      // Attach the main page to the browser window in order to initiate the
      // interface of the application
      MvoEdge.getPath('mainPage.mainPane').append();

      this._showWaitingPage();
      
      var scenario = this.get('inputParameters').scenario;
      var success = NO;

      if (!SC.none(scenario)) {
        switch (scenario) {
        case 'get':
          success = this._fetchCDMFromServer();
          if (!success) {
            MvoEdge.logger.error(
                'initializer: error fetching CDM from server');
          }
          break;
        case 'fixtures':
          success = this._fetchCDMFromFixtures();
          if (!success) {
            MvoEdge.logger.error(
                'initializer: error fetching CDM from fixtures');
          }
          break;
        default:
          MvoEdge.logger.error(
              'initializer: requested scenario "%@" unknown'.fmt(scenario));
          success = NO;
          break;
        }
      }
      else {
        MvoEdge.logger.error(
            'initializer: scenario missing in call'.fmt(scenario));
        success = NO;
        return;
      }

      if (!success) {
        this._hideWaitingPage();
        this._showUsagePage();
      }
    }
  }.observes('inputParameters'),

  /**
    @method

    Fetch CoreDocumentModel from the server.
  */
  _fetchCDMFromServer: function () {
    // use location.hash to prevent splitting the url
    var url = !SC.none(location.hash) ?
        location.hash : undefined;
    if (url !== undefined) {
      url = url.replace('#get&url=', '');
      MvoEdge.logger.debug('initializer: sending url to the server: ' +
          url);
      var serverAdress = MvoEdge.configurator.getPath('baseUrlParameters.get');
      var request = SC.Request.getUrl(serverAdress + url).
          json().notify(this, this._storeCDM);
      request.set('isJSON', YES);
      request.send();
      return YES;
    }
    else {
      MvoEdge.logger.error('initializer: no URL parameter has been provided');
      return NO;
    }
  },

  /**
    @method

    Fetch CoreDocumentModel from fixture data.
  */
  _fetchCDMFromFixtures: function () {
    var name = this.get('inputParameters').name;
    if (SC.typeOf(name) !== SC.T_STRING || name.length === 0) {
      MvoEdge.logger.error('initializer: the "name" parameter is missing');
      // TODO show usage page here!!!
      return NO;
    }
    // check if requested fixture set exists in the application
    var fixtureSets = MvoEdge.configurator.getPath('fixtureSets');
    var fixtureData = null;
    var found = NO;
    for (var f in fixtureSets) {
      if (fixtureSets.hasOwnProperty(f)) {
        if (f === name) {
          fixtureData = f.fixtureData;
          found = YES;
          break;
        }
      }
    }
    if (found === YES) {
      switch (name) {
      case 'VAA':
        break;
      case 'HTML':
        MvoEdge.CoreDocumentNode.FIXTURES =
            MvoEdge.CoreDocumentNode.FIXTURES_HTML;
        break;
      case 'ERR':
        MvoEdge.CoreDocumentNode.FIXTURES =
            MvoEdge.CoreDocumentNode.FIXTURES_ERROR;
        break;
      default:
        MvoEdge.logger.error('initializer: the value "%@" '.fmt(name) + 
            'for the "name" parameter is configured in the application ' +
            'but seems invalid at this point');
        return NO;
      }
      this.set('fixtureSet', name);

      // create the store with the appropriate fixture data
      MvoEdge.logger.info('initializer: using "%@" fixtures'.fmt(name));
      MvoEdge.store = SC.Store.create().from(SC.Record.fixtures);

      this._initializeControllers();

      return YES;
    }
    else {
      MvoEdge.logger.error('initializer: the value "%@" '.fmt(name) +
          'for the "name" parameter is invalid');
      return NO;
    }
  },

  /**
    @method

    Parse and store the CDM response 

    @private  
    @param {String} {response} {response received from the server}
  */ 
  _storeCDM: function (response) {
    MvoEdge.logger.debug('initializer: response received from the server: %@'.
        fmt(response.get("body")));
    var isError = NO;
    var jsonRes = response.get("body");
    //TO DO VERIFY IF ID = -1 to call ErrorPage
    MvoEdge.store = SC.Store.create();
    for (var key in jsonRes) {
      if (jsonRes.hasOwnProperty(key)) {
        var oneNode = jsonRes[key];
        var cdmRecord = MvoEdge.store.createRecord(MvoEdge.CoreDocumentNode,
            oneNode, key);
        if (key === '-1') {
          isError = YES;
        }
      } 
    }
    //MvoEdge.store.flush();
    MvoEdge.logger.info('initializer: number of CDM nodes: ' + 
        MvoEdge.store.find(MvoEdge.CoreDocumentNode).length());
    
    if (isError) {
      var nodes = MvoEdge.store.find(MvoEdge.CoreDocumentNode);
      MvoEdge.errorHandler.initialize(nodes);
      this._hideWaitingPage();
      this._showErrorPage();
    }
    else {
      this._initializeControllers();
    }
  },

  /**
    @method

    Initialize controllers with document data

    @private  
  */
  _initializeControllers: function () { 

    SC.RunLoop.begin();
    
    try {
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

      MvoEdge.navigationController.initialize();

      // initialize the selection with the first CDM leaf node
      var sortedNodes = nodes.sortProperty('guid');
      for (var i = 0; i < sortedNodes.length; i++) {
        if (sortedNodes[i].get('isLeafNode')) {
          MvoEdge.masterController.set('masterSelection', sortedNodes[i]);
          break;
        }
      }
    }
    catch (e) {
      MvoEdge.logger.logException(e, 'Error initializing components with data');
    }
    finally {
      SC.RunLoop.end();
      this._hideWaitingPage();
      this._layOutComponentsOnWindow();
    }
  },

  /**
    @method

    Lay out components on window according to application scenario

    @private  
  */
  _layOutComponentsOnWindow: function () {
    
    SC.RunLoop.begin();
    // Call the layout controller in order to setup the interface components
    try {
      if (SC.typeOf(this.get('fixtureSet')) === SC.T_STRING &&
          this.get('fixtureSet').length > 0) {
        var componentLayout = MvoEdge.configurator.getPath(
            'fixtureSets.' + this.get('fixtureSet') + '.componentLayout');
        MvoEdge.layoutController.configureWorkspace(componentLayout);
      }
      else {
        MvoEdge.layoutController.configureWorkspace('pageBasedWithDivider');
      }
    }
    catch (e) {
      MvoEdge.logger.logException(e, 'Error laying out components on window');
    }
    finally {
      SC.RunLoop.end();
    }
  },

  /**
    @method

    Show usage page

    @private  
  */
  _showUsagePage: function () {
    SC.RunLoop.begin();
    // Call the layout controller in order to setup the interface components
    try {
      MvoEdge.layoutController.configureWorkspace('usage');
    }
    catch (e) {
      MvoEdge.logger.logException(e, 'Error showing usage page');
    }
    finally {
      SC.RunLoop.end();
    }
  },
  
  /**
    @method

    Show error page

    @private  
  */
  _showErrorPage: function () {
    SC.RunLoop.begin();
    // Call the layout controller in order to setup the interface components
    try {
      MvoEdge.layoutController.configureWorkspace('error');
    }
    catch (e) {
      MvoEdge.logger.logException(e, 'Error showing usage page');
    }
    finally {
      SC.RunLoop.end();
    }
  },

  /**
    @method

    Show waiting page

    @private  
  */
  _showWaitingPage: function () {
    // show waiting pane
    SC.RunLoop.begin();
    MvoEdge.waitingPane.append();
    SC.RunLoop.end();
  },

  _hideWaitingPage: function () {
    // remove waiting pane
    SC.RunLoop.begin();
    MvoEdge.waitingPane.remove();
    SC.RunLoop.end();
  }

});
