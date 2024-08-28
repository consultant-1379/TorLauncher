define([
    'jscore/core',
    './GroupView'
], function (core, View) {

    return core.Widget.extend({

        view: function () {
            return new View(this.options);
        },

        add: function (listItem) {
            listItem.attachTo(this.view.getContent());
        }

    });

});
