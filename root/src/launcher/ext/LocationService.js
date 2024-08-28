define([
    'jscore/ext/locationController'
], function (LocationController) {

    var lc, eventBus;

    return {

        start: function (options) {
            eventBus = options.eventBus;

            lc = new LocationController({
                namespace: options.namespace
            });
            lc.addLocationListener(this.onHashChange.bind(this));
            lc.start();
        },

        onHashChange: function (hash) {
            var validHash = ["groups", "apps", "favorites"];

            if (validHash.indexOf(hash) === -1) {
                hash = 'groups';
                lc.setNamespaceLocation(hash, true, true);
            }

            eventBus.publish('hashchange', hash || 'groups');
        },

        retrigger: function () {
            this.onHashChange(lc.getNamespaceLocation());
        },

        setHref: function (href) {
            // Must support non-hash urls as well.
            // The implemented of this function cannot be tested.
            window.location = href;
        },

        stop: function () {
            lc.stop();
        }
    };

}); 