// ==========================================================================
// Project:   MvoEdge.Content
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  Define the maximum and the minimum size of the picture.
*/
MvoEdge.MAX_SIZE = 2000;
MvoEdge.MIN_SIZE = 100;

/** @class

  (Document Your View Here)

  @extends SC.ImageView
*/
MvoEdge.ContentView = SC.ImageView.extend(
/** @scope MvoEdge.Content.prototype */ {

  /**
    Binds to the zoomValue in the zoom controller.

    @property {Integer}
    @binding "MvoEdge.zoomController.factor"
   */
  zoomValueBinding: SC.Binding.oneWay('MvoEdge.zoomController.factor'), 
  
  /**
    Binds to the isZooming in the zoom controller.
  
    @property {Boolean}
    @binding "MvoEdge.zoomController.isZooming"
  */
  isZoomingBinding: SC.Binding.oneWay('MvoEdge.zoomController.isZooming'),
  
  /**
    Binds to the master selection
    
    @property {MvoEdge.CoreDocumentNode}
    @binding MvoEdge.masterController.masterSelection
  */
  masterSelectionBinding: "MvoEdge.masterController.masterSelection", 
  
  /** 
    Original width.

    @private
    @property {Integer}
    @default null
  */  
  _originalWidth: null,
  
  /** 
    Original height.

    @private
    @property {Integer}
    @default null
  */    
  _originalHeight: null,  
  
  /** 
    Complete picture.

    @property {Bool}
    @default NO
  */   
  isCompleting: NO,
  
  /** 
    Resize picture.

    @property {Bool}
    @default YES
  */     
  isResizing: NO,
  
  // make sure view will auto-rerender.
  displayProperties: 'isCompleting value'.w(),
  
  /**
    @method

    Render HTML.

    @param {SC.RenderContext} context The context of the view.
    @param {Boolean} firstTime True for the initialization.
  */  
  render: function (context, firstTime) {
    if (this.get('isCompleting') && !SC.none(this.get('masterSelection'))) {
      var tempIm = new Image();
      tempIm.src = this.get('value');
      var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
      if (tempIm.complete) {
        this._originalWidth = tempIm.width + 20;
        this._originalHeight = tempIm.height + 20;   
        console.info("width %@, height %@".fmt(this.get('_originalWidth'), this.get('_originalHeight')));
        div.adjust('width', this.get('_originalWidth'));
        div.adjust('height', this.get('_originalHeight'));
      }
    }
    sc_super();
  },
  
  /** 
    MouseEntered.

    @param {Event} the mouseEntered event.
  */    
  mouseEntered: function (evt) {
    if (!this.get('isResizing')) { 
      this.set('isCompleting', YES);
    }
    return YES; // so we get other events
  },
  
  /** 
    MouseExited.

    @param {Event} the mouseExited event.
  */     
  mouseExited: function () { 
    if (!this.get('isResizing')) { 
      this.set('isCompleting', YES);
    }
    return YES; // so we get other events   
  },
  
  /**
    @method

    Zoom in the picture.

    @observes zoomValue
  */  
  doZoom: function () {
    var zoomVal = this.get('zoomValue');
    if (!SC.none(zoomVal)) {
      var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
      var wd = div.get('layer').width;
      var hg = div.get('layer').height;
      if (SC.none(this.get('_originalWidth'))) {
        this._originalWidth = wd;
        this._originalHeight = hg; 
      }        
      if (zoomVal === 1) {
        if (wd !== this.get('_originalWidth')) {
          this.set('isResizing', YES);
          div.adjust('width', this.get('_originalWidth'));
          div.adjust('height', this.get('_originalHeight'));  
        }
      } else {
        wd = wd * zoomVal;
        if (wd > MvoEdge.MAX_SIZE) {
          console.info("%@ > maxWidth [%@]".fmt(wd, MvoEdge.MAX_SIZE));
          return;
        }
        if (wd < MvoEdge.MIN_SIZE) {
          console.info("%@ < minWidth [%@]".fmt(wd, MvoEdge.MIN_SIZE));
          return;
        }
        hg = hg * zoomVal;
        this.set('isResizing', YES);        
        div.adjust('width', wd);
        div.adjust('height', hg);
			} 
    }
  }.observes('zoomValue', 'isZooming'),

  // TODO: is this view method the best way to add scroll  
  /**
    If the master selection changes, readjust the size of the view

    @private
    @observes masterSelection
  */
 /* _contentDidChange: function () {
    var div = MvoEdge.getPath('viewsPage.mainContentView.contentView');
    var tempIm = new Image();
    if (!SC.none(this.get('content'))) {
      tempIm.src = this.get('content').get('staticUrl');
      if (tempIm.complete) {
        div.adjust('width', tempIm.width + 20);
        div.adjust('height', tempIm.height + 20);
      }
      console.info('contentController#_contentDidChange: %@'.
          fmt(this.get('content').get('guid')));
    }
  }.observes('content')*/
  
  /**
    @method
    
    Retrieve the width of parentView.
    
    @private
    
    @returns {Integer} Return the width of parentView.
  */  
  _getParentWidth: function (div) {
    return div.get('layer').offsetWidth;
  },
  
  /**
    @method
    
    Retrieve the height of parentView.
    
    @private
    
    @returns {Integer} Return the height of parentView.
  */  
  _getParentHeight: function (div) {
    return div.get('layer').offsetHeight;
  },
  
  /**
    @method
    
    Updates value by observing changes in master controller's master
    selection
    
    @observes masterSelection
  */
  _masterSelectionDidChange: function () {
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      var defaultUrl = currentMasterSelection.get('urlDefault');
      var imageUrl = MvoEdge.configurator.getImageUrl(defaultUrl);
      SC.RunLoop.begin();
      this.set('value', imageUrl);
      this.set('isCompleting', NO);
      this.set('isResizing', NO);
      SC.RunLoop.end();
    }
    MvoEdge.logger.debug('ContentView#_masterSelectionDidChange: %@'.
        fmt(this.get('masterSelection').get('guid')));
  }.observes('masterSelection')
});