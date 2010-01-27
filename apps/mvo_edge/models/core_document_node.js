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

  guid: SC.Record.attr(String),
  parentId: SC.Record.attr(Array),
  nextId: SC.Record.attr(String),
  previousId: SC.Record.attr(String),
  sequenceNumber: SC.Record.attr(Number),
  localSequenceNumber: SC.Record.attr(Number),
  label: SC.Record.attr(String),
  metadata: SC.Record.attr(Object),
  urlDefault: SC.Record.attr(String),
  children: SC.Record.toMany("MvoEdge.CoreDocumentNode"),

  
  /**
    @property {Boolean}
    Is this a leaf CDM node?
    A CDM leaf node has:
      - no children;
      - a urlDefault;
      - a sequenceNumber;
    @default {NO}
  */
  isLeafNode: function () {
    // TODO check function logic (compare with previous version c24c9996)
    var urlDefault = this.get('urlDefault');
    return (!SC.none(urlDefault));
  }.property('urlDefault').cacheable(),

  /**
    @property {Boolean}
    Is this an inner CDM node?
    An inner CDM node has children
    @default {NO}
  */
  isInnerNode: function () {
    // TODO check function logic (compare with previous version c24c9996)
    var urlDefault = this.get('urlDefault');
    return SC.none(urlDefault);
  }.property('urlDefault').cacheable()

});
