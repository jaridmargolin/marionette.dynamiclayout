/*!
 * views/layout.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'marionette'
],function (_,  Marionette) {


// ----------------------------------------------------------------------------
// Page View
// ----------------------------------------------------------------------------

return Marionette.LayoutView.extend({

  // Layouts have no immediate template
  template: false,

  //
  // Template and attach a new app-holder to the DOM
  //
  addRegion: function(name, definition) {
    // Append regions prior to assigning them
    var formatted = {
      el: this.appendRegion(name, definition)
    };

    Marionette.LayoutView.prototype.addRegion.call(this, name, formatted);
  },

  //
  // Template and attach a new app-holder to the DOM
  //
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

  //
  // Remove template from 
  //
  removeRegion: function(name) {
    // Remove $region element
    this.$regions[name].remove();

    Marionette.LayoutView.prototype.removeRegion.apply(this, arguments);
  },

  //
  // Append app region template to dom.
  //
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


});
