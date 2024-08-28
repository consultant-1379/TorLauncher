define([
    'container/api'
], function (container) {
    'use strict';

    var hostname;

    container.getEventBus().subscribe('hostname', function (name) {
        hostname = name;
    });

    container.getEventBus().subscribe('help:titlechange', function () {
        setTitle();
    });

    function setTitle() {
        if (hostname !== undefined && document.title.indexOf(hostname) !== 0) {
            document.title = document.title + ' - ' + hostname;
        }
    }

    return {
        onBeforeAppChange: function (resolve) {
            resolve();
            requestAnimationFrame(function () {
                setTitle();
            });
        }
    };
});
