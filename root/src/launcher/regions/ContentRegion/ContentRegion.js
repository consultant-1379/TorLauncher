// Region to contain the app list and search box. Handles fetching of AppsCollection.

define([
    'jscore/core',
    './ContentRegionView',
    '../../widgets/ApplicationList/ApplicationList'
], function (core, View, AppList) {
    return core.Region.extend({

        View: View,

        onStart: function () {
            this.view.showLoadingAnimation();

            this.appList = new AppList();
            this.appList.attachTo(this.view.getAppListContent());

            this.getEventBus().subscribe('hashchange', this.onHashChange.bind(this));
            this.getEventBus().subscribe('appsloaded', this.onAppsLoaded.bind(this));
            this.getEventBus().subscribe('appsloading', this.onAppsLoading.bind(this));
        },

        onAppsLoaded: function (apps) {
            this.view.hideLoadingAnimation();
            this.view.showAppListContent();
            this.appList.setApps(apps);
        },
        onAppsLoading: function () {
            this.view.hideAppListContent();
            this.view.showLoadingAnimation();
        },

        onHashChange: function (appGroupName) {
            this.appList.showAs(appGroupName);
        }
    });
});
