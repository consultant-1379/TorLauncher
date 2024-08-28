define([
    'jscore/core',
    './ENMContainerHelperView',
    'container/api',
    './ext/ContainerLogger',
    './ext/ApplicationLogger'
], function (core, View, container, logger, appLogger) {

    return core.App.extend({

        View: View,

        onStart: function () {
            logger.start();
            appLogger.start();
        },

        onStop: function () {
            logger.stop();
            appLogger.stop();
        }

    });

});