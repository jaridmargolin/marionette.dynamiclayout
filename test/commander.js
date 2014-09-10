/*!
 * test/commander.js
 * 
 * Copyright (c) 2014
 */

define([
  'proclaim',
  'sinon',
  'backbone.wreqr',
  'commander'
], function (assert, sinon, Wreqr, commander) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('commander.js', function () {

  it('Should be an instance of backbone wreqr.', function () {
    assert.isInstanceOf(commander, Wreqr.Commands);
  });

});


});