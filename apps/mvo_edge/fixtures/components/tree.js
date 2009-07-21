// ==========================================================================
// Project:   MvoEdge.Tree Fixtures
// Copyright: ©2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/components/tree');

MvoEdge.Tree.FIXTURES = [

  { guid: 't0002', type: 'Tree', label: 'Front Matter', children: ['t0003', 't0004', 't0005', 't0006'],
  coreDocumentNode: 'n00002', objectIds: ['n00004', 'n00006', 'n00012'] },
  { guid: 't0003', type: 'Tree', label: 'Cover', coreDocumentNode: 'n00003', objectIds: ['n00004'] },
  { guid: 't0004', type: 'Tree', label: 'Title page', coreDocumentNode: 'n00007', objectIds: ['n00008'] },
  { guid: 't0005', type: 'Tree', label: 'Preliminaries', coreDocumentNode: 'n00009',objectIds: ['n00010'] },
  { guid: 't0006', type: 'Tree', label: 'Preface', coreDocumentNode: 'n00011', objectIds: ['n00014'] },
  { guid: 't0007', type: 'Tree', label: 'Body', children:['t0008', 't0009', 't0010', 't0011'], coreDocumentNode: 'n00015',
  objectIds: ['n00017', 'n00018', 'n00019', 'n00020', 'n00021', 'n00022', 'n00023', 'n00024', 'n00025', 'n00026', 'n00030', 'n00034',
  'n00040', 'n00041', 'n00042', 'n00043', 'n00044', 'n00045', 'n00049', 'n00051', 'n00052', 'n00053', 'n00054',
  'n00055', 'n00056', 'n00057', 'n00058', 'n00059', 'n00060', 'n00061', 'n00062', 'n00063', 'n00064', 'n00065', 'n00066', 'n00067', 'n00068', 'n00069', 'n00070']},
  { guid: 't0008', type: 'Tree', label: 'Plate I', coreDocumentNode: 'n00027', objectIds: ['n00028'] },
  { guid: 't0009', type: 'Tree', label: 'Plate II', coreDocumentNode: 'n00031', objectIds: ['n00032'] },
  { guid: 't0010', type: 'Tree', label: 'Plate III', coreDocumentNode: 'n00035', objectIds: ['n00036'] },
  { guid: 't0011', type: 'Tree', label: 'Plate IV', coreDocumentNode: 'n00046', objectIds: ['n00047'] },
  { guid: 't0012', type: 'Tree', label: 'Back Matter', children:['t0013'], coreDocumentNode: 'n00071', objectIds: ['n00073'] },
  { guid: 't0013', type: 'Tree', label: 'Preservation colophon', coreDocumentNode: 'n00072', objectIds: ['n00073'] }

];
