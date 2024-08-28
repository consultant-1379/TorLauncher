define([
    'jscore/core',
    'text!./Launcher.html',
    'styles!./Launcher.less'
], function (core, template, styles) {
    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },

        getNavigation: function () {
            return this.getElement().find('.eaLauncher-Navigation');
        },

        getActionBar: function () {
            return this.getElement().find('.eaLauncher-ActionBar');
        },

        getTitle: function () {
            return this.getElement().find('.eaLauncher-title');
        }

    });

});