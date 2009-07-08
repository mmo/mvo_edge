// ==========================================================================
// Project:   MvoEdge.Tree Fixtures
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/components/tree');

MvoEdge.Tree.FIXTURES = [

  { guid: 't0001', type: 'Tree', label: 'The Problem of Practical Eugenics', children:['t0002', 't0007', 't0012'], coreDocumentNode: 'n00001' },
  { guid: 't0002', type: 'Tree', label: 'Front Matter', children: ['t0003', 't0004', 't0005', 't0006'], coreDocumentNode: 'n00002' },
  { guid: 't0003', type: 'Tree', label: 'Cover', coreDocumentNode: 'n00003' },
  { guid: 't0004', type: 'Tree', label: 'Title page', coreDocumentNode: 'n00007' },
  { guid: 't0005', type: 'Tree', label: 'Preliminaries', coreDocumentNode: 'n00009' },
  { guid: 't0006', type: 'Tree', label: 'Preface', coreDocumentNode: 'n00011' },
  { guid: 't0007', type: 'Tree', label: 'Body', children:['t0008', 't0009', 't0010', 't0011'], coreDocumentNode: 'n00015' },
  { guid: 't0008', type: 'Tree', label: 'Plate I', coreDocumentNode: 'n00027' },
  { guid: 't0009', type: 'Tree', label: 'Plate II', coreDocumentNode: 'n00031' },
  { guid: 't0010', type: 'Tree', label: 'Plate III', coreDocumentNode: 'n00035' },
  { guid: 't0011', type: 'Tree', label: 'Plate IV', coreDocumentNode: 'n00046' },
  { guid: 't0012', type: 'Tree', label: 'Back Matter', children:['t0013'], coreDocumentNode: 'n00071' },
  { guid: 't0013', type: 'Tree', label: 'Preservation colophon', coreDocumentNode: 'n00072' }

];
