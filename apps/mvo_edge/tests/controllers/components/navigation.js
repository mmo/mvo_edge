/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

var myNavigationController;

module("Test navigationController", {
  setup: function () {
    myNavigationController = MvoEdge.navigationController;
    SC.Observers.suspendPropertyObserving();
    myNavigationController.set('currentPage', 1);
    myNavigationController._numberOfPages = 51;
    SC.Observers.resumePropertyObserving();
  },
  
  teardown: function () {
    delete myNavigationController;
  }
});

test("goToLastPage method", function() {
  myNavigationController.goToLastPage();
  equals(myNavigationController.get('currentPage'), 51, "should find the last pages");
});

test("goToFirstPage method", function() {
  myNavigationController.goToFirstPage();
  equals(myNavigationController.get('currentPage'), 1, "should find the first page");
});

test("goToNextPage method", function() {
  myNavigationController.goToNextPage();
  equals(myNavigationController.get('currentPage'), 2, "should find the page '2'");
});

test("goToPreviousPage method", function() {
  myNavigationController.goToPreviousPage();
  equals(myNavigationController.get('currentPage'), 1, "should find the page '1'");
});