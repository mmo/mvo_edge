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

  guid: SC.Record.attr(String),
  label: SC.Record.attr(String),
  children: SC.Record.toMany("MvoEdge.Tree"),
  // the CDM node that should be selected after this tree node
  targetCdmLeaf: SC.Record.toOne("MvoEdge.CoreDocumentNode"),
  // the CDM leaf nodes that can be active when this tree node is selected;
  // this is useful to know if the tree selection must actually change if the
  // selected CDM leaf node changes (in many cases it doesn't)
  cdmLeafNodeIds: SC.Record.attr(Array)
});
