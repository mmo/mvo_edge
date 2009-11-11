// ==========================================================================
// Project: MvoEdge
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */
 

/**
@class
 
User Communication. This class is used to establish the communication between the user
and the application. 
 
@author {FCA}
@extends {Object}
@since {0.1.0}
*/
 
MvoEdge.usco = SC.Object.create(
/** @scope MvoEdge.logger.prototype */ {
 
  errorLogger: undefined,
  warningLogger: undefined,
  infoLogger: undefined,
  debugLogger: undefined,
 
  loggers: [],
 
  /**
@method
 
TO DO
*/
  
  
  init: function () {
    
  },
  
 
  /**
@method showAlertPaneError, showAlertPaneWarn, showAlertPaneInfo,

display alert panel with different icon and button according to the case
 
@param message panel main message
@param description  panel secondary message
*/
  
  showAlertPaneWarn: function (message, description) {
    var pane = SC.AlertPane.warn("%@".loc(message), '%@ '.loc(description), '', "OK", "Cancel", '', this);      
    pane.append();
  },

  showAlertPaneError: function (message, description) {
    var pane = SC.AlertPane.error("%@".loc(message), '%@ '.loc(description), '', "OK", "", '', this);      
    pane.append();
  },

  showAlertPaneInfo: function (message, description) {
    var pane = SC.AlertPane.info("%@".loc(message), '%@ '.loc(description), '', "OK", "", '', this);      
    pane.append();
  },

/**
@method 

displays an alert w/o any icon
 
@param message panel main message
@param description  panel secondary message
*/
  
  showAlertPanePlain: function (message, description, caption) {
    var pane = SC.AlertPane.plain("AlertPane.message", 'AlertPane.description', 'AlertPane.caption', "OK", "Cancel", 'Other...', this);      
    pane.append();
  },
  
  /**
@method 

displays an alert with a customizable icon to the left
 
@param message panel main message
@param description  panel secondary message
*/
  
  showAlertPaneShow: function () {
    var pane = SC.AlertPane.show("AlertPane.message", 'AlertPane.description', 'AlertPane.caption', "OK", "Cancel", 'Other...', 'sc-icon-tools-24', this); 
    pane.append();
  },
 
});
 