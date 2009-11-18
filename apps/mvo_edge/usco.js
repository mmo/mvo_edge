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
 
MvoEdge.usco2 = SC.Object.create(
/** @scope MvoEdge.logger.prototype */ {

  panelType: undefined,  
  
  parameters: [],

  /**
@method
 
TO DO
*/
  
  
  init: function () {
    
  },
  
 
  /**
@method showAlertPaneError, showAlertPaneWarn, showAlertPaneInfo, showAlertPanePlain, showAlertPaneShow

display alert panel with different icon (PaneError, PaneWarn, PaneInfo), without icon (PanePlain),
or with a customizable icon to the left (PaneShow)
 
@param message panel main message
@param description  panel description message
@param caption panel caption
@param button1 text inside button1 (tipically in the "OK" position)
@param button2 text inside button2 (tipically in the "Cancel" position)
@param button3 text inside button3 (tipically in the "Other..." position)
@param controller reference to the controller used to manage the click event on the several buttons

@param newIcon (only PaneShow) icon class name (see http://demo.sproutcore.com/sample_controls/ -> icon)

*/
  
  showAlertPaneError: function (message, description, caption, button1, button2, button3, controller) {
    this.panelType = 'error';
    this._paramInVector(message, description, caption, button1, button2, button3, controller);
    this._alertPaneCostructor('sc-icon-error-48');
  },
  
  showAlertPaneWarn: function (message, description, caption, button1, button2, button3, controller) {
    this.panelType = 'warn';
    this._paramInVector(message, description, caption, button1, button2, button3, controller);
    this._alertPaneCostructor('sc-icon-alert-48');
  },
  
  showAlertPaneInfo: function (message, description, caption, button1, button2, button3, controller) {
    this.panelType = 'info';
    this._paramInVector(message, description, caption, button1, button2, button3, controller);
    this._alertPaneCostructor('sc-icon-info-48');
  },
  
  showAlertPanePlain: function (message, description, caption, button1, button2, button3, controller) {
    this.panelType = 'plain';
    this._paramInVector(message, description, caption, button1, button2, button3, controller);
    this._alertPaneCostructor("");
  },

  showAlertPaneShow: function (message, description, caption, button1, button2, button3, controller, newIcon) {
    this.panelType = 'custom';
    this._paramInVector(message, description, caption, button1, button2, button3, controller);
    this._alertPaneCostructor(newIcon);
  },

  /**
@method 
build a different Pane according to the case

@param panelType kind of panel tu build
@param icon icon class name

*/  
 
  _alertPaneCostructor: function (icon) {
    var settings = '';
    switch (this.panelType) {
    case 'error':
      settings = MvoEdge.CONFIG.usco.error;
      this._filterSettings(settings);
      break;
    case 'warn' :
      settings = MvoEdge.CONFIG.usco.warn;
      this._filterSettings(settings);
      break;
    case 'info':
      settings = MvoEdge.CONFIG.usco.info;
      this._filterSettings(settings);
      break;
    case 'plain':
      settings = MvoEdge.CONFIG.usco.simple;
      this._filterSettings(settings);
      break;
    case 'custom':
      break;
    default:
      MvoEdge.logger.error("panelType undefined!");
    }
    var pane = SC.AlertPane.show('%@'.loc(this.parameters[0]), '%@'.loc(this.parameters[1]),
        '%@'.loc(this.parameters[2]), '%@'.loc(this. parameters[3]), '%@'.loc(this.parameters[4]),
        '%@'.loc(this.parameters[5]), icon, this.parameters[6]);
    pane.append();
  },
 
/**
  @method 
put the input parameters in a vector

*/  
  _paramInVector: function (message, description, caption, button1, button2, button3, controller) {
    this.parameters[0] = (message);
    this.parameters[1] = (description);
    this.parameters[2] = (caption);
    this.parameters[3] = (button1);
    this.parameters[4] = (button2);
    this.parameters[5] = (button3);
    this.parameters[6] = (controller);
  },

  /**
@method 
according to the CONFIG selects witch information to display in the Pane 

@param settings vector with the configuration set in the configuration file

*/  
  
  _filterSettings: function (settings) {
    var i = 0;
    var value = "";
    for (var setting in settings) {
      if (settings.hasOwnProperty(setting)) {
        value = settings[setting];
        if (value !== 'free') {
          this.parameters[i] = value;
        }
        i++;
      }
    }
  }
  
  
});