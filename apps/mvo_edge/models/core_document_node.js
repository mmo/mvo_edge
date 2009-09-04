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

  parentId: SC.Record.attr(Array),
  nextId: SC.Record.attr(String),
  previousId: SC.Record.attr(String),
  sequenceNumber: SC.Record.attr(Number),
  label: SC.Record.attr(String),
  metadata: SC.Record.attr(Object),
  urlDefault: SC.Record.attr(String),
  children: SC.Record.attr(Array)

});