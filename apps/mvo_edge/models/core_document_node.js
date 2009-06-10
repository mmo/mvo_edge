// ==========================================================================
// Project:   MvoEdge.CoreDocumentNode
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MvoEdge.CoreDocumentNode = SC.Record.extend(
/** @scope MvoEdge.CoreDocumentNode.prototype */ {

  label: SC.Record.attr(String),
  fileguid: SC.Record.attr(String),
  children: SC.Record.attr(Array)

});
