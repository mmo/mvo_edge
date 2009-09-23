// ==========================================================================
// Project:   MvoEdge.PDFRendererView
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge */
require('models/core_document_node');

/** @class

  Specific view for PDFRenderer solution.

  @extends SC.View
*/
MvoEdge.PDFRendererView = SC.View.extend(
/** @scope MvoEdge.PDFRendererView.prototype */ {

  /**
    Check if the view should be adjusted.
 
    @property {Boolean}
    @default NO
  */
  isAdjusted: NO,
  
  /**
    Make sure view will auto-rerender.
    
    @property {}
  */  
  displayProperties: 'isAdjusted'.w(),

  /**
    @method
    
    Render HTML.
    
    @param {SC.RenderContext} context
    @param {Boolean} firstTime
  */
  render: function (context, firstTime) {
    console.log('PDFRendererView render :');
    
    //var i = this.get('isAdjusted');
    //console.info('hmp : ' + hmp);

    // Retrieve the url of the PDF document from the CDM
    var cdmStore = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
    var q = SC.Query.create({ recordType: MvoEdge.CoreDocumentNode, 
        conditions: "urlDefault != ''"});
    var cdmObjects = cdmStore.findAll(q);
        
    if (!cdmObjects.firstObject()) {
      // TODO : throw exception and log error
      var errMess = "Unable to retrieve the 'urlDefault' !!";
      console.error(errMess);
      throw errMess;   
    }

    //var url = "file:///D:/Tests/Test_ADOBE_PDF/ThinkingInPostScript.pdf";
    //var url = "http://www.rightbrain.com/download/books/ThinkingInPostScript.pdf";
    var url = cdmObjects.firstObject().get('urlDefault');
		
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
      console.info('FirstTime');
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
			var awd = document.appletId.width;
			if (wd && wd < awd) {
				document.appletId.width = wd - 20;
			} 
			var ahg = document.appletId.height;
			if (hg && hg < ahg) {
				document.appletId.height = hg - 20;
			}
		}
		sc_super();
	},
  
  retrieveHeightMainPanel: function () {
    console.info('retrieveHeightMainPanel');
    var hg = this.get('heightMainPanel');
    console.info('HG : ' + hg);
  }.observes('heightMainPanel')

});