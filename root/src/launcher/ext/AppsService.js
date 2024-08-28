define([
    "jscore/ext/net",
    'jscore/core',
    'i18n!launcher/app.json'
], function (net, core, Dictionary) {

    var apps;
    var internalEventBus = new core.EventBus();
    var appEventBus;
    // The retry logic here is designed during the situation of upgrade.
    // One server might fail to respond because it's upgrading so with the
    // retry, the load balancer might send us to a different server instead
    // which can respond
    var RETRY_INTERVALS = [20000];

    return {

        /**
         * Set the app event bus. This is used to publish error events.
         *
         * @method setEventBus
         * @param {EventBus} eb
         */
        setEventBus: function (eb) {
            appEventBus = eb;
        },

        /**
         * Requests the apps from the REST server. Passes the apps into
         * the callback when done.
         *
         * @method getApps
         * @param {Function} callback
         */
        getApps: function (callback) {
            var retryCount = 0;
            var timeout;
            var xhr;

            var doGet = function () {

                var errorHandler = function () {
                    clearTimeout(timeout);
                    if (retryCount < RETRY_INTERVALS.length) {
                        doGet();
                        retryCount++;
                    } else {
                        appEventBus.publish('error', {
                            header: Dictionary.get('unableContactServer')
                        });
                    }

                };

                xhr = net.ajax({
                    url: "/rest/groups",
                    dataType: "json",
                    success: function (response) {
                        clearTimeout(timeout);
                        apps = response;

                        // perform a sort on categories and apps
                        var comparator = function (a, b) {
                            return a.name.localeCompare(b.name);
                        };

                        apps.sort(comparator);
                        apps.forEach(function (category) {
                            category.apps.sort(comparator);
                        });

                        callback(apps);
                    },
                    error: errorHandler
                });

                timeout = setTimeout(function () {
                    xhr.abort();
                    errorHandler();
                }, RETRY_INTERVALS[retryCount]);
            };

            doGet();
        },

        /**
         * Resets the apps variable. Testing purposes only.
         *
         * @method clearApps
         */
        clearApps: function () {
            apps = undefined;
        },

        /**
         * Subscribe to the internal AppsService event bus.
         *
         * @method subscribe
         */
        subscribe: function () {
            return internalEventBus.subscribe.apply(internalEventBus, arguments);
        },

        /**
         * Unsubscribe from the internal AppsService event bus.
         *
         * @method unsubscribe
         */
        unsubscribe: function () {
            internalEventBus.unsubscribe.apply(internalEventBus, arguments);
        },

        /**
         * Used for testing purposes so that we can avoid the updateFavorites ajax call.
         *
         * @method publish
         */
        publish: function () {
            internalEventBus.publish.apply(internalEventBus, arguments);
        },

        /**
         * Updates the state of the favorite on the server.
         * Once updated, the local version of app metadata is updated to reflect the change.
         * The 'favorite' event is published once done which items may listen to in order
         * to update their own views.
         *
         * @method updateFavorite
         * @param {String} id
         * @param {Boolean} state
         */
        updateFavorite: function (id, state) {
            net.ajax({
                url: '/rest/ui/settings/launcher/favorites',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: id,
                    value: state ? state + '' : ''
                }),
                success: function () {
                    apps.forEach(function (category) {
                        category.apps.forEach(function (app) {
                            if (app.id === id) {
                                app.favorite = state + '';
                            }
                        });
                    });

                    internalEventBus.publish('favorite', id, state);
                }.bind(this),
                error: function (msg) {
                    appEventBus.publish('error', {
                        header: Dictionary.get('unableContactServer')
                    });
                }
            });
        }

    };
});
