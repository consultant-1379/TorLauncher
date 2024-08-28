// The main module. Loads the regions, and handles changes in location using the location controller

define([
    'jscore/core',
    './LauncherView',
    './regions/ContentRegion/ContentRegion',
    './regions/SideRegion/SideRegion',
    './regions/ErrorDialogRegion/ErrorDialogRegion',
    'widgets/Breadcrumb',
    './regions/ActionBarRegion/ActionBarRegion',
    './ext/AppsService',
    './ext/LocationService'
], function (core, View, ContentRegion, SideRegion, ErrorDialogRegion, Breadcrumb, ActionBarRegion, AppsService, LocationService) {
    return core.App.extend({

        View: View,

        /**
         * Instantiate regions, location controller, and breadcrumb
         *
         * @method onStart
         */
        onStart: function () {

            // Content Region is responsible for listing all of the apps.
            this.contentRegion = new ContentRegion({
                context: this.getContext()
            });
            this.contentRegion.start(this.getElement());

            // Side Region is responsible for displaying additional interesting links to the user.
            this.sideRegion = new SideRegion({
                context: this.getContext()
            });
            this.sideRegion.start(this.getElement());

            // Generic error handling mechanism.
            this.errorDialogRegion = new ErrorDialogRegion({
                context: this.getContext()
            });
            this.errorDialogRegion.start(this.getElement());

            // Action Bar contains the search and toggle for listing apps.
            this.actionBarRegion = new ActionBarRegion({
                context: this.getContext()
            });
            this.actionBarRegion.start(this.view.getActionBar());

            this.view.getTitle().setText(this.options.properties.title);

            // Fetch the apps and retrigger the hashchange.
            // We retrigger the hashchange in order for the regions
            // to update themselves.
            AppsService.setEventBus(this.getEventBus());

            loadApps.call(this);

            LocationService.start({
                eventBus: this.getEventBus(),
                namespace: this.options.namespace
            });
        },

        /**
         * Needed for test cases.
         *
         * @method onStop
         */
        onStop: function () {
            LocationService.stop();
            this.contentRegion.stop();
            this.sideRegion.stop();
            this.errorDialogRegion.stop();
            this.actionBarRegion.stop();
        },

        onResume: function () {
            this.actionBarRegion.onResume();
            loadApps.call(this);
        }

    });

    function loadApps() {
        this.getEventBus().publish('appsloading');
        AppsService.getApps(function (apps) {
            this.getEventBus().publish('appsloaded', apps);
            LocationService.retrigger();
        }.bind(this));
    }

});