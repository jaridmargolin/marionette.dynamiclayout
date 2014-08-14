/*!
 * bus.js
 * 
 * Copyright (c) 2014
 */

define([
  'dynamiclayout/commander',
  'dynamiclayout/itemController',
  'dynamiclayout/layoutController',
  'dynamiclayout/layoutView'
],function (commander, ItemController, LayoutController, LayoutView) {


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return {
  commander: commander,
  ItemController: ItemController,
  LayoutController: LayoutController,
  LayoutView: LayoutView
};


});