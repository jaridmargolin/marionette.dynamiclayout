/*!
 * test/itemController.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'backbone.marionette',
  'itemView',
  'itemController',
], function (assert, sinon, Marionette, ItemView, ItemController) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('itemController.js', function () {

  beforeEach(function () {
    this.initializeStub = sinon.stub();

    this.MyItemView = ItemView.extend({});
    this.MyItemController = ItemController.extend({ 'initialize': this.initializeStub });

    this.myController1 = new ItemController();
    this.myController2 = new ItemController({ 'key': 'value' });
    this.myController3 = new ItemController({ 'View': this.MyItemView });
    this.myController4 = new this.MyItemController();
  });

  it('Should add options property to instance.', function () {
    assert.deepEqual(this.myController1.options, {});
    assert.deepEqual(this.myController2.options, { 'key': 'value' });
  });

  it('Should add View to instance.', function () {
    assert.equal(this.myController1.View, ItemView);
    assert.equal(this.myController3.View, this.MyItemView);
  });

  it('Should add view to instance.', function () {
    assert.isInstanceOf(this.myController1.view, ItemView);
  });

  it('Should call initialize if set on prototype.', function () {
    assert.ok(this.initializeStub.calledOnce);
  });

});


});