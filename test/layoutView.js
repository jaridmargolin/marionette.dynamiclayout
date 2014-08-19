/*!
 * test/layoutView.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'layoutView'
], function (assert, sinon, LayoutView) {


/* -----------------------------------------------------------------------------
 * reusable
 * ---------------------------------------------------------------------------*/

var expected1 = '<div class="prefix-r1 classes"></div>',
    expected2 = '<div class="prefix-r2 "></div>';

var template = '<div class="<%= prefix %>-<%= name %> <%= cls %>"></div>';

// Little helper to add a single regions
var addSingle = function (view) {
  view.addRegion('r1', {
    tmpl: template,
    prefix: 'prefix',
    cls: 'classes' 
  });
};

// Little helper to add multiple regions
var addMultiple = function (view) {
  view.addRegions({
    'r1': {
      tmpl: template,
      prefix: 'prefix',
      cls: 'classes' 
    }, 
    'r2': {
      tmpl: template,
      prefix: 'prefix'
    }
  });
};


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('layoutView.js', function () {

  it('Should render without defining a template.', function () {
    var view = new LayoutView();
    view.render();
  });


  /* ---------------------------------------------------------------------------
   * addRegion
   * -------------------------------------------------------------------------*/

  describe('addRegion', function () {

    it('Should append templated region to el.', function () {
      var view = new LayoutView();
      view.render();

      // Add region
      addSingle(view);
      assert.equal(view.$el.html(), expected1);
    });

  });


  /* ---------------------------------------------------------------------------
   * addRegions
   * -------------------------------------------------------------------------*/

  describe('addRegions', function () {

    it('Should append templated regions to el.', function () {
      var view = new LayoutView();
      view.render();

      // Add regions
      addMultiple(view);
      assert.equal(view.$el.html(), expected1 + expected2);
    });

  });


  /* ---------------------------------------------------------------------------
   * removeRegions
   * -------------------------------------------------------------------------*/

  describe('removeRegions', function () {

    it('Should remove templated region from el.', function () {
      var view = new LayoutView();
      view.render();

      addSingle(view);
      view.removeRegion('r1');
      assert.equal(view.$el.html(), '');
    });

    it('Should remove templated regions from el.', function () {
      var view = new LayoutView();
      view.render();

      addMultiple(view);
      view.removeRegion('r1');
      view.removeRegion('r2');
      assert.equal(view.$el.html(), '');
    });

  });

});


});