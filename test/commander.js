/*!
 * test/.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'backbone.wreqr',
  'dynamiclayout/commander',
], function (assert, sinon, Wreqr, commander) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('commander.js', function () {

  it('Should be an instance of backbone wreqr.', function () {
    assert.isInstanceOf(commander, Wreqr.Commands);
  });

});


});