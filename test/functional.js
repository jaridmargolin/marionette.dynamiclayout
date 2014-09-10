/*!
 * test/itemController.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'jquery',
  'proclaim',
  'sinon',
  'backbone',
  'backbone.marionette',
  'commander',
  'layoutView',
  'itemView',
  'layoutController',
  'itemController',
], function (_, $, assert, sinon, Backbone, Marionette, commander, LayoutView, ItemView, LayoutController, ItemController) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('functional', function () {

  before(function () {
    var template1 = _.template('<h1><%= name %></h1>');
    var template2 = _.template('<h2><%= name %></h2>');

    var r1Options = { model: new Backbone.Model({ name: 'R1' }) };
    var r2Options = { model: new Backbone.Model({ name: 'R2' }) };

    var AppView = LayoutView.extend({ el: '#workboard' });
    var R1View = Marionette.ItemView.extend({ template: template1 });
    var R2View = Marionette.ItemView.extend({ template: template2 });

    this.R1Controller = ItemController.extend({ View: R1View, viewOptions: r1Options });
    this.R2Controller = ItemController.extend({ View: R2View, viewOptions: r2Options });

    this.MyLayoutController = LayoutController.extend({
      prefix: 'test',
      namespace: 'test',
      regions: ['r1', 'r2'],
      View: AppView
    });
  });

  beforeEach(function () {
    this.myController = new this.MyLayoutController();
  });

  afterEach(function () {
    this.myController.view.$el.html('');
    this.myController.destroy();
  });

  it('Should show views in regions.', function () {
    commander.execute('test:r1:show', 'primary', this.R1Controller);
    commander.execute('test:r2:show', 'primary', this.R2Controller);

    // Add Layout to DOM
    assert.equal(this.myController.view['r1'].$el.find('h1').text(), 'R1');
    assert.equal(this.myController.view['r2'].$el.find('h2').text(), 'R2');
  });

  it('Should update view in region.', function () {
    commander.execute('test:r1:show', 'primary', this.R1Controller);
    commander.execute('test:r1:show', 'secondary', this.R2Controller);

    // Add Layout to DOM
    assert.equal(this.myController.view['r1'].$el.find('h2').text(), 'R2');
  });

});


});