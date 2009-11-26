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
 
  /**
    @method showAlertPaneError, showAlertPaneInfo,
 
    display alert panel with different icon and button, according to the case
    @param message panel main message
    @param description panel secondary message
    @param button1 text inside button1 (tipically in the "OK" position)
  */
  showAlertPaneError: function (message, description, button1) {
    var pane = SC.AlertPane.error('%@'.loc(message), '%@'.loc(description), '', '%@'.loc(button1), '', '', this);
    pane.append();
  },
 
  showAlertPaneInfo: function (message, description, button1) {
    var pane = SC.AlertPane.info('%@'.loc(message), '%@'.loc(description), '', '%@'.loc(button1), '', '', this);
    pane.append();
  },
  
    /**
    @method showAlertPaneWarn
 
    display a warn panel
    @param message panel main message
    @param description panel secondary message
    @param button1 text inside button1 (tipically in the "OK" position)
    @param button2 text inside button2 (tipically in the "Cancel" position)
    @param controller reference to the controller used to manage the click event

  */

  
  showAlertPaneWarn: function (message, description, button1, button2, controller) {
    var pane = SC.AlertPane.warn('%@'.loc(message), '%@'.loc(description), '', '%@'.loc(button1), '%@'.loc(button2), '', controller);
    pane.append();
  },
 
  /**
    @method showAlertPanePlain
 
    displays an alert w/o any icon
    @param message panel main message
    @param description panel secondary message
    @param button1 text inside button1 (tipically in the "OK" position)
    @param button2 text inside button2 (tipically in the "Cancel" position)
    @param controller reference to the controller used to manage the click event
  */
  
  showAlertPanePlain: function (message, description, button1, button2, controller) {
    var pane = SC.AlertPane.plain('%@'.loc(message), '%@'.loc(description), '', '%@'.loc(button1), '%@'.loc(button2), '', controller);
    pane.append();
  }

});
 