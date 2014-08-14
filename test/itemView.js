/*!
 * test/itemView.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'dynamiclayout/itemView',
], function (assert, sinon, ItemView) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('itemView.js', function () {

  it('Should render without defining a template.', function () {
    var view = new ItemView();
    view.render();
  });

});


});