marionette.dynamiclayout [![Build Status](https://travis-ci.org/jaridmargolin/marionette.dynamiclayout.png)](https://travis-ci.org/jaridmargolin/marionette.dynamiclayout)
========================

Manage layouts and views via controllers.

```js
var AppController = new LayoutController({

  // All regions created within the layout will have a dynamically
  // generated class name following the convention "[prefix]-[name]"
  // ex: `app-nav`
  regionPrefix: 'app',

  // All events handlers are applied using a common naming convention.
  // The main app controller will need to define a root namespace. All
  // nested controllers will have a namespace dynamically created based
  // on their depth compared to the root Controller.
  // ex: 'app:ovelay:nav'
  namespace: 'app',
  
  // Regions can be passed in at instantiation, defined
  // in programatically or added to the Controller prototype.
  // It can be an array of 'names', which is enough create the
  // regions or it can be an object where the keys are 'names'
  // and the values are the region options.
  regions: ['sidebar', 'main']
  
});

var MenuPrimaryView = Marionette.ItemView.extend({
  template: '#tmpl-menu-primary'
});

var MenuSecondaryView = Marionette.ItemView.extend({
  template: '#tmpl-menu-secondary'
});
```

```js
// First show primary menu
commander.execute('app:sidebar:show', 'primary', {
  Controller: ItemController,
  options: { View: MenuPrimaryView }
});

// Update region to display secondary menu
commander.execute('app:sidebar:show', 'secondary', {
  Controller: ItemController,
  options: { View: MenuSecondaryView }
});
```


---

## TESTS

**Install Dependencies**

```
npm install
```

**Run/View**

```
grunt test
```



---

## License

The MIT License (MIT) Copyright (c) 2014 Jarid Margolin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.