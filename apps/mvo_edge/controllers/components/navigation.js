/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  This controller is used to navigate in the document.

  @author fma
  @extends SC.ObjectController
  @since 0.0.1
*/
MvoEdge.navigationController = SC.ObjectController.create(
/** @scope MvoEdge.navigationController.prototype */ {

  /** 
    CurrentPage.
 
    @property {Integer}
    @default undefined
  */
  currentPage: undefined,
  
  oldPage: undefined,
  
  /** 
    Number of pages.
    
    @private
    
    @property {Integer}
    @default undefined
  */
  _numberOfPages: undefined,  
  
  /**
    Binds to the master selection.
    
    @property {MvoEdge.CoreDocumentNode}
   */
  contentBinding: SC.Binding.single("MvoEdge.masterController.masterSelection"),
 
  /**
    @method
    
    Updates currentPage by observing changes in master controller's
    master selection.
    
    @private
    
    @observes content
  */
  _contentDidChange: function () {
    // find the page that corresponds to the current master selection
    var currentNavigationValue = !SC.none(this.get('currentPage')) ?
        this.get('currentPage') : undefined;
    var currentMasterSelection = this.get('content');
    if (!SC.none(currentMasterSelection)) {
      var newPage = currentMasterSelection.get('sequenceNumber');
      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(currentNavigationValue) ||
          (!SC.none(newPage) && newPage !== currentNavigationValue)) {
        console.info('Change page %@ to %@'.fmt(currentNavigationValue, newPage));
        this.set('currentPage', newPage);
        console.info('MvoEdge.navigationController#_contentDidChange: %@'.
            fmt(currentMasterSelection.get('guid')));
      }    
    } else {
      // TODO : throw exception and log error
      var errMess = "Unable to retrieve the masterSelection !!";
      console.error(errMess);
      throw errMess; 
    }
    
  }.observes('content'),

  /**
    @method
    
    Updates content by observing changes in navigation controller's
    currentPage.
    
    @private
    
    @observes currentPage
  */  
  _currentPageDidChange: function () {
    if (!SC.none(this.get('currentPage'))) {
      var currentContent = this.get('content');
      if (SC.none(currentContent) ||
          this.get('currentPage') !== currentContent.get('sequenceNumber')) { 
        var cdmStore = MvoEdge.store.findAll(MvoEdge.CoreDocumentNode);
        var q = SC.Query.create({ recordType: MvoEdge.CoreDocumentNode, 
            conditions: "sequenceNumber = %@".fmt(this.get('currentPage'))});
        var imageObjects = cdmStore.findAll(q);
        var cdmObject = imageObjects.firstObject();
        if (!SC.none(cdmObject)) {
          console.info('Change masterSelection %@1 to %@2'.fmt(currentContent.get('guid'), cdmObject.get('guid')));
          SC.RunLoop.begin();
          this.set('content', cdmObject);
          SC.RunLoop.end();
          console.info('MvoEdge.navigationController#_currentPageDidChange: %@'.
            fmt(this.get('currentPage')));
        }
      }
    }
  }.observes('currentPage'),
  
  /**
    @method
    
    Go to the next page.
    
  */ 
  goToNextPage: function () {
    console.info(this.get('currentPage'));
    var np = this.get('currentPage') + 1;
    console.info(np);
    if (np <= this.get('_numberOfPages')) {
      this.set('currentPage', np);
    }
  },
  
  /**
    @method
    
    Go to the previous page.
    
  */    
  goToPreviousPage: function () {
    console.info(this.get('currentPage'));
    var pp = this.get('currentPage') - 1;
    console.info(pp);
    if (pp > 0) {
      this.set('currentPage', pp);
    }
  },
  
  /**
    @method
    
    Go to the first page.
    
  */    
  goToFirstPage: function () {
    console.info(this.get('currentPage'));
    var fp = 1;
    console.info(fp);
    this.set('currentPage', 1);
  },
  
  /**
    @method
    
    Go to the last page.
    
  */ 
  goToLastPage: function () {
    var nbp = this.get('_numberOfPages');
    this.set('currentPage', nbp);
  },
  
  /**
    @method
    
    Retrieve the number of pages.
    
    @private

    @property {Integer} _numberOfPages
    @returns {Integer} Return the number of pages.
  */ 
  _retrieveNumberOfPages: function () {
    var thumbnails = MvoEdge.store.findAll(MvoEdge.Thumbnail);
    return thumbnails.get('length');
  }.property('_numberOfPages').cacheable(),
  
  /**
    @method

    Initialize this controller, retrieve the number of pages

  */
  initialize: function () {
    this._numberOfPages = this.get('_retrieveNumberOfPages');
  }
  
});
