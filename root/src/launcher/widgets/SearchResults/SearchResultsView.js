define([
    'jscore/core',
    'text!./SearchResults.html',
    'styles!./SearchResults.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        }

    });

});