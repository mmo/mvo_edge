// ==========================================================================
// Project:   MvoEdge - views
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
//require('views/tree');
//require('views/content');
//require('views/pdf_renderer');

MvoEdge.viewsPage = SC.Page.design({

  /**
    Title view
  */
  titleView: SC.LabelView.design({
    layout: { left: 20, top: 10 },
    classNames: '',
    tagName: 'h3',
    tooltip: 'This is the title',
    value: 'Multivio prototype Edge'
  }),

  /**
    Main content view
  */
  mainContentView: SC.ScrollView.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
    contentView: MvoEdge.ContentView.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      contentBinding: 'MvoEdge.masterController.masterSelection',
      contentValueKey: 'staticUrl'
    })
  }),
  
  /**
    HTML main content view
  */
  htmlMainContentView: SC.ScrollView.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
    contentView: SC.WebView.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      contentBinding: 'MvoEdge.masterController.selectedObject',
      contentValueKey: 'url'
    })
  }),

  /**
    PDFRenderer Main content view
  */
  pdfRendererMainContentView: SC.ScrollView.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
				  
    contentView: MvoEdge.PDFRendererView.design({
	  	layerId: 'PdfRendererId'
    })
  }),
  
  /**
    Thumbnail view
  */
  thumbnailView: SC.ScrollView.design({
    hasHorizontalScroller: NO,
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    contentView: SC.ListView.design({
      layout: { top: 0, bottom: 0, left: 5, right: 5 },
      insertionOrientation: SC.VERTICAL_ORIENTATION,
      rowHeight: 100,
      columnWidth: 60,
      exampleView: SC.ImageView,
      contentBinding: 'MvoEdge.thumbnailController.arrangedObjects',
      selectionBinding: 'MvoEdge.thumbnailController.selection',
      contentValueKey: 'url'    
    })
  }),
  
  /**
    HTML thumbnail view
  */
  htmlThumbnailView: SC.ScrollView.design({
    hasHorizontalScroller: NO,
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    contentView: SC.ListView.design({
      layout: { top: 0, bottom: 0, left: 5, right: 5 },
      insertionOrientation: SC.VERTICAL_ORIENTATION,
      rowHeight: 25,
      columnWidth: 30,
      exampleView: SC.LabelView.design({
        textAlign: SC.ALIGN_CENTER
      }),
      contentBinding: 'MvoEdge.thumbnailController.arrangedObjects',
      selectionBinding: 'MvoEdge.thumbnailController.selection',
      contentValueKey: 'label'
    })
  }),

  /**
    Tree view
  */
  treeView: SC.ScrollView.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    contentView: MvoEdge.TreeView.design({
      classNames: 'yui-skin-sam'
    })
  }),
  
  /**
    Navigation view
  */
  navigationView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: 'firstPageView previousPageView textPageView nextPageView lastPageView zoomPageView'.w(),
    
    firstPageView: SC.ButtonView.design({
      layout: { centerX: -70, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 30,
      title: "<<",
      target: "MvoEdge.navigationController", 
      action: "goToFirstPage" 
    }),
    
    previousPageView: SC.ButtonView.design({
      layout: { centerX: -35, centerY: 0,  width: 30, height: 25 },
      titleMinWidth : 30,
      title: "<",
      target: "MvoEdge.navigationController", 
      action: "goToPreviousPage"
    }),
    
    textPageView: SC.TextFieldView.design({ 
      layout: { centerX: 0, centerY: 0, width: 30, height: 20 },
      isEditing: YES,
      textAlign: SC.ALIGN_CENTER,
      hint: "Page",
      tagName: "h3", 
      value: "1",
      valueBinding: "MvoEdge.navigationController.currentPage",
      validator: 'Number'
    }),  
    
    nextPageView: SC.ButtonView.design({
      layout: { centerX: 35, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 30,
      title: ">",      
      target: "MvoEdge.navigationController", 
      action: "goToNextPage"
    }),
    
    lastPageView: SC.ButtonView.design({
      layout: { centerX: 70, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 30,
      title: ">>",
      target: "MvoEdge.navigationController", 
      action: "goToLastPage"
    }),
    
    zoomPageView: SC.ToolbarView.design({
      layout: { centerX: 140, centerY: 0, width: 105, height: 25 },
      layerId: "zoomPageId",
      
      childViews: 'zoomInPageView originalSizePageView zoomOutPageView'.w(),
      
      zoomInPageView: SC.ButtonView.design({
        layout: { centerX: -35, centerY: 0, width: 30, height: 25 },
        layerId: "zoomInPageId",
        titleMinWidth : 30,
        title: "-",
        target: "MvoEdge.navigationController", 
        action: "doZoomIn"
      }),
      
      originalSizePageView: SC.ButtonView.design({
        layout: { centerX: 0, centerY: 0, width: 30, height: 25 },
        layerId: "originalSizePageId",
        titleMinWidth : 30,
        title: "o",
        target: "MvoEdge.navigationController", 
        action: "retrieveOriginalSize"
      }),      
      
      zoomOutPageView: SC.ButtonView.design({
        layout: { centerX: 35, centerY: 0, width: 30, height: 25 },
        layerId: "zoomOutPageId",
        titleMinWidth : 30,
        title: "+",
        target: "MvoEdge.navigationController", 
        action: "doZoomOut"
      })
      
    })
      
  }),

  /**
    Metadata view
  */
  metadataView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
    childViews: [
      SC.LabelView.design({
        layout: { top: 10, height: 20, left: 10, right: 10 },
        tagName: 'span',
        classNames: 'workspace metadata_primary',
        contentBinding: 'MvoEdge.masterController.descriptiveMetadataDictionary',
        contentValueKey: 'title'
      }),
      SC.LabelView.design({
        layout: { top: 31, height: 20, left: 10, right: 10 },
        tagName: 'span',
        classNames: 'workspace metadata_secondary',
        contentBinding: 'MvoEdge.masterController.descriptiveMetadataDictionary',
        contentValueKey: 'creator'
      })
    ]
  }).classNames('workspace'.w())

});
