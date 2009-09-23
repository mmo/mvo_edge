/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  This class is used to navigate in the document.

  @author fma
  @extends SC.Object
  @since 0.0.1
*/
MvoEdge.navigationController = SC.ObjectController.create(
/** @scope MvoEdge.navigationController.prototype */ {

  /** 
    CurrentPage.
 
    @property {Integer}
    @default 1
  */
  currentPage: 1,
  
  /** 
    Number of pages.
    
    @private
    @property {Integer}
    @default undefined
  */
  _numberOfPages: undefined,
  
  /** 
    Applet Id
 
    @private
    @property {String}
    @default undefined
  */
  _appletId: undefined,
  
  /**
    @method
    
    Go to the last page.
    
  */    
  goToLastPage: function () {
    var cur = this.get('currentPage');
    var nbPages = this.getNumberOfPages();
    if (cur < nbPages) {
      var appId = this.get('_appletId');
      try {      
        // Call Applet method
        var lastPage = appId.doLast();
        this.set('currentPage', lastPage);
      } catch (e) {        
        // TODO : throw exception and log error
        var errMess = "Unable to go to the last page :\n%@".fmt(e);
        console.error(errMess);
        throw errMess;
      }           
    }
  },
  
  /**
    @method
    
    Go to the first page.
    
  */     
  goToFirstPage: function () {
    var cur = this.get('currentPage');
    if (cur > 1) {
      var appId = this._getAppletId();
      try {
        // Call Applet method
        var firstPage = appId.doFirst();
        this.set('currentPage', firstPage);
      } catch (e) {
        // TODO : throw exception and log error
        var errMess = "Unable to go to the first page :\n%@".fmt(e);
        console.error(errMess);
        throw errMess;
      }        
    }    
  },
  
  /**
    @method
    
    Go to the previous page.
    
  */   
  goToPreviousPage: function () {
    var cur = this.get('currentPage');
    if (cur > 1) {
      var appId = this._getAppletId();
      try {
        // Call Applet method
        var previousPage = appId.doPrev();
        this.set('currentPage', previousPage);
      } catch (e) {
        // TODO : throw exception and log error
        var errMess = "Unable to go to the previous page :\n%@".fmt(e);
        console.error(errMess);
        throw errMess;
      }  
    }
  },
  
  /**
    @method
    
    Go to the next page.
    
  */    
  goToNextPage: function () {
    var cur = this.get('currentPage');
    var nbPages = this.getNumberOfPages();
    if (cur < nbPages) {
      var appId = this.get('_appletId');
      try {
        // Call Applet method
        var nextPage = appId.doNext();
        this.set('currentPage', nextPage);
      } catch (e) {
        // TODO : throw exception and log error
        var errMess = "Unable to go to the next page :\n%@".fmt(e);
        console.error(errMess);
        throw errMess;
      }      
    }
  },
  
  /**
    @method
    
    Zoom in.
    
  */
  doZoomIn: function () {
    console.info('doZoomIn');
    var appId = this._getAppletId();
    try {
      appId.doZoom(0.7);
    } catch (e) {
      // TODO : throw exception and log error
      var errMess = "Unable to zoom in :\n%@".fmt(e);
      console.error(errMess);
      throw errMess;
    }      
  },
  
  /**
    @method
    
    Zoom out.
    
  */
  doZoomOut: function () {
    console.info('doZoomOut');
    var appId = this._getAppletId();
    try {
      appId.doZoom(1.3);
    } catch (e) {
      // TODO : throw exception and log error
      var errMess = "Unable to zoom out :\n%@".fmt(e);
      console.error(errMess);
      throw errMess;
    }    
  },  
  
  /**
    @method
    
    Original size.
    
  */
  retrieveOriginalSize: function () {
    console.info('doOriginalSize');
    var appId = this._getAppletId();
    try {
      appId.doZoom(1);
    } catch (e) {
      // TODO : throw exception and log error
      var errMess = "Unable to retrieve original size :\n%@".fmt(e);
      console.error(errMess);
      throw errMess;
    }      
  },  
  
  /**
    @method
    
    Retrieve the number of pages.

    @property {Integer} numberOfPages
    @returns {Integer} Return the number of pages.
  */  
  getNumberOfPages: function () {
    var nbPages = this.get('_numberOfPages');
    if (!nbPages) {    
      var appId = this._getAppletId();
      try {
        // Call Applet method
        nbPages = appId.getNbPages();
        if (nbPages) {
          this._numberOfPages = nbPages;        
        } else {
          // TODO : throw exception and log error
          var errMess1 = "'nbPages' expects a non-null value.";
          console.error(errMess1);
          throw errMess1;
        }
      } catch (e) {
        // TODO : throw exception and log error
        var errMess2 = "Unable to retrieve the number of pages :\n%@".fmt(e);
        console.error(errMess2);
        throw errMess2;
      }
    }
    return nbPages;
  }.property('_numberOfPages'),
  
  
  /**
    @method
    
    Retrieve the Applet Id.

    @private
    @property {Integer} numberOfPages
    @returns {String} Return the Applet Id.
  */    
  _getAppletId: function () {
    var appId = this.get('_appletId');
    if (!appId) {
      appId = document.getElementById('appletId');
      if (appId) {
        this._appletId = appId;
      } else {
        // TODO : throw exception and log error
        var errMess = "Unable to retrieve the Applet with the 'appletId' id in the document!!";
        console.error(errMess);
        throw errMess;
      }
    }
    return appId;
  }.property('_appletId'),
  
  /**
    @method
  
    Updates the masterSelection binding if the currently page 
    has changed.
    
    @observes currentPage
  */
  _currentPageDidChange: function () {
    if (!SC.none(this.get('currentPage'))) {
      var cdmStore = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
      var q = SC.Query.create({ recordType: MvoEdge.CoreDocumentNode, 
        conditions: "sequenceNumber = " + this.get('currentPage')});
      var imageObjects = cdmStore.findAll(q);
     
      var coreDocumentNode = imageObjects.firstObject().get('guid');
      console.info("cdn : " + coreDocumentNode);

      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(MvoEdge.masterController.get('selectedObjectId')) ||
          coreDocumentNode !== MvoEdge.masterController.get('selectedObjectId')) {
        SC.RunLoop.begin();
        MvoEdge.masterController.set('selectedObjectId', coreDocumentNode);
        SC.RunLoop.end();
        console.info('MvoEdge.navigationController#_currentPageDidChange: %@'.
            fmt(this.get('currentPage')));
      }
    }
  }.observes('currentPage'),
  
  /**
    @method
    
    Updates master value by observing changes in master controller's
    master selection
    
    @observes masterValue
  */
  _masterValueDidChange: function () {
    // find the navigation that corresponds to the current master selection
    var currentNavigationValue = !SC.none(this.get('currentPage')) ?
        this.get('currentPage') : undefined;

    var currentMasterSelection = MvoEdge.masterController.get('selectedObjectId');
    console.info("currentMasterSelection : " + currentMasterSelection);
    
    if (!currentMasterSelection) {
      // TODO : throw exception and log error
      var errMess = "Unable to retrieve the masterSelection !!";
      console.error(errMess);
      throw errMess;      
    }
    
    var cdmObject = MvoEdge.store.find(MvoEdge.CoreDocumentNode, currentMasterSelection);
    
    if (!SC.none(cdmObject)) {
      var newPage = cdmObject.get('label');
 
      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(currentNavigationValue) ||
          (newPage && newPage !== currentNavigationValue)) {
        this._changePage(newPage);
               
        console.info('MvoEdge.navigationController#selectedObjectId: %@'.
            fmt(cdmObject.get('guid')));
      }
    }
  }.observes('MvoEdge.masterController.selectedObjectId'),  
  
  /**
    @method
    
    Change page.
    
    @param {Number} newPage
    @observes masterValue
  */
  _changePage: function (newPage) {
    var nbPages = this.getNumberOfPages();
    if (newPage >= 1 && newPage <= nbPages) {	
      var appId = this.get('_appletId');
      try {
        appId.gotoPage(newPage - 1);
        this.set('currentPage', newPage);
        var pdfRendererView =  MvoEdge.getPath('viewsPage.pdfRendererMainContentView.contentView');
        var height = pdfRendererView.get('isAdjusted');
        console.info('height 1 : ' + height);
        pdfRendererView.set('isAdjusted', MvoEdge.getPath('viewsPage.pdfRendererMainContentView')._scroll_contentHeight);
        console.info('height 2 : ' + pdfRendererView.get('heightMainPanel'));
      } catch (e) {
        // TODO : throw exception and log error
        var errMess = "Unable to go to the page '%@' :\n, %@".fmt(newPage, e);
        console.error(errMess);
        throw errMess;
      }        
    } else {
      // TODO : log warning
      console.warning("You are typed '%@'.\n You must type a valid page number between 1 to %@.".fmt(newPage, nbPages));
    }
  }
  
});
