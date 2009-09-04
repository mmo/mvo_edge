// ==========================================================================
// Project:   MvoEdge - views
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
require('views/tree');

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
    
    contentView: SC.ImageView.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      contentBinding: 'MvoEdge.masterController.selectedObject',
      contentValueKey: 'url'
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
      classNames: 'yui-skin-sam',
      //id is not used
      id: 'treeId'
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
