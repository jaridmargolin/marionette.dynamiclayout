/*!
 * marionette.dynamiclayout.js
 * 
 * Copyright (c) 2014
 */

define([
  './commander',
  './itemController',
  './layoutController',
  './layoutView'
],function (commander, ItemController, LayoutController, LayoutView) {


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return {
  commander: commander,
  ItemController: ItemController,
  LayoutController: LayoutController,
  LayoutView: LayoutView
};


});