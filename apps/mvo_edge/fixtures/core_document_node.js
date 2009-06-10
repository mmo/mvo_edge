// ==========================================================================
// Project:   MvoEdge.CoreDocumentNode Fixtures
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/core_document_node');

MvoEdge.CoreDocumentNode.FIXTURES = [

  { guid: 'la_000000',
    author: 'Karl Pearson',
    title: 'The Problem of Practical Eugenics',
    children: [
      'la_000001',
      'la_000003',
      'la_000004',
      'la_000005',
      'la_000007',
      'la_000008',
      'la_000009',
      'la_0000010',
      'la_0000011',
      'la_0000012'
  ] },
  { guid: 'la_000001', label: 'Front Matter', fileguid: 'f_000001', children: ['la_000002', 'la_000003', 'la_000004', 'la_000005'] },
  { guid: 'la_000002', label: 'Cover', fileguid: 'f_000001' },
  { guid: 'la_000003', label: 'Title page', fileguid: 'f_000003' },
  { guid: 'la_000004', label: 'Preliminaries', fileguid: 'f_000004' },
  { guid: 'la_000005', label: 'Preface', fileguid: 'f_000005' },
  { guid: 'la_000006', label: 'Body', fileguid: 'f_000007', children: ['la_000007', 'la_000008', 'la_000009', 'la_000010'] },
  { guid: 'la_000007', label: 'Plate I', fileguid: 'f_000017' },
  { guid: 'la_000008', label: 'Plate II', fileguid: 'f_000019' },
  { guid: 'la_000009', label: 'Plate III', fileguid: 'f_000021' },
  { guid: 'la_000010', label: 'Plate IV', fileguid: 'f_000029' },
  { guid: 'la_000011', label: 'Back Matter', fileguid: 'f_000051', children: ['la_000012'] },
  { guid: 'la_000012', label: 'Preservation colophon', fileguid: 'f_000051' }

];
