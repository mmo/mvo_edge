/**
==============================================================================
  Project:    MvoEdge - https://www.multivio.org/
  Copyright:  (c) 2009 RERO
  License:    See file license.js
==============================================================================
*/

/*globals MvoEdge module test ok equals same stop start */
sc_require('grid_layout_4x4');

var pane, v1, v2, v3, v4, v5, v6;

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

module("MvoEdge.GridLayout4x4", {
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

    SC.mixin(pane, MvoEdge.GridLayout4x4);
    
    pane.layOutGrid(
        100, //leftStripWidth
        100, //rightStripWidth
         20, //headerHeight
         20, //footerHeight
         50, //xCenter
         50  //yCenter
       );
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
  try { pane.layOutComponent(v1, -1,  1,  0,  1); } catch (e1) { if (e1.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  1, -1,  1); } catch (e2) { if (e2.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  0,  0,  1); } catch (e3) { if (e3.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0, -1,  0,  1); } catch (e4) { if (e4.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  1,  0,  0); } catch (e5) { if (e5.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  1,  0, -1); } catch (e6) { if (e6.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  4,  1,  0,  1); } catch (e7) { if (e7.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  1,  4,  1); } catch (e8) { if (e8.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  2,  3,  0,  1); } catch (e9) { if (e9.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  try { pane.layOutComponent(v1,  0,  1,  2,  3); } catch (e10) { if (e10.indexOf('Coordinates are invalid:') >= 0) numErrors++; }
  equals(numErrors, '10', 'should detect 10 validation errors');

  // test laying out an already laid out component
  numErrors = 0;
  try {
    pane.layOutComponent(v1, 0,  1,  0,  1);
    pane.layOutComponent(v1, 0,  1,  0,  1);
  }
  catch (e) {
    if (e.indexOf('Cannot lay out an already laid out component:') >= 0) {
      numErrors++
    };
  }
  pane.removeComponent(v1);
  ok(numErrors === 1, 'should forbid laying out an already laid out component');

  // test 1st view set
  // 1111
  // 2345
  // 2675
  // 8888
  pane.layOutComponent(v1, 0, 4, 0, 1);
  equals(testVisibility(), '10000000', '1st view set, add v1');
  pane.layOutComponent(v2, 0, 1, 1, 2);
  equals(testVisibility(), '11000000', '1st view set, add v2');
  pane.layOutComponent(v3, 1, 1, 1, 1);
  equals(testVisibility(), '11100000', '1st view set, add v3');
  pane.layOutComponent(v4, 2, 1, 1, 1);
  equals(testVisibility(), '11110000', '1st view set, add v4');
  pane.layOutComponent(v5, 3, 1, 1, 2);
  equals(testVisibility(), '11111000', '1st view set, add v5');
  pane.layOutComponent(v6, 1, 1, 2, 1);
  equals(testVisibility(), '11111100', '1st view set, add v6');
  pane.layOutComponent(v7, 2, 1, 2, 1);
  equals(testVisibility(), '11111110', '1st view set, add v7');
  pane.layOutComponent(v8, 0, 4, 3, 1);
  equals(testVisibility(), '11111111', '1st view set, add v8');

  // test 2nd view set
  // 1122
  // 1122
  // 3344
  // 3344
  pane.removeComponent(v1);
  pane.layOutComponent(v1, 0, 2, 0, 2);
  equals(testVisibility(), '10011111', '2nd view set, add v1');
  pane.layOutComponent(v2, 2, 2, 0, 2);
  equals(testVisibility(), '11000111', '2nd view set, add v2');
  pane.layOutComponent(v3, 0, 2, 2, 2);
  equals(testVisibility(), '11100010', '2nd view set, add v3');
  pane.layOutComponent(v4, 2, 2, 2, 2);
  equals(testVisibility(), '11110000', '2nd view set, add v4');

  // test 3rd view set
  // 1111
  // 1111
  // 1111
  // 1111
  pane.removeComponent(v1);
  pane.layOutComponent(v1, 0, 4, 0, 4);
  equals(testVisibility(), '10000000', '3rd view set, add v1');

  // test 4th view set
  // 2333
  // 2445
  // 2445
  // 6665
  pane.layOutComponent(v2, 0, 1, 0, 3);
  equals(testVisibility(), '01000000', '4th view set, add v2');
  pane.layOutComponent(v3, 1, 3, 0, 1);
  equals(testVisibility(), '01100000', '4th view set, add v3');
  pane.layOutComponent(v4, 1, 2, 1, 2);
  equals(testVisibility(), '01110000', '4th view set, add v4');
  pane.layOutComponent(v5, 3, 1, 1, 3);
  equals(testVisibility(), '01111000', '4th view set, add v5');
  pane.layOutComponent(v6, 0, 3, 3, 1);
  equals(testVisibility(), '01111100', '4th view set, add v6');

  // test 5th view set
  // 1778
  // 2222
  // 3333
  // 4556
  pane.layOutComponent(v1, 0, 1, 0, 1);
  equals(testVisibility(), '10111100', '5th view set, add v1');
  pane.layOutComponent(v7, 1, 2, 0, 1);
  equals(testVisibility(), '10011110', '5th view set, add v7');
  pane.layOutComponent(v8, 3, 1, 0, 1);
  equals(testVisibility(), '10011111', '5th view set, add v8');
  pane.layOutComponent(v2, 0, 4, 1, 1);
  equals(testVisibility(), '11000111', '5th view set, add v2');
  pane.layOutComponent(v3, 0, 4, 2, 1);
  equals(testVisibility(), '11100111', '5th view set, add v3');
  pane.layOutComponent(v4, 0, 1, 3, 1);
  equals(testVisibility(), '11110011', '5th view set, add v4');
  pane.layOutComponent(v5, 1, 2, 3, 1);
  equals(testVisibility(), '11111011', '5th view set, add v5');
  pane.layOutComponent(v6, 3, 1, 3, 1);
  equals(testVisibility(), '11111111', '5th view set, add v6');

  // test 6th view set
  // 1234
  // 1234
  // 1234
  // 1234
  pane.removeComponent(v1);
  pane.layOutComponent(v1, 0, 1, 0, 4);
  equals(testVisibility(), '10001111', '6th view set, add v1');
  pane.layOutComponent(v2, 1, 1, 0, 4);
  equals(testVisibility(), '11000101', '6th view set, add v2');
  pane.layOutComponent(v3, 2, 1, 0, 4);
  equals(testVisibility(), '11100101', '6th view set, add v3');
  pane.layOutComponent(v4, 3, 1, 0, 4);
  equals(testVisibility(), '11110000', '6th view set, add v4');

  // test 7th view set
  // -56-
  // 7788
  // -12-
  // -12-
  pane.layOutComponent(v5, 1, 1, 0, 1);
  equals(testVisibility(), '10111000', '7th view set, add v5');
  pane.layOutComponent(v6, 2, 1, 0, 1);
  equals(testVisibility(), '10011100', '7th view set, add v6');
  pane.layOutComponent(v7, 0, 2, 1, 1);
  equals(testVisibility(), '00011110', '7th view set, add v7');
  pane.layOutComponent(v8, 2, 2, 1, 1);
  equals(testVisibility(), '00001111', '7th view set, add v8');
  pane.layOutComponent(v1, 1, 1, 2, 2);
  equals(testVisibility(), '10001111', '7th view set, add v1');
  pane.layOutComponent(v2, 2, 1, 2, 2);
  equals(testVisibility(), '11001111', '7th view set, add v2');


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
