// ==========================================================================
// Project:   MvoEdge.Thumbnail
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MvoEdge.Thumbnail = SC.Record.extend(
/** @scope MvoEdge.Thumbnail.prototype */ {

  url: SC.Record.attr(String),
  image_url: SC.Record.attr(String),
  label: SC.Record.attr(String),
  coreDocumentNode: SC.Record.attr(MvoEdge.CoreDocumentNode)
 
});