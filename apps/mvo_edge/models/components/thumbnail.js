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

  guid: SC.Record.attr(String),
  url: SC.Record.attr(String),
  // TODO verify if these properties are really used
  // Not used by fixtures VAA and get scenario
  // used by PDFRendrer or HTML ?
  //image_url: SC.Record.attr(String),
  //label: SC.Record.attr(String),
  coreDocumentNode: SC.Record.toOne("MvoEdge.CoreDocumentNode")
 
});