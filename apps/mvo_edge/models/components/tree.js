// ==========================================================================
// Project:   MvoEdge.Tree
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MvoEdge.Tree = SC.Record.extend(
/** @scope MvoEdge.Tree.prototype */ {

  label: SC.Record.attr(String),
  children: SC.Record.attr(Array),
  coreDocumentNode: SC.Record.attr(String),
  objectIds: SC.Record.attr(Array)

});