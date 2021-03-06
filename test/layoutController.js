/*!
 * test/layoutController.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'backbone.marionette',
  'proclaim',
  'sinon',
  'commander',
  'itemView',
  'layoutView',
  'itemController',
  'layoutController'
], function (_, Marionette, assert, sinon, commander, ItemView, LayoutView, ItemController, LayoutController) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('layoutController.js', function () {

  beforeEach(function () {
    var regionsArr = ['r1', 'r2'];
    var regionsObj = { 'r1': {}, 'r2': { prefix: 'test2' } };

    this.template = '<div class="<%=prefix%>-<%=name%> <%=cls%>"></div>';

    this.props    = { prefix: 'test', namespace: 'main' };
    this.propsArr = { prefix: 'test', namespace: 'main', regions: regionsArr };
    this.propsObj = { prefix: 'test', namespace: 'main', regions: regionsObj };
    
    this.item1 = { name: 'item1', Controller: ItemController };
    this.item2 = { name: 'item2', Controller: ItemController };
  });


  /* ---------------------------------------------------------------------------
   * constructor
   * -------------------------------------------------------------------------*/

  describe('constructor', function () {

    beforeEach(function () {
      this.setupSpy  = sinon.spy(ItemController.prototype, 'setup');
      this.configSpy = sinon.spy(LayoutController.prototype, 'configureRegions');
    });

    afterEach(function () {
      this.setupSpy.restore();
      this.configSpy.restore();
    });

    it('Should call setup.', function () {
      var MyLayoutController = LayoutController.extend(this.propsArr);
      var myLayoutController = new MyLayoutController();

      assert.ok(this.setupSpy.calledOnce);
    });

    it('Should fail if prefix is not provided.', function () {
      delete this.propsArr.prefix;

      assert.throws(_.bind(function () {
        var MyLayoutController = LayoutController.extend(this.propsArr);
        var myLayoutController = new MyLayoutController();
      }, this));
    });

    it('Should fail if namespace is not provided.', function () {
      delete this.propsArr.namespace;

      assert.throws(_.bind(function () {
        var MyLayoutController = LayoutController.extend(this.propsArr);
        var myLayoutController = new MyLayoutController();
      }, this));
    });

    it('Should add _regions object to instance.', function () {
      var MyLayoutController = LayoutController.extend(this.props);
      var myLayoutController = new MyLayoutController();

      assert.deepEqual(myLayoutController._regions, {});
    });

    it('Should call configureRegion.', function () {
      var MyLayoutController = LayoutController.extend(this.propsArr);
      var myLayoutController = new MyLayoutController();

      assert.ok(this.configSpy.calledOnce);
    });

    it('Should call initialize.', function () {
      this.propsArr.initialize = sinon.spy();

      var MyLayoutController = LayoutController.extend(this.propsArr);
      var myLayoutController = new MyLayoutController();

      assert.ok(this.propsArr.initialize.calledOnce);
    });

  });


  /* -----------------------------------------------------------------------------
   * configureRegions
   * ---------------------------------------------------------------------------*/

  describe('configureRegions', function () {

    beforeEach(function () {
      this.addSpy = sinon.spy(LayoutController.prototype, 'addRegion');
    });

    afterEach(function () {
      this.addSpy.restore();
    });

    it('Should call addRegion for each region.', function () {
      var MyLayoutController = LayoutController.extend(this.propsArr);
      var myLayoutController = new MyLayoutController();

      assert.ok(this.addSpy.calledTwice);
    });

    it('Should call addRegion with empty definition if passed as array of strings.', function () {
      var MyLayoutController = LayoutController.extend(this.propsArr);
      var myLayoutController = new MyLayoutController();

      assert.equal(this.addSpy.args[0][0], 'r1');
      assert.deepEqual(this.addSpy.args[0][1], {});
      assert.equal(this.addSpy.args[1][0], 'r2');
      assert.deepEqual(this.addSpy.args[1][1], {});
    });

    it('Should call addRegion with definition if passed as object.', function () {
      var MyLayoutController = LayoutController.extend(this.propsObj);
      var myLayoutController = new MyLayoutController();

      assert.equal(this.addSpy.args[0][0], 'r1');
      assert.deepEqual(this.addSpy.args[0][1], {});
      assert.equal(this.addSpy.args[1][0], 'r2');
      assert.deepEqual(this.addSpy.args[1][1], { prefix: 'test2' });
    });

  });


  /* -----------------------------------------------------------------------------
   * addRegion
   * ---------------------------------------------------------------------------*/

  describe('addRegion', function () {

    beforeEach(function () {
      this.addSpy = sinon.spy(LayoutView.prototype, 'addRegion');
      this.handlerSpy = sinon.spy(commander, 'setHandler');
      this.showStub = sinon.stub(LayoutController.prototype, 'showInRegion');

      this.MyLayoutController = LayoutController.extend(this.propsObj);
      this.myLayoutController = new this.MyLayoutController();
    });

    afterEach(function () {
      this.addSpy.restore();
      this.handlerSpy.restore();
      this.showStub.restore();
    });

    it('Should call view.addRegion with passed name and formatted definition.', function () {
      assert.equal(this.addSpy.args[0][0], 'r1');
      assert.deepEqual(this.addSpy.args[0][1], { prefix: 'test', tmpl: this.template });
      assert.equal(this.addSpy.args[1][0], 'r2');
      assert.deepEqual(this.addSpy.args[1][1], { prefix: 'test2', tmpl: this.template });
    });

    it('Should set handler for namespace:show event.', function () {
      assert.equal(this.handlerSpy.args[0][0], 'main:r1:show');
      assert.equal(this.handlerSpy.args[1][0], 'main:r2:show');
    });

    it('Should call showInRegion from inside handler for namespace:show event.', function () {
      commander.execute('main:r1:show', 'item', ItemController);
      commander.execute('main:r2:show', 'item', { Controller: ItemController });

      var expected1 = { name: 'item', Controller: ItemController };
      assert.equal(this.showStub.args[0][0], 'r1');
      assert.deepEqual(this.showStub.args[0][1], expected1);

      var expected2 = { name: 'item', Controller: ItemController };
      assert.equal(this.showStub.args[1][0], 'r2');
      assert.deepEqual(this.showStub.args[1][1], expected2);
    });

    it('Should add region to _regions store using the name as the key.', function () {
      var r1 = this.myLayoutController._regions['r1'];
      var expected1 = { namespace: 'main:r1', current: {} };
      assert.deepEqual(r1, expected1);

      var r2 = this.myLayoutController._regions['r2'];
      var expected2 = { namespace: 'main:r2', current: {} };
      assert.deepEqual(r2, expected2);
    });

  });


  /* -----------------------------------------------------------------------------
   * showInRegion
   * ---------------------------------------------------------------------------*/

  describe('showInRegion', function () {

    beforeEach(function () {
      this.createSpy = sinon.spy(LayoutController.prototype, 'createItem');
      this.showSpy = sinon.spy(Marionette.Region.prototype, 'show');
      this.destroySpy = sinon.spy(Marionette.Controller.prototype, 'destroy');

      this.MyLayoutController = LayoutController.extend(this.propsObj);
      this.myLayoutController = new this.MyLayoutController();
    });

    afterEach(function () {
      this.createSpy.restore();
      this.showSpy.restore();
      this.destroySpy.restore();
    });

    it('Should call createItem and populate _items hash.', function () {
      this.myLayoutController.showInRegion('r1', this.item1);

      assert.equal(this.createSpy.args[0][0], this.myLayoutController._regions['r1']);
      assert.equal(this.createSpy.args[0][1], this.item1);
      assert.ok(this.myLayoutController._items['r1:item1']);
    });

    it('Should call view.show.', function () {
      this.myLayoutController.showInRegion('r1', this.item1);

      assert.ok(this.showSpy.args[0][0] instanceof ItemView);
    });

    it('Should not call showInRegion or view.show if region already shown.', function () {
      this.myLayoutController.showInRegion('r1', this.item1);
      this.myLayoutController.showInRegion('r1', this.item1);

      assert.ok(this.showSpy.calledOnce);
      assert.ok(this.createSpy.calledOnce);
    });

    it('Should destroy/remove current controller if exists.', function () {
      this.myLayoutController.showInRegion('r1', this.item1);
      this.myLayoutController.showInRegion('r1', this.item2);

      assert.ok(this.destroySpy.calledOnce);
      assert.notOk(this.myLayoutController._items['r1:item1']);
    });

    it('Should call callback if passed.', function () {
      var stub = sinon.stub();
      this.myLayoutController.showInRegion('r1', this.item1, stub);

      assert.ok(stub.calledOnce);
    });

  });


  /* -----------------------------------------------------------------------------
   * createItem
   * ---------------------------------------------------------------------------*/

  describe('createItem', function () {

    beforeEach(function () {
      this.props.regions = this.regionsObj;

      this.MyLayoutController = LayoutController.extend(this.propsObj);
      this.myLayoutController = new this.MyLayoutController();
    });

    it('Should return item name and controller properties.', function () {
      var region = this.myLayoutController._regions['r1'];
      var item = this.myLayoutController.createItem(region, this.item1);

      assert.equal(item.name, this.item1.name);
      assert.ok(item.controller instanceof ItemController);
    });

  });



  /* -----------------------------------------------------------------------------
   * onDestroy
   * ---------------------------------------------------------------------------*/

  describe('onDestroy', function () {

    beforeEach(function () {
      this.props.regions = this.regionsObj;
      this.MyLayoutController = LayoutController.extend(this.propsObj);
      this.myLayoutController = new this.MyLayoutController();

      commander.execute('main:r1:show', 'item1', ItemController);
      this.item = this.myLayoutController._items['r1:item1'];

      this.removeSpy = sinon.spy(commander, 'removeHandler');
      this.destroySpy = sinon.spy(this.item.controller, 'destroy');

      this.myLayoutController.destroy();
    });

    afterEach(function () {
      this.removeSpy.restore();
    });

    it('Should remove handlers from commander', function () {
      assert.ok(this.removeSpy.calledTwice);
    });

    it('Should destroy child controllers', function () {
      assert.ok(this.destroySpy.calledOnce);
    });

  });

});


});