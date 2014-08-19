/*!
 * layoutView.js
 * 
 * Copyright (c) 2014
 */

var _ = require('underscore');
var Marionette = require('backbone.marionette');


/* -----------------------------------------------------------------------------
 * LayoutView
 * ---------------------------------------------------------------------------*/

/**
 * LayoutView that dynamically creates and appends regions.
 *
 * @example
 * var view = new LayoutView();
 *
 * @constructor
 * @public
 */
module.exports = Marionette.LayoutView.extend({

  // Layouts have no immediate template
  template: false,

  /**
   * Add regions to the view by templating and attaching
   * a new region holder to the DOM.
   *
   * @example
   * view.addRegion('r1', { prefix: 'r1' });
   *
   * @public
   *
   * @param {string} name - Name of the region to add.
   * @param {object} definition - Region definition.
   */
  addRegion: function(name, definition) {
    // Append regions prior to assigning them
    var formatted = {
      el: this.appendRegion(name, definition)
    };

    Marionette.LayoutView.prototype.addRegion.call(this, name, formatted);
  },


  /**
   * Add multiple regions at one.
   *
   * @example
   * view.addRegions({
   *   'r1': { prefix: 'r1' },
   *   'r2': { prefix: 'r2' }
   * });
   *
   * @public
   *
   * @param {regions} name - Regions object where the key represents
   *   the region name and the value is the region definition.
   */
  addRegions: function(regions) {
    var formatted = {};

    // Append Regions prior to assigning them
    _.each(regions, function (val, key) {
      formatted[key] = {
        el: this.appendRegion(key, val)
      };
    }, this);

    Marionette.LayoutView.prototype.addRegions.call(this, formatted);
  },


  /**
   * Remove both region and holder el.
   *
   * @example
   * view.removeRegion('r1');
   *
   * @public
   *
   * @param {string} name - Name of the region to remove.
   */
  removeRegion: function(name) {
    // Remove $region element
    this.$regions[name].remove();

    Marionette.LayoutView.prototype.removeRegion.apply(this, arguments);
  },


  /**
   * Append app region template to DOM.
   *
   * @private
   *
   * @param {string} name - Name of the region to add.
   * @param {object} definition - Region definition.
   */
  appendRegion: function (name, definition) {
    var tmpl  = definition.tmpl,
        props = _.extend({ name: name }, definition);

    // Can template a javascript function
    delete props.tmpl;

    // Template will fail if props are missing
    _.defaults(props, {
      prefix: '',
      name: '',
      cls: ''
    });

    var $region = $(_.template(tmpl, props));

    // Append templateted html
    this.$regions = this.$regions || {};
    this.$regions[name] = $region;
    this.$el.append($region);

    return $region;
  }

});



