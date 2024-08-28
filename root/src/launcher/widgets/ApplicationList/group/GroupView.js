define([
    'jscore/core',
    'template!./group.html',
    'styles!./group.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getContent: function () {
            return this.getElement().find('.eaLauncher-ApplicationList-group-content');
        }

    });

});
