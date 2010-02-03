/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
/*globals MvoEdge */
//require('views/content');
//require('views/thumbnail');
//require('views/thumbnailContent');
//require('views/tree');

MvoEdge.views = SC.Page.design({

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

  treeAndContentView: SC.SplitView.design({
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    autoresizeBehavior: SC.RESIZE_BOTTOM_RIGHT,
    defaultThickness: 200,
    topLeftMinThickness: 100,
    topLeftMaxThickness: 2000,
    dividerThickness: 20,
    canCollapseViews: NO,

    topLeftView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      childViews: [
        // this intermediate view level is required due to odd behavior of
        // the SplitdDivider view
        SC.View.design({
          layout: { top: 0, bottom: 0, left: 0, right: 0 },

          childViews: 'innerTree'.w(),
          innerTree: SC.ScrollView.design({
            layout: { top: 10, bottom: 10, left: 10, right: 10 },
            borderStyle: SC.BORDER_NONE,

            contentView: MvoEdge.TreeView.design({
              layout: { top: 0, bottom: 0, left: 0, right: 0 },
              rowHeight: 18,
              borderStyle: SC.BORDER_NONE,
              contentValueKey: 'label',
              contentBinding: 'MvoEdge.treeController.arrangedObjects',
              selectionBinding: 'MvoEdge.treeController.selection'
            })
          }),
          render: function (context, firstTime) {
            if (context.needsContent) {
              this.renderChildViews(context, firstTime);
              context.push(
                "<div class='top-edge'></div>",
                "<div class='right-edge'></div>",
                "<div class='bottom-edge'></div>",
                "<div class='left-edge'></div>");
            }
          }
        }).classNames('shadow_light inner_view'.w())
      ]
    }),

    bottomRightView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      childViews: [
        // this intermediate view level is required due to odd behavior of
        // the SplitdDivider view
        SC.View.design({
          layout: { top: 0, bottom: 0, left: 0, right: 0 },

          childViews: 'innerMainContent'.w(),
          innerMainContent: MvoEdge.ContentView.design({
            layout: { top: 10, bottom: 10, left: 10, right: 10 },
            borderStyle: SC.BORDER_NONE,

            contentView: SC.ImageView.design({
              layout: { top: 0, bottom: 0, centerX: 0, minWidth: 1 },
              useImageCache: NO
            })
          }),
          render: function (context, firstTime) {
            if (context.needsContent) {
              this.renderChildViews(context, firstTime);
              context.push(
                "<div class='top-edge'></div>",
                "<div class='right-edge'></div>",
                "<div class='bottom-edge'></div>",
                "<div class='left-edge'></div>");
            }
          }
        }).classNames('inner_content_view'.w())
      ]
    })
  }),

  /**
    Main content view
  */
  mainContentView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
    childViews: 'innerMainContent'.w(),
    innerMainContent: MvoEdge.ContentView.design({
      layout: { top: 10, bottom: 10, left: 10, right: 10 },
      borderStyle: SC.BORDER_NONE,

      contentView: SC.ImageView.design({
        layout: { top: 0, bottom: 0, centerX: 0, minWidth: 1 },
        useImageCache: NO
      })
    }),
    render: function (context, firstTime) {
      if (context.needsContent) {
        this.renderChildViews(context, firstTime);
        context.push(
          "<div class='top-edge'></div>",
          "<div class='right-edge'></div>",
          "<div class='bottom-edge'></div>",
          "<div class='left-edge'></div>");
      }
    }
  }).classNames('inner_content_view'.w()),
  
  /**
    Thumbnail view
  */
  thumbnailView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
    childViews: 'innerThumbnail'.w(),
    innerThumbnail: MvoEdge.ThumbnailView.design({
      layout: { top: 10, bottom: 10, left: 10, right: 10 },
      hasHorizontalScroller: NO,
      borderStyle: SC.BORDER_NONE,

      contentView: SC.ListView.design({
        layout: { top: 0, bottom: 0, left: 0, right: 0 },
        insertionOrientation: SC.VERTICAL_ORIENTATION,
        rowHeight: 130,
        exampleView: MvoEdge.ThumbnailContentView,
        //useImageCache: NO,
        contentBinding: 'MvoEdge.thumbnailController.arrangedObjects',
        selectionBinding: 'MvoEdge.thumbnailController.selection'
      })
    }),
    render: function (context, firstTime) {
      if (context.needsContent) {
        this.renderChildViews(context, firstTime);
        context.push(
          "<div class='top-edge'></div>",
          "<div class='right-edge'></div>",
          "<div class='bottom-edge'></div>",
          "<div class='left-edge'></div>");
      }
    }
  }).classNames('shadow_light inner_view'.w()),

  /**
    Tree view
  */
  treeView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: 'innerTree'.w(),
    innerTree: SC.ScrollView.design({
      layout: { top: 10, bottom: 10, left: 10, right: 10 },
      borderStyle: SC.BORDER_NONE,

      contentView: MvoEdge.TreeView.design({
        layout: { top: 0, bottom: 0, left: 0, right: 0 },
        rowHeight: 18,
        borderStyle: SC.BORDER_NONE,
        contentValueKey: 'label',
        contentBinding: 'MvoEdge.treeController.arrangedObjects',
        selectionBinding: 'MvoEdge.treeController.selection'
      })
    }),
    render: function (context, firstTime) {
      if (context.needsContent) {
        this.renderChildViews(context, firstTime);
        context.push(
          "<div class='top-edge'></div>",
          "<div class='right-edge'></div>",
          "<div class='bottom-edge'></div>",
          "<div class='left-edge'></div>");
      }
    }
  }).classNames('shadow_light inner_view'.w()),

  /**
    Navigation view
  */
  navigationView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: 'firstPageView previousPageView textPageView nextPageView lastPageView zoomPageView logos'.w(),
    
    firstPageView: SC.ButtonView.design({
      layout: { centerX: -75, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      icon: static_url('images/icons/beginning.png'),
      target: "MvoEdge.navigationController", 
      action: "goToFirstPage"
    }),
    
    previousPageView: SC.ButtonView.design({
      layout: { centerX: -40, centerY: 0,  width: 30, height: 25 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      icon: static_url('images/icons/previous.png'),
      target: "MvoEdge.navigationController", 
      action: "goToPreviousPage"
    }),    
    
    textPageView: SC.TextFieldView.design({ 
      layout: { centerX: 0, centerY: -1, width: 40, height: 20 },
      textAlign: SC.ALIGN_CENTER,
      hint: 'Page',
      valueBinding: 'MvoEdge.navigationController.currentPage',
      validator: 'Number'
    }),

    nextPageView: SC.ButtonView.design({
      layout: { centerX: 40, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      icon: static_url('images/icons/next.png'),
      target: "MvoEdge.navigationController", 
      action: "goToNextPage"
    }),

    lastPageView: SC.ButtonView.design({
      layout: { centerX: 75, centerY: 0, width: 30, height: 25 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      icon: static_url('images/icons/end.png'),
      target: "MvoEdge.navigationController", 
      action: "goToLastPage"
    }),    
    
    zoomPageView: SC.View.design({
      layout: { centerX: 150, centerY: 0, width: 105, height: 25 },
      layerId: "zoomPageId",
      
      childViews: 'zoomInPageView zoomOriginalPageView zoomOutPageView'.w(),
      
      zoomInPageView: SC.ButtonView.design({
        layout: { centerX: -35, centerY: 0, width: 30, height: 25 },
        layerId: "zoomInPageId",
        titleMinWidth : 0,
        needsEllipsis: NO,
        icon: static_url('images/icons/zoom-minus.png'),
        target: "MvoEdge.zoomController", 
        action: "doZoomOut"
      }),
      
      zoomOriginalPageView: SC.ButtonView.design({
        layout: { centerX: 0, centerY: 0, width: 30, height: 25 },
        layerId: "originalSizePageId",
        titleMinWidth : 0,
        needsEllipsis: NO,
        icon: static_url('images/icons/loupe.png'),
        target: "MvoEdge.zoomController", 
        action: "doZoomOriginal"
      }),      
      
      zoomOutPageView: SC.ButtonView.design({
        layout: { centerX: 35, centerY: 0, width: 30, height: 25 },
        layerId: "zoomOutPageId",
        titleMinWidth : 0,
        needsEllipsis: NO,
        icon: static_url('images/icons/zoom-plus.png'),
        target: "MvoEdge.zoomController", 
        action: "doZoomIn"
      })
      
    }),
    
    logos: SC.View.design({
      layout: { top: 0, height: 36, right: 6, width: 200 },

      childViews: [
        SC.View.design({
          layout: { top: 0, height: 36, right: 100, width: 100 },
          childViews: [
            SC.ImageView.design({
              layout: { top: 0, bottom: 0, left: 0, right: 0 },
              value: static_url('images/logo_rero_100x36_bw.png')
            })
          ],
          render: function (context, firstTime) {
            context.push("<a href='http://www.rero.ch/'>");
            this.renderChildViews(context, firstTime);
            context.push("</a>");
          }
        }),
        SC.View.design({
          layout: { top: 4, height: 32, right: 0, width: 80 },
          childViews: [
            SC.ImageView.design({
              layout: { top: 0, bottom: 0, left: 0, right: 0 },
              value: static_url('images/e-lib.ch_80x32_bw.png')
            })
          ],
          render: function (context, firstTime) {
            context.push("<a href='http://www.e-lib.ch/'>");
            this.renderChildViews(context, firstTime);
            context.push("</a>");
          }
        })
      ]
    })
    
  }),

  /**
    Metadata view
  */
  headerView: SC.View.design({
    childViews: 'metadataView logoView'.w(),

    metadataView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },

      childViews: [
        SC.LabelView.design({
          layout: { top: 10, height: 20, left: 10, right: 10 },
          isTextSelectable: YES,
          tagName: 'span',
          classNames: 'metadata_primary',
          contentBinding: 'MvoEdge.masterController.descriptiveMetadataDictionary',
          contentValueKey: 'title'
        }),
        SC.LabelView.design({
          layout: { top: 31, height: 20, left: 10, right: 10 },
          isTextSelectable: YES,
          tagName: 'span',
          classNames: 'metadata_secondary',
          contentBinding: 'MvoEdge.masterController.descriptiveMetadataDictionary',
          contentValueKey: 'creator'
        })
      ]
    }).classNames(''.w()),

    logoView: SC.View.design({
      isTextSelectable: YES,
      childViews: [
        SC.ImageView.design({
          layout: { top: 10, height: 29, right: 6, width: 140 },
          value: static_url('images/multivio_logo_140x29_bw')
        })
      ],
      render: function (context, firstTime) {
        context.push("<a href='https://www.multivio.org/'>");
        this.renderChildViews(context, firstTime);
        context.push("</a>");
      }
    })
  }),

  usageView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: [
      SC.LabelView.design({
        layout: { centerX: 0, centerY: 0, width: 700, height: 400 },
        classNames: 'mvo_info_full',
        contentBinding: 'MvoEdge.configurator',
        contentValueKey: 'usageText',
        escapeHTML: NO
      })
    ]
  }).classNames('mvo_info_full shadow'.w()),
  
  errorView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: [  
      SC.LabelView.design({
        layout: { centerX: 0, centerY: 0, width: 700, height: 50 },
        classNames: 'mvo_info_full',
        contentBinding: 'MvoEdge.errorController.serverMessage',
        contentValueKey: 'errorCode',
        escapeHTML: NO
      }),
      SC.LabelView.design({
        layout: { centerX: 0, centerY: 50, width: 700, height: 50 },
        classNames: 'mvo_info_full',
        contentBinding: 'MvoEdge.errorController.serverMessage',
        contentValueKey: 'errorMessage',
        escapeHTML: NO
      })
    ]
  }).classNames('mvo_info_full shadow'.w()),

  waitingView: SC.View.design({
    childViews: [
      SC.View.design({
        layout: { centerX: 0, centerY: 0, width: 500, height: 300 },
        //layout: { top: 200, bottom: 200, left: 200, right: 200 },
        classNames: 'mvo_info_full loading'.w(),
        childViews: [
          SC.LabelView.design({
            layout: { centerX: 0, centerY: -33, width: 230, height: 33 },
            tagName: 'div',
            value: '<h3>Fetching data...</h3>',
            escapeHTML: NO
          }),
          SC.ImageView.design({
            layout: { centerX: 0, centerY: 50, width: 36, height: 36 },
            value: static_url('images/progress_wheel_medium.gif'),
            classNames: ['mvo_info_full_progress']
          })
        ]
      })
    ]
  }),

  blankPane: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    classNames: 'blank-bg'.w()
  })

});

MvoEdge.waitingPane = SC.PanelPane.create({
  layout: { width: 500, height: 250, centerX: 0, centerY: 0 },

  contentView: SC.View.extend({
    childViews: [
      SC.LabelView.design({
        layout: { centerX: 0, centerY: -33, width: 230, height: 33 },
        tagName: 'h3',
        classNames: 'mvo_info_full'.w(),
        value: 'Fetching data...'
      }),
      SC.ImageView.design({
        layout: { centerX: 0, centerY: 50, width: 36, height: 36 },
        value: static_url('images/progress_wheel_medium.gif'),
        classNames: 'mvo_info_full_progress'.w()
      })
    ]
  }).classNames('mvo_info_full'.w())
});
