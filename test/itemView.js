/*!
 * test/itemView.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'itemView',
], function (assert, sinon, ItemView) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('itemView.js', function () {

  it('Should render without defining a template.', function () {
    var view = new ItemView();
    view.render();
  });

});


});