define([
    'jscore/core',
    'text!./ContentRegion.html',
    'styles!./ContentRegion.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getAppListContent: function () {
            return this.getElement().find('.eaLauncher-ContentRegion-appListHolder-appListContent');
        },

        showAppListContent: function () {
            this.getAppListContent().removeModifier('hidden');
        },

        hideAppListContent: function () {
            this.getAppListContent().setModifier('hidden');
        },

        getLoadingAnimation: function () {
            return this.getElement().find('.eaLauncher-ContentRegion-appListHolder-loadingAnimation');
        },

        showLoadingAnimation: function () {
            this.getLoadingAnimation().removeModifier('hidden');
        },

        hideLoadingAnimation: function () {
            this.getLoadingAnimation().setModifier('hidden');
        }

    });

});