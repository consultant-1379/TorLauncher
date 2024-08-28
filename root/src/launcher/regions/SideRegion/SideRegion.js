define([
    'jscore/core',
    './SideRegionView',
    'i18n!launcher/app.json'
], function (core, View, Dictionary) {
    return core.Region.extend({

        view: function () {
            return new View({
                i18n: {
                    helpTitle: Dictionary.get('sideRegion.helpTitle'),
                    tutorialTitle: Dictionary.get('sideRegion.tutorial.title'),
                    tutorialSearch: Dictionary.get('sideRegion.tutorial.search'),
                    tutorialAddNode: Dictionary.get('sideRegion.tutorial.addNode'),
                    tutorialCreateSubscription: Dictionary.get('sideRegion.tutorial.createSubscription'),
                }
            });
        }
    });

});
