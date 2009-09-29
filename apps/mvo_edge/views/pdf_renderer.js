/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/
require('models/core_document_node');

/**
  @class

  Specific view for PDFRenderer.

  @author fma
  @extends SC.View
  @since 0.0.1
*/
MvoEdge.PDFRendererView = SC.View.extend(
/** @scope MvoEdge.PDFRendererView.prototype */ {

  /** 
    Applet Id.
 
    @private
    @property {String}
    @default undefined
  */
  _appletId: undefined,  
  
  /** 
    Number of pages.
    
    @private
    
    @property {Integer}
    @default undefined
  */
  _numberOfPages: undefined,  
  
  /**
    CurrentPage.
    
    @private
    
    @property {String}
    @default undefined
  */
  _currentPage: undefined,
  
  /**
    Binds to the zoomValue in the zoom controller.
    
    @property {Integer}
   */
  zoomValueBinding: SC.Binding.oneWay('MvoEdge.zoomController.content'),    

  /**
    Check if the view should be adjusted.
 
    @property {Integer}
    @default undefined
  */
  heightMainPanel: undefined,
  
  /**
    Check if the view should be adjusted.
 
    @property {Boolean}
    @default NO
  */  
  autoResize: NO,
  
  /**
    Make sure view will auto-rerender.
    
    @property {Array}
  */  
  displayProperties: 'autoResize'.w(),

  /**
    @method
    
    Render HTML.
    
    @param {SC.RenderContext} context The context of the view.
    @param {Boolean} firstTime True for the initialization.
  */
  render: function (context, firstTime) {
    console.log('PDFRendererView render :');
    
    var wd = MvoEdge.getPath('viewsPage.pdfRendererMainContentView')._scroll_contentWidth;
		// Max Width : 800
		if (wd && wd > 800) {
			wd = 800;
		}
		var hg = MvoEdge.getPath('viewsPage.pdfRendererMainContentView')._scroll_contentHeight;
		// Max Height : 800
		if (hg && hg > 800) {
			hg = 800;
		}

		if (firstTime) {
      console.info('Build the Applet');
    
      // Retrieve the url of the PDF document from the CDM
      var cdmStore = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
      var q = SC.Query.create({ recordType: MvoEdge.CoreDocumentNode, 
          conditions: "urlDefault != undefined"});
      var cdmObjects = cdmStore.findAll(q);
        
      if (!cdmObjects.firstObject()) {
        // TODO : throw exception and log error
        var errMess = "Unable to retrieve the 'urlDefault' !!";
        console.error(errMess);
        throw errMess;   
      }
 
      var url = cdmObjects.firstObject().get('urlDefault'); 
      
			context = context.begin('div').attr('align', 'center');
			context = context.begin('applet').attr('id', 'appletId').
          attr('name', 'pdfRendererApplet').
          attr('code', 'com.rero.ch.pdfrenderer.MyPDFViewerApplet.class').
          attr('width', wd - 20).
          attr('height', hg - 20).
          attr('archive', 'pdf_renderer/PDFRenderer-2009_06_07.jar,pdf_renderer/MyPDFViewerApplet.jar');
      context = context.begin('param').attr('name', 'url').
          attr('value', "%@".fmt(url)).end(); // End of param tag
			context = context.end(); // End of applet tag
			context = context.end(); // End of div tag
		} else {
      var appId = this.get('_getAppletId');
			appId.width = wd - 20;
			appId.height = hg - 20;
		}
		sc_super();
	},
  
  /**
    @method
    
    If the master selection changes, readjust the size of the view
    and go to specific page if it's necessary.

    @private
    
    @observes content
  */
  _contentDidChange: function () {
    console.info("Call _contentDidChange");
    if (!SC.none(this.get('content'))) {
      var tmp = this.get('autoResize') ? this.set('autoResize', NO) : this.set('autoResize', YES);
      console.info('Resize the view');
      tmp = this.get('_currentPage');
      var sq = this.getPath('content.sequenceNumber');
      if (SC.none(tmp) || tmp !== sq) {
        this.goToPage(sq);
        //Update _currentPage
        this._currentPage = sq;
      }
    }
  }.observes('content'),
  
  /**
    @method
    
    Retrieve the Applet Id.

    @private
    
    @property {String} _appletId The Applet Id.
    @returns {String} Return the Applet Id.
  */    
  _getAppletId: function () {
    var appId = this.get('_appletId');
    if (SC.none(appId)) {
      appId = document.getElementById('appletId');
      if (!SC.none(appId)) {
        this._appletId = appId;
      } else {
        // TODO : throw exception and log error
        var errMess = "Unable to retrieve the Applet with the 'appletId' id in the document!!";
        console.error(errMess);
        throw errMess;
      }
    }
    return appId;
  }.property('_appletId').cacheable(),
  
  /**
    @method
    
    Retrieve the number of pages.

    @property {Integer} _numberOfPages The number of pages.
    @returns {Integer} Return the number of pages.
  */  
  retrieveNumberOfPages: function () {
    var nbPages = this.get('_numberOfPages');
    if (SC.none(nbPages)) {    
      var appId = this.get('_getAppletId');
      try {
        // Call Applet method
        nbPages = appId.getNbPages();
        if (!SC.none(nbPages)) {
          this._numberOfPages = nbPages; 
          console.info('There are %@ pages.'.fmt(nbPages));
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
  }.property('_numberOfPages').cacheable(),

  /**
    @method
    
    Change page.
    
    @private
    
    @param {Integer} newPage The new page.
  */
  _changePage: function (newPage) {
    var nbPages = this.get('retrieveNumberOfPages');
    if (newPage >= 1 && newPage <= nbPages) {	
      var appId = this.get('_appletId');
      try {
        appId.gotoPage(newPage - 1);
      } catch (e) {
        // TODO : throw exception and log error
        var errMess = "Unable to go to the page '%@' :\n, %@".fmt(newPage, e);
        console.error(errMess);
        throw errMess;
      }        
    } else {
      // TODO : log warning
      console.warn("You are typed '%@'.\n You must type a valid page number between 1 to %@.".fmt(newPage, nbPages));
    }
  },  

  /**
    @method
    
    Go to page.
    
    @param {Integer} newPage The new page.
  */  
  goToPage: function (newPage) {
    console.info("Go To Page '%@'".fmt(newPage));
    this._changePage(newPage);
  },

  /**
    @method
    
    Do zoom.
    
    @observes zoomValue
  */  
  doZoom: function () {
    if (!SC.none(this.get('zoomValue'))) {
      this._doZoom(this.get('zoomValue'));
    }
  }.observes('zoomValue'),
  
  /**
    @method
    
    Zoom in the applet.
    
    @private
    
    @param {Integer} zoomVal The value of the zoom.
  */
  _doZoom: function (zoomVal) {
    var appId = this.get('_getAppletId');
    try {
      appId.doZoom(zoomVal);
    } catch (e) {
      // TODO : throw exception and log error
      var errMess = "Unable to zoom with the value %@ :\n%@".fmt(zoomVal, e);
      console.error(errMess);
      throw errMess;
    }      
  }

});