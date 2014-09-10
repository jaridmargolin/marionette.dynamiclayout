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
 * test
 * ---------------------------------------------------------------------------*/

describe('layoutView.js', function () {

  beforeEach(function () {
    this.template = '<div class="<%= prefix %>-<%= name %> <%= cls %>"></div>';
    this.expected1 = '<div class="prefix-r1 classes"></div>';
    this.expected2 = '<div class="prefix-r2 "></div>';

    this.singleDefintion = { tmpl: this.template, prefix: 'prefix', cls: 'classes' };
    this.multipleDefinitions = {
      'r1': { tmpl: this.template, prefix: 'prefix', cls: 'classes' }, 
      'r2': { tmpl: this.template, prefix: 'prefix' }
    };

    this.view = new LayoutView();
    this.view.render();
  });


  /* ---------------------------------------------------------------------------
   * addRegion
   * -------------------------------------------------------------------------*/

  describe('addRegion', function () {

    it('Should append templated region to el.', function () {
      this.view.addRegion('r1', this.singleDefintion);

      assert.equal(this.view.$el.html(), this.expected1);
    });

  });


  /* ---------------------------------------------------------------------------
   * addRegions
   * -------------------------------------------------------------------------*/

  describe('addRegions', function () {

    it('Should append templated regions to el.', function () {
      this.view.addRegions(this.multipleDefinitions);

      assert.equal(this.view.$el.html(), this.expected1 + this.expected2);
    });

  });


  /* ---------------------------------------------------------------------------
   * removeRegions
   * -------------------------------------------------------------------------*/

  describe('removeRegions', function () {

    it('Should remove templated region from el.', function () {
      this.view.addRegion('r1', this.singleDefintion);
      this.view.removeRegion('r1');

      assert.equal(this.view.$el.html(), '');
    });

    it('Should remove templated regions from el.', function () {
      this.view.addRegions(this.multipleDefinitions);
      this.view.removeRegion('r1');
      this.view.removeRegion('r2');
      
      assert.equal(this.view.$el.html(), '');
    });

  });

});


});