define([
    'jscore/core',
    'template!./Tooltip.html',
    'styles!./Tooltip.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getCloseButton: function () {
            return this.getElement().find('.eaLauncher-Tooltip-closeButton');
        },

        setRootModifier: function (state) {
            this.getElement().setModifier('shownBottom', state + '');
        }

    });

});