define([
    'jscore/core',
    'template!./Search.html',
    'styles!./Search.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getInput: function () {
            return this.getElement().find('.eaLauncher-Search-input');
        },

        getCancel: function () {
            return this.getElement().find('.eaLauncher-Search-cancel');
        },

        setCancelButtonVisibility: function (value) {
            this.getCancel().setModifier('visible', value + '');
        }

    });

});