/*!
 * layoutController.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'dynamiclayout/itemController',
  'dynamiclayout/commander',
  'dynamiclayout/layoutView'
], function (_, itemController, commander, LayoutView) {


// ----------------------------------------------------------------------------
// Layout Controller
// ----------------------------------------------------------------------------

return itemController.extend({

  // Default LayoutVIew
  View: LayoutView,

  //
  // Setup main application controller.
  //
  constructor: function (options) {
    // Layout Controller uses itemController
    // as a base.
    this.setup(options);

    // Set required instance variables
    this.prefix = this.required('prefix');
    this.namespace = this.required('namespace');

    // Set up and empty object responsible for managing
    // view regions and current state. 
    this._regions = {};

    // Setup any regions set
    this.configureRegions();

    // Initliaze yo!
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  },

  //
  // Create any regions declared in layoutRegions.
  // *declared in class or passed in this.options
  //
  configureRegions: function () {
    var regions = this.getOption('regions'),
        isArr   = _.isArray(regions);

    _.each(regions, function (val, key) {
      return isArr
        ? this.addRegion(val, {})
        : this.addRegion(key, val);
    }, this);
  },

  //
  // Add regions to our app view and set up global events on commander
  // to interact with them.
  //
  addRegion: function (name, definition) {
    var namespace = this.namespace + ':' + name;
    var tmpl = '<div class="<%=prefix%>-<%=name%> <%=cls%>"></div>';

    // Mixin with defaults
    definition = _.extend({
      prefix: this.prefix,
      tmpl: tmpl
    }, definition);

    // Add a new region to our view
    this.view.addRegion(name, definition);

    // Add an event to show a specified controller view
    // in the region.
    commander.setHandler(namespace + ':show', function (itemName, item, done) {
      var formatted = { name: itemName };

      // item passed as Controller
      if (_.isFunction(item)) {
        item = { Controller: item };
      }

      // Mix name into formatted item
      this.showInRegion(name, _.extend(formatted, item), done);
    }, this);

    // We want to always have track of our crruent region controller.
    // Setting to empty ovject to avoid having to check for existence
    // everywhere we lookup
    this._regions[name] = {
      namespace: namespace,
      current: {}
    };
  },

  //
  // Show a view in the specified region using the controller
  // that instantiates the view.
  //
  showInRegion: function (name, item, done) {
    var region = this._regions[name],
        isDiff = region.current.name !== item.name;

    // If it currently exists and is differnt
    // then we need to destroy.
    if (region.current.name && isDiff && !item.preventClose) {
      region.current.controller.destroy();
    }

    // New controller needs to be instantiated and displayed
    // in our region.
    if (isDiff) {
      this.setCurrentInRegion(region, item);

      // Display controller view in 
      this.view[name].show(region.current.controller.view);
    }

    // Optional callback that passes current region object.
    if (done) {
      done(region.current);
    } 
  },

  //
  // Set current of specified region.
  //
  setCurrentInRegion: function (region, item) {
    var name = item.name;

    // Set controller to new instance
    var controller = new item.Controller(_.extend({
      namespace: region.namespace + ':' + name
    }, item.options));

    // Set new cur - initialize app controller
    region.current = { name: name, controller: controller };
  }

});


});