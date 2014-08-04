/*!
 * itemController.js
 * 
 * Copyright (c) 2014
 */

define([
  'marionette',
  'dynamicLayout/itemView'
],function (Marionette, ItemView) {


// ----------------------------------------------------------------------------
// ItemController
// ----------------------------------------------------------------------------

return Marionette.Controller.extend({

  // Default LayoutVIew
  View: ItemView,

  //
  // View Controllers need a View...
  // crazy right?
  //
  constructor: function (options) {
    // Setup our itemController
    this.setup(options);

    // Initliaze yo!
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  },

  //
  // Breaking setup out so it can be called
  // by any controllers that want to use this
  // as a super. Otherwise initialize will be
  // called
  //
  setup: function (options) {
    // Set options instance options
    this.options = options || {};

    // Get var or throw error
    this.View = this.required('View');

    // Render yo!
    this.view = new this.View(this.options.viewOptions || {});
    this.view.render();
  },

  //
  // Make sure prop is defined on our instance or
  // in our instance options object.
  //
  required: function (name) {
    var val = this.getOption(name);

    if (val) {
      return val;
    }

    throw new Error('Requires "' + name + '" to be defined.');
  },

  //
  // Convenience wrapper around Marionette.getOption
  //
  getOption: function (name) {
    return Marionette.getOption(this, name);
  }

});


});