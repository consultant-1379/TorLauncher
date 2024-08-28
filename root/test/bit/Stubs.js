define([
    'jscore/core',
    'test/bit/REST_Groups'
], function (core, REST_Groups) {

    return {

        AppContext: function () {
            return core.AppContext.extend({
                init: function () {
                    this.eventBus = new core.EventBus();
                }

            });
        },

        sortedRESTGroups: function () {
            var ClonedREST = JSON.parse(JSON.stringify(REST_Groups));

            var comparator = function (a, b) {
                return a.name.localeCompare(b.name);
            };

            ClonedREST.sort(comparator);
            ClonedREST.forEach(function (category) {
                category.apps.sort(comparator);
            });
            return ClonedREST;
        }

    }

});