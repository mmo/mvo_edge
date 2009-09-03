// ==========================================================================
// Project:   MvoEdge.CoreDocumentNode Fixtures
// Copyright: (c) 2009 RERO
// ==========================================================================
/*globals MvoEdge */

sc_require('models/core_document_node');

MvoEdge.CoreDocumentNode.FIXTURES_HTML = [

  { guid: 'n00001', parentId: [], nextId: 'n00002', previousId: 'undefined', children: ['n00002', 'n00003', 'n00004', 'n00005', 'n00006', 'n00007', 'n00008', 'n00009', 'n00010', 'n00011', 'n00012', 'n00013', 'n00014', 'n00019'], metadata: {language: 'ang', creator: 'GLENN C.REID', title: 'Thinking in PostScript'} },
  { guid: 'n00002', parentId: ['n00001'], nextId: 'n00003', previousId: 'n00001', sequenceNumber: 1, label: '1' },
  { guid: 'n00003', parentId: ['n00001'], nextId: 'n00004', previousId: 'n00002', sequenceNumber: 2, label: '2' },
  { guid: 'n00004', parentId: ['n00001'], nextId: 'n00005', previousId: 'n00003', sequenceNumber: 3, label: '3' },
  { guid: 'n00005', parentId: ['n00001'], nextId: 'n00006', previousId: 'n00004', sequenceNumber: 4, label: '4' },
  { guid: 'n00006', parentId: ['n00001'], nextId: 'n00007', previousId: 'n00005', sequenceNumber: 5, label: '5' },
  { guid: 'n00007', parentId: ['n00001'], nextId: 'n00008', previousId: 'n00006', sequenceNumber: 6, label: '6' },
  { guid: 'n00008', parentId: ['n00001'], nextId: 'n00009', previousId: 'n00007', sequenceNumber: 7, label: '7' },
  { guid: 'n00009', parentId: ['n00001'], nextId: 'n00010', previousId: 'n00008', sequenceNumber: 8, label: '8' },
  { guid: 'n00010', parentId: ['n00001'], nextId: 'n00011', previousId: 'n00009', sequenceNumber: 9, label: '9' },
  { guid: 'n00011', parentId: ['n00001'], nextId: 'n00012', previousId: 'n00010', sequenceNumber: 10, label: '10' },
  { guid: 'n00012', parentId: ['n00001'], nextId: 'n00013', previousId: 'n00011', sequenceNumber: 11, label: '11' },
  { guid: 'n00013', parentId: ['n00001'], nextId: 'n00014', previousId: 'n00012', sequenceNumber: 12, label: '12' },
  { guid: 'n00014', parentId: ['n00001'], nextId: 'n00015', previousId: 'n00013', label: 'Preface', children: ['n00015', 'n00016', 'n00017', 'n00018'] },
  { guid: 'n00015', parentId: ['n00014'], nextId: 'n00016', previousId: 'n00014', sequenceNumber: 13, label: '13' },
  { guid: 'n00016', parentId: ['n00014'], nextId: 'n00017', previousId: 'n00015', sequenceNumber: 14, label: '14' },
  { guid: 'n00017', parentId: ['n00014'], nextId: 'n00018', previousId: 'n00016', sequenceNumber: 15, label: '15' },
  { guid: 'n00018', parentId: ['n00014'], nextId: 'n00019', previousId: 'n00017', sequenceNumber: 16, label: '16' },
  { guid: 'n00019', parentId: ['n00001'], nextId: 'n00020', previousId: 'n00018', label: 'PostScript as a Programming Language', children: ['n00020', 'n00021', 'n00023', 'n00025', 'n00029'] },
  { guid: 'n00020', parentId: ['n00019'], nextId: 'n00021', previousId: 'n00019', sequenceNumber: 17, label: '17' },  
  { guid: 'n00021', parentId: ['n00019'], nextId: 'n00022', previousId: 'n00020', label: 'DESIGN FEATURES', children: ['n00022'] },
  { guid: 'n00022', parentId: ['n00021'], nextId: 'n00023', previousId: 'n00021', sequenceNumber: 18, label: '18' }, 
  { guid: 'n00023', parentId: ['n00019'], nextId: 'n00024', previousId: 'n00022', label: 'STRUCTURED PROGRAMMING TECHNIQUES', children: ['n00024'] }, 
  { guid: 'n00024', parentId: ['n00023'], nextId: 'n00025', previousId: 'n00023', sequenceNumber: 19, label: '19' }, 
  { guid: 'n00025', parentId: ['n00019'], nextId: 'n00026', previousId: 'n00024', label: 'PROGRAMMING TASKS', children: ['n00027'] }, 
  { guid: 'n00026', parentId: ['n00019'], nextId: 'n00027', previousId: 'n00025', label: 'WINDOW SYSTEMS, COMMUNICATIONS, AND DISPLAYS', children: ['n00027', 'n00028'] },  
  { guid: 'n00027', parentId: ['n00025', 'n00026'], nextId: 'n00028', previousId: 'n00026', sequenceNumber: 20, label: '20' },
  { guid: 'n00028', parentId: ['n00026'], nextId: 'n00029', previousId: 'n00027', sequenceNumber: 21, label: '21' },
  { guid: 'n00029', parentId: ['n00019'], nextId: 'n00030', previousId: 'n00028', label: 'DATA STRUCTURES AND ALGORITHMS', children: ['n00030'] },
  { guid: 'n00030', parentId: ['n00019'], nextId: 'n00031', previousId: 'n00029', label: 'CONCLUDING THOUGHTS', children: ['n00031'] },
  { guid: 'n00031', parentId: ['n00030'], nextId: 'undefined', previousId: 'n00030', sequenceNumber: 22, label: '22' }

];