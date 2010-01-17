/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/*globals MvoEdge module test ok equals same stop start */
sc_require('grid_layout');

var pane, v1, v2, v3, v4, v5, v6, v7, v8;

var testVisibility = function () {
  result = '';
  result += (v1.get('isVisibleInWindow') ? '1' : '0');
  result += (v2.get('isVisibleInWindow') ? '1' : '0');
  result += (v3.get('isVisibleInWindow') ? '1' : '0');
  result += (v4.get('isVisibleInWindow') ? '1' : '0');
  result += (v5.get('isVisibleInWindow') ? '1' : '0');
  result += (v6.get('isVisibleInWindow') ? '1' : '0');
  result += (v7.get('isVisibleInWindow') ? '1' : '0');
  result += (v8.get('isVisibleInWindow') ? '1' : '0');
  return result;
}

module("MvoEdge.GridLayout3x3", {
  setup: function () {

    // create views for being laid out on the grid
    MvoEdge.testViews = SC.Page.design({
      v1: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v2: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v3: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v4: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v5: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v6: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v7: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v8: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY})
    });

    v1 = MvoEdge.getPath('testViews.v1');
    v2 = MvoEdge.getPath('testViews.v2');
    v3 = MvoEdge.getPath('testViews.v3');
    v4 = MvoEdge.getPath('testViews.v4');
    v5 = MvoEdge.getPath('testViews.v5');
    v6 = MvoEdge.getPath('testViews.v6');
    v7 = MvoEdge.getPath('testViews.v7');
    v8 = MvoEdge.getPath('testViews.v8');

    SC.RunLoop.begin();
    pane = SC.PanelPane.create({
      layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({})
    });
    pane.append();

    SC.mixin(pane, MvoEdge.GridLayout3x3);
    
    pane.layOutGrid({
        'leftStripWidth':  200,
        'rightStripWidth': 120,
        'headerHeight':     80,
        'footerHeight':     80,
        'marginTop':         5,
        'marginRight':       5,
        'marginBottom':      5,
        'marginLeft':        5
      });
  },
  teardown: function () {
    pane.remove();
    pane = null;
    SC.RunLoop.end();
  }
});

