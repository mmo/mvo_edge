/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/
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
  //pageNumber = CDM.sequenceNumber
  pageNumber: SC.Record.attr(Number),
  coreDocumentNode: SC.Record.toOne("MvoEdge.CoreDocumentNode")
 
});