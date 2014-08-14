/*!
 * test/itemController.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'marionette',
  'dynamiclayout/itemView',
  'dynamiclayout/itemController',
], function (assert, sinon, Marionette, ItemView, ItemController) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

var MyItemView = ItemView.extend({});

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('itemController.js', function () {

  it('Should add options property to instance.', function () {
    var options = { 'key': 'value' },
        myController1, myController2;
    
    myController1 = new ItemController();
    myController2 = new ItemController(options);

    assert.deepEqual(myController1.options, {});
    assert.equal(myController2.options, options);
  });

  it('Should add View to instance.', function () {
    var myController1, myController2;

    myController1 = new ItemController();
    myController2 = new ItemController({
      View: MyItemView
    });

    assert.equal(myController1.View, ItemView);
    assert.equal(myController2.View, MyItemView);
  });

  it('Should add view to instance and render.', function () {
    var spy = sinon.spy(Marionette.ItemView.prototype, 'render');
    var myController = new ItemController();

    assert.isInstanceOf(myController.view, ItemView);
    assert.ok(spy.calledOnce);

    spy.restore();
  });

  it('Should call initialize if set on prototype.', function () {
    var MyController = ItemController.extend({
      initialize: function () {}
    });

    var spy = sinon.spy(MyController.prototype, 'initialize');
    var myController = new MyController();

    assert.ok(spy.calledOnce);

    spy.restore();

  });

});


});