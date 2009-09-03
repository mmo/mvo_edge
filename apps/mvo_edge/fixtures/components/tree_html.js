// ==========================================================================
// Project:   MvoEdge.Tree Fixtures
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/components/tree');

MvoEdge.Tree.FIXTURES_HTML = [

  { guid: 't0002', type: 'Tree', label: 'Preface', coreDocumentNode: 'n00014', objectIds: ['n00015', 'n00016', 'n00017', 'n00018'] },
  { guid: 't0003', type: 'Tree', label: 'PostScript as a Programming Language', children: ['t0004', 't0005', 't0006', 't0007', 't0008', 't0009'], coreDocumentNode: 'n00019', objectIds: ['n00020'] },
  { guid: 't0004', type: 'Tree', label: 'DESIGN FEATURES', coreDocumentNode: 'n00021', objectIds: ['n00022'] },
  { guid: 't0005', type: 'Tree', label: 'STRUCTURED PROGRAMMING TECHNIQUES', coreDocumentNode: 'n00023', objectIds: ['n00024'] },
  { guid: 't0006', type: 'Tree', label: 'PROGRAMMING TASKS', coreDocumentNode: 'n00025', objectIds: ['n00027'] },
  { guid: 't0007', type: 'Tree', label: 'WINDOW SYSTEMS, COMMUNICATIONS, AND DISPLAYS', coreDocumentNode: 'n00026', objectIds: ['n00027', 'n00028'] },
  { guid: 't0008', type: 'Tree', label: 'DATA STRUCTURES AND ALGORITHMS', coreDocumentNode: 'n00029', objectIds: ['n00031'] },
  { guid: 't0009', type: 'Tree', label: 'CONCLUDING THOUGHTS', coreDocumentNode: 'n00030', objectIds: ['n00031'] }
  
];