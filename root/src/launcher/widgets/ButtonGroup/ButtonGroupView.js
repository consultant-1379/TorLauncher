define([
    'jscore/core',
    'template!./ButtonGroup.html',
    'styles!./ButtonGroup.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getRadio: function (index) {
            return this.getElement().find('.eaLauncher-ButtonGroup-radio-' + index);
        },

        getSelectedRadio: function () {
            return this.getElement().find('input[type=radio]:checked');
        }

    });

});
