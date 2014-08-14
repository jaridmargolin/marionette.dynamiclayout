/*!
 * test/layoutController.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'marionette',
  'proclaim',
  'sinon',
  'dynamiclayout/commander',
  'dynamiclayout/tmpls/region',
  'dynamiclayout/itemView',
  'dynamiclayout/layoutView',
  'dynamiclayout/itemController',
  'dynamiclayout/layoutController'
], function (_, Marionette, assert, sinon, commander, regionTmpl, ItemView, LayoutView, ItemController, LayoutController) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

var getProps = function () {
  return _.extend({}, {
    prefix: 'test',
    namespace: 'main'
  });
};

var regionsArr = ['r1', 'r2'];

var regionsObj = {
  'r1': {},
  'r2': {
    prefix: 'test2'
  }
};

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('layoutController.js', function () {

  describe('constructor', function () {

    it('Should call setup.', function () {
      var spy = sinon.spy(ItemController.prototype, 'setup');

      var MyLayoutController = LayoutController.extend(getProps()),
          myLayoutController = new MyLayoutController();

      assert.ok(spy.calledOnce);

      spy.restore();
    });

    it('Should fail if prefix is not provided.', function () {
      var props = getProps();
      delete props.prefix;

      var MyLayoutController = LayoutController.extend(props);

      assert.throws(function () {
        var myLayoutController = new MyLayoutController();
      });
    });

    it('Should fail if namespace is not provided.', function () {
      var props = getProps();
      delete props.namespace;

      var MyLayoutController = LayoutController.extend(props);

      assert.throws(function () {
        var myLayoutController = new MyLayoutController();
      });
    });

    it('Should add _regions object to instance.', function () {
      var MyLayoutController = LayoutController.extend(getProps()),
          myLayoutController = new MyLayoutController();

      assert.deepEqual(myLayoutController._regions, {});
    });

    it('Should call configureRegion.', function () {
      var spy = sinon.spy(LayoutController.prototype, 'configureRegions');

      var MyLayoutController = LayoutController.extend(getProps()),
          myLayoutController = new MyLayoutController();

      assert.ok(spy.calledOnce);

      spy.restore();
    });

    it('Should call initialize.', function () {
      var props = getProps();
      props.initialize = sinon.spy();

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.ok(props.initialize.calledOnce);
    });

  });

  describe('configureRegions', function () {

    it('Should call addRegion for each region.', function () {
      var spy = sinon.spy(LayoutController.prototype, 'addRegion');

      var props = getProps();
      props.regions = regionsArr;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.ok(spy.calledTwice);

      spy.restore();
    });

    it('Should call addRegion with empty definition if passed as array of strings.', function () {
      var spy = sinon.spy(LayoutController.prototype, 'addRegion');

      var props = getProps();
      props.regions = regionsArr;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.equal(spy.args[0][0], 'r1');
      assert.deepEqual(spy.args[0][1], {});
      assert.equal(spy.args[1][0], 'r2');
      assert.deepEqual(spy.args[1][1], {});

      spy.restore();
    });

    it('Should call addRegion with definition if passed as object.', function () {
      var spy = sinon.spy(LayoutController.prototype, 'addRegion');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.equal(spy.args[0][0], 'r1');
      assert.deepEqual(spy.args[0][1], {});
      assert.equal(spy.args[1][0], 'r2');
      assert.deepEqual(spy.args[1][1], { prefix: 'test2' });

      spy.restore();
    });

  });

  describe('addRegion', function () {

    it('Should call view.addRegion with passed name and formatted definition.', function () {
      var spy = sinon.spy(LayoutView.prototype, 'addRegion');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.equal(spy.args[0][0], 'r1');
      assert.deepEqual(spy.args[0][1], {
        prefix: 'test',
        tmpl: regionTmpl
      });
      assert.equal(spy.args[1][0], 'r2');
      assert.deepEqual(spy.args[1][1], {
        prefix: 'test2',
        tmpl: regionTmpl
      });

      spy.restore();
    });

    it('Should set handler for namespace:show event.', function () {
      var spy = sinon.spy(commander, 'setHandler');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.equal(spy.args[0][0], 'main:r1:show');
      assert.equal(spy.args[1][0], 'main:r2:show');

      spy.restore();
    });

    it('Should set call showInRegion from inside handler for namespace:show event.', function () {
      var stub = sinon.stub(LayoutController.prototype, 'showInRegion');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      commander.execute('main:r1:show', 'item', ItemController);
      commander.execute('main:r2:show', 'item', {
        Controller: ItemController
      });

      assert.equal(stub.args[0][0], 'r1');
      assert.deepEqual(stub.args[0][1], {
        name: 'item',
        Controller: ItemController
      });

      assert.equal(stub.args[1][0], 'r2');
      assert.deepEqual(stub.args[1][1], {
        name: 'item',
        Controller: ItemController
      });
      
      stub.restore();
    });

    it('Should add region to _regions store using the name as the key.', function () {
      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      assert.deepEqual(myLayoutController._regions['r1'], {
        namespace: 'main:r1',
        current: {}
      });

      assert.deepEqual(myLayoutController._regions['r2'], {
        namespace: 'main:r2',
        current: {}
      });
    });

  });

  describe('showInRegion', function () {

    it('Should call setCurrentInRegion.', function () {
      var spy = sinon.spy(LayoutController.prototype, 'setCurrentInRegion');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      var item = {
        name: 'item',
        Controller: ItemController
      };

      myLayoutController.showInRegion('r1', item);

      assert.equal(spy.args[0][0], myLayoutController._regions['r1']);
      assert.equal(spy.args[0][1], item);

      spy.restore();
    });

    it('Should call view.show.', function () {
      var spy = sinon.spy(Marionette.Region.prototype, 'show');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      myLayoutController.showInRegion('r1', {
        name: 'item',
        Controller: ItemController
      });

      assert.ok(spy.args[0][0] instanceof ItemView);

      spy.restore();
    });

    it('Should not call showInRegion or view.show if region already shown.', function () {
      var spy1 = sinon.spy(Marionette.Region.prototype, 'show'),
          spy2 = sinon.spy(LayoutController.prototype, 'setCurrentInRegion');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      myLayoutController.showInRegion('r1', {
        name: 'item',
        Controller: ItemController
      });

      myLayoutController.showInRegion('r1', {
        name: 'item',
        Controller: ItemController
      });

      assert.ok(spy1.calledOnce);
      assert.ok(spy2.calledOnce);

      spy1.restore();
      spy2.restore();
    });

    it('Should call close on current controller if exists.', function () {
      var spy = sinon.spy(Marionette.Controller.prototype, 'destroy');

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      myLayoutController.showInRegion('r1', {
        name: 'item1',
        Controller: ItemController
      });

      myLayoutController.showInRegion('r1', {
        name: 'item2',
        Controller: ItemController
      });

      assert.ok(spy.calledOnce);

      spy.restore();
    });

    it('Should call callback if passed.', function () {
      var spy = sinon.spy();

      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      myLayoutController.showInRegion('r1', {
        name: 'item1',
        Controller: ItemController
      }, spy);

      assert.ok(spy.calledOnce);
    });

  });

  describe('setCurrentInRegion', function () {

    it('Should set region.current.name with controller.name.', function () {
      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      var region = myLayoutController._regions['r1'];

      myLayoutController.setCurrentInRegion(region, {
        name: 'item1',
        Controller: ItemController
      });

      assert.equal(myLayoutController._regions['r1'].current.name, 'item1');
    });

    it('Should set region.currentcontroller with new instance of controller.Controller.', function () {
      var props = getProps();
      props.regions = regionsObj;

      var MyLayoutController = LayoutController.extend(props),
          myLayoutController = new MyLayoutController();

      var region = myLayoutController._regions['r1'];

      myLayoutController.setCurrentInRegion(region, {
        name: 'item1',
        Controller: ItemController
      });

      assert.ok(myLayoutController._regions['r1'].current.controller instanceof ItemController);
    });

  });

});


});