/*!
 * layoutController.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  './itemController',
  './commander',
  './layoutView'
], function (_, itemController, commander, LayoutView) {


/* -----------------------------------------------------------------------------
 * scope
 * ---------------------------------------------------------------------------*/

var tmpl = '<div class="<%=prefix%>-<%=name%> <%=cls%>"></div>';


/* -----------------------------------------------------------------------------
 * LayoutController
 * ---------------------------------------------------------------------------*/

return itemController.extend({

  // Default LayoutVIew
  View: LayoutView,

  /**
   * Controller with methods to manipulate nested layout
   * views and associated regions.
   *
   * @example
   * var controller = new LayoutController();
   *
   * @constructor
   * @public
   */
  constructor: function (options) {
    // Layout Controller uses itemController
    // as a base.
    this.setup(options);

    // Set required instance variables
    this.prefix    = this.required('prefix');
    this.namespace = this.required('namespace');

    // Set up an empty array to hold reference to all
    // applied events (for cleanup).
    this._events = [];

    // Set up an empty object responsible for managing
    // view regions and current state. 
    this._regions = {};

    // Set up an empty object responsible for manging
    // sub controllers.
    this._items = {};

    // Setup any regions set
    this.configureRegions();

    // Initliaze yo!
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  },


  /**
   * Called on controller destroy. Used to clean up any
   * applied events.
   *
   * @private
   */
  onDestroy: function () {
    _.each(this._events, function (val, key) {
      commander.removeHandler(val);
    });
  },


  /**
   * Create any regions declared in layoutRegions.
   * Declared in class or passed in this.options
   *
   * @private
   */
  configureRegions: function () {
    var regions = this.getOption('regions'),
        isArr   = _.isArray(regions);

    _.each(regions, function (val, key) {
      return isArr
        ? this.addRegion(val, {})
        : this.addRegion(key, val);
    }, this);
  },


  /**
   * Add regions to our app view and set up global events on commander
   * to interact with them.
   *
   * @example
   * controller.addRegion('r1', { tmpl: template });
   *
   * @public
   *
   * @param {string} name - Name of the region to add.
   * @param {object} definition - Region definition.
   */
  addRegion: function (name, definition) {
    var namespace = [this.namespace, name].join(':');
    var eventName = [namespace, 'show'].join(':');

    // Mixin with defaults
    definition = _.extend({}, definition);
    definition['prefix'] = definition['prefix'] || this.prefix;
    definition['tmpl']   = definition['tmpl'] || tmpl;

    // Add a new region to our view
    this.view.addRegion(name, definition);

    // We want to always have track of our crruent region controller.
    // Setting to empty ovject to avoid having to check for existence
    // everywhere we lookup
    var region = this._regions[name] = {};
    region['namespace'] = namespace;
    region['current']   = {};

    // Add an event to show a specified controller view
    // in the region. Handler should be passed region name.
    this._events.push(eventName);
    commander.setHandler(eventName, _.bind(this.onShow, this, name));
  },


  /**
   * Show handler. Responsible for showing a view/controller
   * in the new region.
   *
   * @private
   *
   * @params {string} regionName - Name of region to show view in.
   * @params {string} itemName - Name of view to show in region.
   * @params {object} item - The item contains a Controller
   *   and any options to pass in at Controller instantiation.
   * @params {function} done - Callback to execute once region
   *   has been shown. Will pass in the newly instantiated
   *   controller.
   */
  onShow: function (regionName, itemName, item, done) {
    // item passed as Controller
    if (_.isFunction(item)) {
      item = { Controller: item };
    }

    // add name to item object
    item['name'] = itemName;

    // Mix name into formatted item
    this.showInRegion(regionName, item, done);
  },


  /**
   * Show a view in the specified region using the controller
   * that instantiates the view.
   *
   * @example
   * controller.showInRegion('r1', { 
   *   name: 'content',
   *   Controller: ContentController
   * }, completed);
   *
   * @public
   *
   * @param {string} name - Name of the region to show content in.
   * @param {object} item - Item definition.
   * @param {function} done - Callback executed once view is shown.
   */
  showInRegion: function (regionName, item, done) {
    var region  = this._regions[regionName];
    var current = region.current;
    var isDiff  = current.name !== item.name;
    var name    = [regionName, item.name].join(':');

    // If it currently exists and is differnt
    // then we need to destroy/remove.
    if (isDiff && current.name && !item.preventClose) {
      current.controller.destroy();
      delete this._items[current.name];
    }

    // Create a new item if it does not yet exist.
    if (isDiff && !this._items[name]) {
      this._items[name] = this.createItem(region, item);
    }

    // Show and set current.
    if (isDiff) {
      region.current = this._items[name];
      this.view[regionName].show(region.current.controller.view);
    }

    // Optional callback that passes current region object.
    if (done) {
      done(current);
    } 
  },


  /**
   * Set current of specified region.
   *
   * @private
   *
   * @param {string} name - Region currently manipulating on.
   * @param {object} item - Item to initialize and set as current.
   */
  createItem: function (region, item) {
    var options   = _.extend({}, item.options);
    var namespace = [region.namespace, item.name].join(':');

    // Add namespace to options
    options['namespace'] = namespace;

    // Add item
    return {
      'controller': new item.Controller(options),
      'name': item.name
    };
  }

});


});