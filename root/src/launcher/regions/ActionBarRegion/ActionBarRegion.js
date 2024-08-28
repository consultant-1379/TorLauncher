define([
    'jscore/core',
    './ActionBarRegionView',
    '../../widgets/Search/Search',
    '../../widgets/ButtonGroup/ButtonGroup'
], function (core, View, Search, ButtonGroup) {

    return core.Region.extend({

        View: View,

        onStart: function () {

            this.search = new Search();
            this.search.attachTo(this.view.getSearchHolder());

            this.buttonGroup = new ButtonGroup();
            this.buttonGroup.attachTo(this.view.getButtonGroupHolder());

            this.getEventBus().subscribe('hashchange', function (hash) {
                this.buttonGroup.setSelection(hash);
            }.bind(this));

            this.getEventBus().subscribe('appsloaded', function (apps) {
                this.search.setApps(apps);
            }.bind(this));

        },

        onResume: function () {
            this.search.onSearchCancel();
        }
    });

});
