/*!
 * itemController.js
 * 
 * Copyright (c) 2014
 */

var Marionette = require('backbone.marionette');
var ItemView = require('./itemView');


/* -----------------------------------------------------------------------------
 * ItemController
 * ---------------------------------------------------------------------------*/

module.exports = Marionette.Controller.extend({

  // Default LayoutVIew
  View: ItemView,

  /**
   * Base itemController. Sets up Controller View.
   *
   * @example
   * var controller = new ItemController({
   *   View: ItemView
   * });
   *
   * @constructor
   * @public
   */
  constructor: function (options) {
    // Setup our itemController
    this.setup(options);

    // Initliaze yo!
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  },


  /**
   * Breaking setup out so it can be called
   * by any controllers that want to use this
   * as a super. Otherwise initialize will be
   * called
   *
   * @private
   */
  setup: function (options) {
    // Set options instance options
    this.options = options || {};

    // Get var or throw error
    this.View = this.required('View');

    // Render yo!
    this.view = new this.View(this.options.viewOptions || {});
    this.view.render();
  },


  /**
   * Make sure prop is defined on our instance or
   * in our instance options object.
   *
   * @private
   *
   * @param {string} name - Name of property we are checking
   *   existance of.
   */
  required: function (name) {
    var val = this.getOption(name);

    if (!val) {
      throw new Error('Requires "' + name + '" to be defined.');
    }

    return val;
  },


  /**
   * Convencience wrapper around Marionette.getOption so
   * that it does not need to be required in each sub class.
   *
   * @private
   */
  getOption: function (name) {
    return Marionette.getOption(this, name);
  }

});