test("test component layout on the grid", function () {

  // test invalid parameters
  var numErrors = 0;
  try { pane.layOutComponent({name: 'testViews.v1', x: -1, y:  0, xlen:  1, ylen:  1}); } catch (e1) { if (e1.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y: -1, xlen:  1, ylen:  1}); } catch (e2) { if (e2.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  0, xlen:  0, ylen:  1}); } catch (e3) { if (e3.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  0, xlen: -1, ylen:  1}); } catch (e4) { if (e4.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  0, xlen:  1, ylen:  0}); } catch (e5) { if (e5.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  0, xlen:  1, ylen: -1}); } catch (e6) { if (e6.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  4, y:  0, xlen:  1, ylen:  1}); } catch (e7) { if (e7.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  4, xlen:  1, ylen:  1}); } catch (e8) { if (e8.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  2, y:  0, xlen:  3, ylen:  1}); } catch (e9) { if (e9.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent({name: 'testViews.v1', x:  0, y:  2, xlen:  1, ylen:  3}); } catch (e10) { if (e10.message.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  equals(numErrors, '10', 'should detect 10 validation errors');

  // test laying out an already laid out component
  numErrors = 0;
  try {
    pane.layOutComponent({name: 'testViews.v1', x: 0, y:  0, xlen:  1, ylen:  1});
    pane.layOutComponent({name: 'testViews.v1', x: 0, y:  0, xlen:  1, ylen:  1});
  }
  catch (e) {
    if (e.message.indexOf('Cannot lay out an already laid out component:') >= 0) {
      numErrors++
    };
  }
  ok(numErrors === 0, 'should allow laying out an already laid out component');
  pane.removeComponent('testViews.v1');


  // test different component layouts;
  // - no component is ever removed explicitly between consecutive view sets,
  // but rather replaced by components in the following view set
  
  // test 1st view set
  // 1 1 1
  // 2 3 4
  // 5 5 5
  pane.layOutComponent({name: 'testViews.v1', x: 0, y: 0, xlen: 3, ylen: 1});
  equals(testVisibility(), '10000000', '1st view set, add v1');
  pane.layOutComponent({name: 'testViews.v2', x: 0, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '11000000', '1st view set, add v2');
  pane.layOutComponent({name: 'testViews.v3', x: 1, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '11100000', '1st view set, add v3');
  pane.layOutComponent({name: 'testViews.v4', x: 2, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '11110000', '1st view set, add v4');
  pane.layOutComponent({name: 'testViews.v5', x: 0, y: 2, xlen: 3, ylen: 1});
  equals(testVisibility(), '11111000', '1st view set, add v5');


  // test 2nd view set
  // 6 6 7
  // 6 6 7
  // 8 8 1
  pane.layOutComponent({name: 'testViews.v6', x: 0, y: 0, xlen: 2, ylen: 2});
  equals(testVisibility(), '00011100', '2nd view set, add v6');
  pane.layOutComponent({name: 'testViews.v7', x: 2, y: 0, xlen: 1, ylen: 2});
  equals(testVisibility(), '00001110', '2nd view set, add v7');
  pane.layOutComponent({name: 'testViews.v8', x: 0, y: 2, xlen: 2, ylen: 1});
  equals(testVisibility(), '00000111', '2nd view set, add v8');
  pane.layOutComponent({name: 'testViews.v1', x: 2, y: 2, xlen: 1, ylen: 1});
  equals(testVisibility(), '10000111', '2nd view set, add v1');

  // test 3rd view set
  // 2 2 2
  // 2 2 2
  // 2 2 2
  pane.layOutComponent({name: 'testViews.v2', x: 0, y: 0, xlen: 3, ylen: 3});
  equals(testVisibility(), '01000000', '3rd view set, add v2');

  // test 4th view set
  // - 6 -
  // 7 7 7
  // - 8 -
  pane.layOutComponent({name: 'testViews.v6', x: 1, y: 0, xlen: 1, ylen: 1});
  equals(testVisibility(), '00000100', '4th view set, add v6');
  pane.layOutComponent({name: 'testViews.v7', x: 0, y: 1, xlen: 3, ylen: 1});
  equals(testVisibility(), '00000110', '4th view set, add v7');
  pane.layOutComponent({name: 'testViews.v8', x: 1, y: 2, xlen: 1, ylen: 1});
  equals(testVisibility(), '00000111', '4th view set, add v8');

  // test 5th view set
  // 3 4 4
  // 3 7 5
  // 6 6 5
  pane.layOutComponent({name: 'testViews.v3', x: 0, y: 0, xlen: 1, ylen: 2});
  equals(testVisibility(), '00100101', '5th view set, add v3');
  pane.layOutComponent({name: 'testViews.v4', x: 1, y: 0, xlen: 2, ylen: 1});
  equals(testVisibility(), '00110001', '5th view set, add v4');
  pane.layOutComponent({name: 'testViews.v5', x: 2, y: 1, xlen: 1, ylen: 2});
  equals(testVisibility(), '00111001', '5th view set, add v5');
  pane.layOutComponent({name: 'testViews.v6', x: 0, y: 2, xlen: 2, ylen: 1});
  equals(testVisibility(), '00111100', '5th view set, add v6');
  pane.layOutComponent({name: 'testViews.v7', x: 1, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '00111110', '5th view set, add v7');

  // test 6th view set
  // 8 1 2
  // 8 1 2
  // 8 1 2
  pane.layOutComponent({name: 'testViews.v8', x: 0, y: 0, xlen: 1, ylen: 3});
  equals(testVisibility(), '00011011', '6th view set, add v8');
  pane.layOutComponent({name: 'testViews.v1', x: 1, y: 0, xlen: 1, ylen: 3});
  equals(testVisibility(), '10001001', '6th view set, add v1');
  pane.layOutComponent({name: 'testViews.v2', x: 2, y: 0, xlen: 1, ylen: 3});
  equals(testVisibility(), '11000001', '6th view set, add v2');

  // test 7th view set
  // 3 3 3
  // 4 4 4
  // 5 5 5
  pane.layOutComponent({name: 'testViews.v3', x: 0, y: 0, xlen: 3, ylen: 1});
  equals(testVisibility(), '00100000', '7th view set, add v3');
  pane.layOutComponent({name: 'testViews.v4', x: 0, y: 1, xlen: 3, ylen: 1});
  equals(testVisibility(), '00110000', '7th view set, add v4');
  pane.layOutComponent({name: 'testViews.v5', x: 0, y: 2, xlen: 3, ylen: 1});
  equals(testVisibility(), '00111000', '7th view set, add v5');

  // test 8th view set
  // 6 7 8
  // 1 2 3
  // 4 5 5
  pane.layOutComponent({name: 'testViews.v6', x: 0, y: 0, xlen: 1, ylen: 1});
  equals(testVisibility(), '00011100', '7th view set, add v6');
  pane.layOutComponent({name: 'testViews.v7', x: 1, y: 0, xlen: 1, ylen: 1});
  equals(testVisibility(), '00011110', '7th view set, add v7');
  pane.layOutComponent({name: 'testViews.v8', x: 2, y: 0, xlen: 1, ylen: 1});
  equals(testVisibility(), '00011111', '7th view set, add v8');
  pane.layOutComponent({name: 'testViews.v1', x: 0, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '10001111', '7th view set, add v1');
  pane.layOutComponent({name: 'testViews.v2', x: 1, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '11001111', '7th view set, add v2');
  pane.layOutComponent({name: 'testViews.v3', x: 2, y: 1, xlen: 1, ylen: 1});
  equals(testVisibility(), '11101111', '7th view set, add v3');
  pane.layOutComponent({name: 'testViews.v4', x: 0, y: 2, xlen: 1, ylen: 1});
  equals(testVisibility(), '11110111', '7th view set, add v4');
  pane.layOutComponent({name: 'testViews.v5', x: 1, y: 2, xlen: 2, ylen: 1});
  equals(testVisibility(), '11111111', '7th view set, add v5');


  /*
  var pw = pane.layout.width;
  var ph = pane.layout.height;
  var ret = pane.layoutStyle();

  equals(ret.left, '0', 'v1 left should be 0');
  equals(ret.width, '600px', 'v1 should have width 600px');
  equals(ret.top, '0', 'v1 top should be 0');
  equals(ret.height, '40px', 'v1 should have height 40px');
  */

});
