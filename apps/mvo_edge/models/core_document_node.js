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
      //var type = MvoEdge.get('type');
      var currentUrl;
      if (MvoEdge.SCENARIO === 1){
        return defaultUrl;
      }
      if (MvoEdge.SCENARIO === 2){
        var name = MvoEdge.configurator.get('properties').name;
        if (name !== undefined){
          if(name === 'VAA'){
            //console.info('VAA fixtures used');
            currentUrl = "/static/mvo_edge/en/current/images/VAA";
          }
          else if (name === 'HTML'){
            console.info('HTML fixtures used');
            currentUrl = "/static/mvo_edge/en/current/PDFHTML";
          }
          else if (name === 'PDF'){
            console.info('PDF fixtures used');
            currentUrl = "/static/mvo_edge/en/current/PDFRenderer";
          }
        }
      }
      /*if (type === 0) {
        currentUrl = "/static/mvo_edge/en/current/images/VAA";
      } else if (type === 1) {
        currentUrl = "/static/mvo_edge/en/current/PDFHTML";
      } else if (type === 2) {
        currentUrl = "/static/mvo_edge/en/current/PDFRenderer";
      } else if (type === 3) {
        currentUrl = defaultUrl;
        console.info('return defaultUrl');
        return currentUrl;
      }*/
      currentUrl += defaultUrl.substring(defaultUrl.lastIndexOf("/"));
      return currentUrl;
    }
    return null;
  }.property('urlDefault').cacheable(),

  imageUrl: function () {
    var defaultUrl = this.get('urlDefault');
    if (SC.typeOf(defaultUrl) === SC.T_STRING) {
      if (MvoEdge.SCENARIO === 1) {
        var newUrl = "/multivio/document/thumbnail?size=500&url="+defaultUrl;
        //console.info('imageUrl... ' + newUrl);
        //SC.imageCache.loadImage(newUrl);
        return newUrl;
      }
      else if (MvoEdge.SCENARIO === 2) {
        //console.info('static '+ this.staticUrl());
        return this.staticUrl();
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
  	// TODO check function logic (compare with previous version c24c9996)
    var urlDefault     = this.get('urlDefault');
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
    var urlDefault     = this.get('urlDefault');
    return (SC.none(urlDefault));
  }.property('urlDefault').cacheable()

});
