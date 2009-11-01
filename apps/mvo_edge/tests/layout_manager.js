// ==========================================================================
// Project:   MvoEdge.layoutManager Unit Test
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals MvoEdge module test ok equals same stop start */
sc_require('layout_manager');

var lm, pane, v1, v2, v3, v4, v5, v6;

module("MvoEdge.layoutManager", {
  setup: function () {

    lm = MvoEdge.layoutManager;
    
    // create views for being laid out on the grid
    MvoEdge.testViews = SC.Page.design({
      v1: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v2: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v3: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v4: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v5: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY}),
      v6: SC.View.extend(SC.Border, {borderStyle: SC.BORDER_GRAY})
    });

    v1 = MvoEdge.getPath('testViews.v1');
    v2 = MvoEdge.getPath('testViews.v2');
    v3 = MvoEdge.getPath('testViews.v3');
    v4 = MvoEdge.getPath('testViews.v4');
    v5 = MvoEdge.getPath('testViews.v5');
    v6 = MvoEdge.getPath('testViews.v6');

    SC.RunLoop.begin();
    pane = SC.PanelPane.create({
      layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({})
    });
    pane.append();

    lm.layoutGrid(
        pane, //view
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

  /*
  mainBox = MvoEdge.getPath('testViews.mainBox');
  mainBox.set('layout', { width: 200, height: 100, centerX: 0, centerY: 0 });
  pane.appendChild(mainBox);
  */

  // test invalid parameters
  var numErrors = 0;
  try { lm.layoutComponent(v1, -1,  1,  0,  1); } catch (e1) { if (e1 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  1, -1,  1); } catch (e2) { if (e2 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  0,  0,  1); } catch (e3) { if (e3 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0, -1,  0,  1); } catch (e4) { if (e4 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  1,  0,  0); } catch (e5) { if (e5 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  1,  0, -1); } catch (e6) { if (e6 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  4,  1,  0,  1); } catch (e7) { if (e7 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  1,  4,  1); } catch (e8) { if (e8 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  2,  3,  0,  1); } catch (e9) { if (e9 === 'Coordinates are invalid') numErrors++; }
  try { lm.layoutComponent(v1,  0,  1,  2,  3); } catch (e10) { if (e10 === 'Coordinates are invalid') numErrors++; }
  equals(numErrors, '10', 'should detect 10 validation errors');

  lm.layoutComponent(v1, 0, 4, 0, 1);

  ok(v1.get('isVisibleInWindow'), 'v1.isVisibleInWindow should be YES');

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
