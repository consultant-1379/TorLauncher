define(['jscore/core', 'logger/main', 'container/api'], function (core, logger, container) {

    var appChangeHandler,
        windowErrorHandler;


    function ContainerLogger() {
        /* constructor */
    }

    ContainerLogger.prototype.start = function () {
        windowErrorHandler = core.Window.addEventHandler('error', onError);
        appChangeHandler = container.getEventBus().subscribe('container:appchange', onAppChange);
    };


    ContainerLogger.prototype.stop = function () {
        if (windowErrorHandler !== undefined) {
            core.Window.removeEventHandler('error', windowErrorHandler);
            windowErrorHandler = undefined;
        }
        if (appChangeHandler !== undefined) {
            container.getEventBus().unsubscribe('container:appchange', appChangeHandler);
            appChangeHandler = undefined;
        }
    };

    return new ContainerLogger();

    function onAppChange(e) {

        if (e.error) {
            onError({
                message: e.error,
                error: e.errorObject || {}
            });
        }

    }

    function onError(e) {
        e = (e.originalEvent) ? e.originalEvent : e;

        logger.error(e.message, e.filename || e.error.name, e.error);
    }

});
