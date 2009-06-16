// ==========================================================================
// Project:   MvoEdge.Tree Fixtures
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/components/tree');

MvoEdge.Tree.FIXTURES = [

  { guid: 't0001', label: 'The Problem of Practical Eugenics', children:['t0002', 't0007', 't0012'], coreDocumentNode: 'n00001' },
  { guid: 't0002', label: 'Front Matter', children: ['t0003', 't0004', 't0005', 't0006'], coreDocumentNode: 'n00002' },
  { guid: 't0003', label: 'Cover', coreDocumentNode: 'n00003' },
  { guid: 't0004', label: 'Title page', coreDocumentNode: 'n00007' },
  { guid: 't0005', label: 'Preliminaries', coreDocumentNode: 'n00009' },
  { guid: 't0006', label: 'Preface', coreDocumentNode: 'n00011' },
  { guid: 't0007', label: 'Body', children:['t0008', 't0009', 't0010', 't0011'], coreDocumentNode: 'n00015' },
  { guid: 't0008', label: 'Plate I', coreDocumentNode: 'n00027' },
  { guid: 't0009', label: 'Plate II', coreDocumentNode: 'n00031' },
  { guid: 't0010', label: 'Plate III', coreDocumentNode: 'n00035' },
  { guid: 't0011', label: 'Plate IV', coreDocumentNode: 'n00046' },
  { guid: 't0012', label: 'Back Matter', children:['t0013'], coreDocumentNode: 'n00071' },
  { guid: 't0013', label: 'Preservation colophon', coreDocumentNode: 'n00072' }

];
