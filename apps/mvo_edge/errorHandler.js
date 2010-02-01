// ==========================================================================
// Project:   MvoEdge.masterController
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/**
  @class

  Controller for errors that occured on the server side.

  @author CHE
  @extends {SC.ArrayController}
  @since 0.1.0
*/

MvoEdge.errorHandler = SC.ArrayController.create(
/** @scope MvoEdge.errorHandler.prototype */ {
  
  /**
    @method

    Initialize the content of the controller

    @param {SC.RecordArray} nodes records of the Core Document Model
  */
  initialize: function (nodes) {
    this.set('content', nodes);
    MvoEdge.logger.info('errorHandler initialized');
  },

  /**
    @method
    
    Return the serverMessage that contains infomation about the error
    
    @property {Hash} serverMessage
  */
  serverMessage: function () {
    return this.get('content').firstObject().get('serverMessage');
  }.property('content')
  
});