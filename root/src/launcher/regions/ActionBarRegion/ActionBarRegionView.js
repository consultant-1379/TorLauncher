define([
    'jscore/core',
    'text!./ActionBarRegion.html',
    'styles!./ActionBarRegion.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getSearchHolder: function () {
            return this.getElement().find('.eaLauncher-ActionBarRegion-searchHolder');
        },

        getButtonGroupHolder: function () {
            return this.getElement().find('.eaLauncher-ActionBarRegion-buttonGroupHolder');
        }

    });

});