// ==========================================================================
// Project:   MvoEdge.thumbnail Unit Test
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge module test ok equals same stop start */

var myThumbnailController, myMasterController, rec, sel1, rec2, sel2;

module("Test thumbnailController", {
  setup: function () {
    myMasterController = MvoEdge.masterController;
    myMasterController.initialize();
    
    myThumbnailController = MvoEdge.thumbnailController;
    myThumbnailController.initialize();
        
    rec = MvoEdge.store.find(MvoEdge.Thumbnail, 'f00001');
    sel1 = SC.SelectionSet.create().addObject(rec);
    
    rec2 = MvoEdge.store.find(MvoEdge.Thumbnail, 'f00002');
    sel2 = SC.SelectionSet.create().addObject(rec2);
  },
  
  teardown: function () {
    rec = null;
    sel1 = null;
    rec2 = null;
    sel2 = null;

    MvoEdge.store.reset();
 
    myMasterController = null;
    myThumbnailController = null;
  }
});

test("_selectionDidChange method with no selection and no masterSelection", function () {
  myThumbnailController._selectionDidChange();
  equals(myMasterController.get('masterSelection'), undefined, "shouldn't find the record (no selection and no masterSelection)");
}); 

test("_selectionDidChange method with a masterSelection and no selection", function () {  
  SC.RunLoop.begin();
  myMasterController.set('masterSelection', 'n00004');
  SC.RunLoop.end();
  equals(myThumbnailController.get('selection').firstObject(), sel1.firstObject(), "should find the record");
});

test("_selectionDidChange method with two different selection", function () {  
  SC.RunLoop.begin();
  myThumbnailController.set('selection', sel1);
  SC.RunLoop.end();
  equals(myMasterController.get('masterSelection'), 'n00004', "should find the record");
  
  SC.RunLoop.begin();
  myThumbnailController.set('selection', sel2);
  SC.RunLoop.end();
  ok(myMasterController.get('masterSelection') !== 'n00004', "shouldn't find the 'n00004' record but the 'n00006' record");
});

test("_masterSelectionDidChange method with a selection and no masterSelection", function () {
  SC.RunLoop.begin();
  myThumbnailController.set('selection', sel1);
  SC.RunLoop.end();
  equals(myMasterController.get('masterSelection'), 'n00004', "should find the selection");
});

test("_masterSelectionDidChange method with two different masterSelection", function () {
  SC.RunLoop.begin();
  myMasterController.set('masterSelection', 'n00004');
  SC.RunLoop.end();
  equals(myThumbnailController.get('selection').firstObject().get('id'), 'f00001', "should find the selection");
  
  SC.RunLoop.begin();
  myMasterController.set('masterSelection', 'n00006');
  SC.RunLoop.end();
  ok(myThumbnailController.get('selection').firstObject().get('id') !== 'f00001', "shouldn't find the 'f00001' selection but the 'f00002' selection");
});
