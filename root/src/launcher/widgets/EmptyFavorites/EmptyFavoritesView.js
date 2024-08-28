define([
    'jscore/core',
    'template!./EmptyFavorites.html',
    'styles!./EmptyFavorites.less'
], function (core, template, styles) {
    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        }
    });

});