/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

var myZoomController;

module("Test zoomController", {
  setup: function () {
    myZoomController = MvoEdge.zoomController;
    SC.Observers.suspendPropertyObserving();
    myZoomController.set('isZooming', NO);
    myZoomController.set('factor', null);
    SC.Observers.resumePropertyObserving();
  },
  
  teardown: function () {
    delete myZoomController;
  }
});

test("_changeZoom method", function () {
  var oldVal = myZoomController.get('isZooming');
  myZoomController._changeZoom();
  ok(myZoomController.get('isZooming') !== oldVal, "should find the zoom status");
});

test("doZoomIn method", function () {
  myZoomController.doZoomIn();
  equals(myZoomController.get('factor'), MvoEdge.ZOOM_IN, "should find the zoomIn factor with the input zoom value 'null'");
  
  myZoomController.doZoomIn();
  console.info('FACTOR IN : ' + myZoomController.get('factor'));
  equals(myZoomController.get('isZooming'), YES, "should change the zoom status");  
    
  myZoomController.set('factor', 2);
  myZoomController.doZoomIn();
  equals(myZoomController.get('factor'), MvoEdge.ZOOM_IN, "should find the zoomIn factor with the input zoom value '2'");
});

test("doZoomOut method", function () {
  myZoomController.doZoomOut();
  equals(myZoomController.get('factor'), MvoEdge.ZOOM_OUT, "should find the zoomOut factor with the input zoom value 'null'");
  
  myZoomController.doZoomOut();
  console.info('FACTOR OUT : ' + myZoomController.get('factor'));
  equals(myZoomController.get('isZooming'), YES, "should change the zoom status");   
  
  myZoomController.set('factor', 2);
  myZoomController.doZoomOut();
  equals(myZoomController.get('factor'), MvoEdge.ZOOM_OUT, "should find the zoomOut factor with the input zoom value '2'");  
});

test("retrieveOriginalSize method", function () {
  myZoomController.retrieveOriginalSize();
  ok(myZoomController.get('factor') !== MvoEdge.ORIGINAL_SIZE, "shouldn't find the zoom factor");
  
  myZoomController.set('factor', 2);
  myZoomController.retrieveOriginalSize();
  equals(myZoomController.get('factor'), MvoEdge.ORIGINAL_SIZE, "should find the zoom factor with the input zoom value '2'");  
});