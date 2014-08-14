/*!
 * test/itemController.js
 * 
 * Copyright (c) 2014
 */

define([
  'jquery',
  'proclaim',
  'sinon',
  'backbone',
  'marionette',
  'dynamiclayout/commander',
  'dynamiclayout/layoutView',
  'dynamiclayout/itemView',
  'dynamiclayout/layoutController',
  'dynamiclayout/itemController',
], function ($, assert, sinon, Backbone, Marionette, commander, LayoutView, ItemView, LayoutController, ItemController) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

var AppView = LayoutView.extend({
  el: '#workboard'
});

var MyLayoutController = LayoutController.extend({
  prefix: 'test',
  namespace: 'test',
  regions: ['r1', 'r2'],
  View: AppView
});

var R1View = Marionette.ItemView.extend({
  template: '#tmpl-r1'
});

var R2View = Marionette.ItemView.extend({
  template: '#tmpl-r2'
});

var R1Controller = ItemController.extend({
  View: R1View
});

var R2Controller = ItemController.extend({
  View: R2View
});

var r1ViewOptions = {
  model: new Backbone.Model({ name: 'R1' })
};

var r2ViewOptions = {
  model: new Backbone.Model({ name: 'R2' })
};


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('functional', function () {

  var myController;

  beforeEach(function () {
    myController = new MyLayoutController();
  });

  afterEach(function () {
    myController.view.$el.html('');
  });

  it('Should show views in regions.', function () {
    commander.execute('test:r1:show', 'primary', {
      Controller: R1Controller,
      options: { viewOptions: r1ViewOptions }
    });

    commander.execute('test:r2:show', 'primary', {
      Controller: R2Controller,
      options: { viewOptions: r2ViewOptions }
    });

    // Add Layout to DOM
    assert.equal(myController.view['r1'].$el.find('h1').text(), 'R1');
    assert.equal(myController.view['r2'].$el.find('h2').text(), 'R2');
  });

  it('Should update view in region.', function () {
    commander.execute('test:r1:show', 'primary', {
      Controller: R1Controller,
      options: { viewOptions: r1ViewOptions }
    });

    commander.execute('test:r1:show', 'secondary', {
      Controller: R1Controller,
      options: { viewOptions: r2ViewOptions }
    });

    // Add Layout to DOM
    assert.equal(myController.view['r1'].$el.find('h1').text(), 'R2');
  });

});


});