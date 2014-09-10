/*!
 * test/itemView.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'proclaim',
  'sinon',
  'itemView'
], function (_, assert, sinon, ItemView) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('itemView.js', function () {

  beforeEach(function () {
    this.view = new ItemView();
  });

  it('Should render without defining a template.', function () {
    assert.doesNotThrow(_.bind(function () {
      this.view.render();
    }, this));
  });

});


});