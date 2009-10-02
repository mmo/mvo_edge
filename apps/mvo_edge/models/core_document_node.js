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
  label: SC.Record.attr(String),
  metadata: SC.Record.attr(Object),
  urlDefault: SC.Record.attr(String),
  children: SC.Record.toMany("MvoEdge.CoreDocumentNode"),

  /**
    @property {String}
    The static URL equivalent of 'urlDefault', used to load the images.
    @default {null}
  */
  staticUrl: function () {
    var defaultUrl = this.get('urlDefault');
    if (SC.typeOf(defaultUrl) === SC.T_STRING) {
      // if defaultUrl contains 'localhost:8080' it means it has been generated
      // by the server, no need to modify it
      if (defaultUrl.match("localhost:8080")) {
        return defaultUrl;
      }
      else {
        var type = MvoEdge.get('type');
        var currentUrl;
        if (type === 0) {
          currentUrl = "/static/mvo_edge/en/current/images/VAA";
        } else if (type === 1) {
          currentUrl = "/static/mvo_edge/en/current/PDFHTML";
        } else if (type === 2) {
          currentUrl = "/static/mvo_edge/en/current/PDFRenderer";
        }
        currentUrl += defaultUrl.substring(defaultUrl.lastIndexOf("/"));
        return currentUrl;
      }
    }
    return null;
  }.property('urlDefault').cacheable(),

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
    var children       = this.get('children'),
        sequenceNumber = this.get('sequenceNumber'),
        urlDefault     = this.get('urlDefault');
    return (SC.none(children) ||
        (children.isEnumerable && children.length() === 0)) &&
        (!SC.none(urlDefault) && !SC.none(sequenceNumber));
  }.property('children', 'sequenceNumber', 'urlDefault').cacheable(),

  /**
    @property {Boolean}
    Is this an inner CDM node?
    An inner CDM node has children
    @default {NO}
  */
  isInnerNode: function () {
    var children = this.get('children');
    return !SC.none(children) && children.isEnumerable &&
     children.length() > 0;
  }.property('children').cacheable()

});