/*!
 * bus.js
 * 
 * Copyright (c) 2014
 */

define([
  'dynamicLayout/commander',
  'dynamicLayout/itemController',
  'dynamicLayout/layoutController',
  'dynamicLayout/layoutView'
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