define(['jscore/ext/net', 'container/api'], function (net, container) {

    var appChangeHandler;

    function ApplicationLogger() {
        /* constructor */
    }

    ApplicationLogger.prototype.start = function () {
        appChangeHandler = container.getEventBus().subscribe('container:appchange', onAppChange);
    };

    ApplicationLogger.prototype.stop = function () {
        if (appChangeHandler !== undefined) {
            container.getEventBus().unsubscribe('container:appchange', appChangeHandler);
            appChangeHandler = undefined;
        }
    };

    return new ApplicationLogger();

    function onAppChange(e) {

        if (e.breadcrumb) {
            logApplication(e.breadcrumb);
        }
    }

    function logApplication(breadcrumbData) {
        var pathElements = [];
        for (var index = 1; index < breadcrumbData.length; index++) {
            pathElements.push(breadcrumbData[index].name);
        }
        net.ajax({
            url: '/',
            type: 'GET',
            contentType: 'application/json',
            data: "applicationPath=" + JSON.stringify(pathElements)
        });
    }
});
