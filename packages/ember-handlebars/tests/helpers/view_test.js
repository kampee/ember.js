var view, originalLookup;

var container = {
  lookupFactory: function() { }
};

function viewClass(options) {
  options.container = options.container || container;
  return Ember.View.extend(options);
}

module("Handlebars {{#view}} helper", {
  setup: function() {
    originalLookup = Ember.lookup;

  },

  teardown: function() {
    Ember.lookup = originalLookup;
    Ember.run(view, 'destroy');
  }
});


test("View lookup - App.FuView", function() {
  Ember.lookup = {
    App: {
      FuView: viewClass({
        elementId: "fu",
        template: Ember.Handlebars.compile("bro")
      })
    }
  };

  view = viewClass({
    template: Ember.Handlebars.compile("{{view App.FuView}}")
  }).create();

  Ember.run(view, 'appendTo', '#qunit-fixture');

  equal(Ember.$('#fu').text(), 'bro');
});

test("View lookup - 'App.FuView'", function() {
  Ember.lookup = {
    App: {
      FuView: viewClass({
        elementId: "fu",
        template: Ember.Handlebars.compile("bro")
      })
    }
  };

  view = viewClass({
    template: Ember.Handlebars.compile("{{view 'App.FuView'}}")
  }).create();

  Ember.run(view, 'appendTo', '#qunit-fixture');

  equal(Ember.$('#fu').text(), 'bro');
});

test("View lookup - 'fu'", function() {
  var FuView = viewClass({
    elementId: "fu",
    template: Ember.Handlebars.compile("bro")
  });

  var container = {
    lookupFactory: lookupFactory
  };

  view = Ember.View.extend({
    template: Ember.Handlebars.compile("{{view 'fu'}}"),
    container: container
  }).create();

  Ember.run(view, 'appendTo', '#qunit-fixture');

  equal(Ember.$('#fu').text(), 'bro');

  function lookupFactory(fullName) {
    equal(fullName, 'view:fu');

    return FuView;
  }
});

test("id bindings downgrade to one-time property lookup", function() {
  view = Ember.View.extend({
    template: Ember.Handlebars.compile("{{#view Ember.View id=view.meshuggah}}{{view.parentView.meshuggah}}{{/view}}"),
    meshuggah: 'stengah'
  }).create();

  Ember.run(view, 'appendTo', '#qunit-fixture');

  equal(Ember.$('#stengah').text(), 'stengah', "id binding performed property lookup");
  Ember.run(view, 'set', 'meshuggah', 'omg');
  equal(Ember.$('#stengah').text(), 'omg', "id didn't change");
});
