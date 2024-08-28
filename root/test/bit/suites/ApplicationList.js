define([
    'launcher/widgets/ApplicationList/ApplicationList',
    'jscore/core',
    '../REST_Groups',
    'launcher/widgets/ListItem/ListItem'
], function (ApplicationList, core, REST_Groups, ListItem) {

    describe('ApplicationList', function () {
        var appList;
        var headerText = '.eaLauncher-ApplicationList-group-headerText';

        beforeEach(function () {
            appList = new ApplicationList();
            appList.attachTo(core.Element.wrap(container));

            // cloning the data so that the sorting doesn't affect the other tests
            appList.setApps(JSON.parse(JSON.stringify(REST_Groups)));
        });

        afterEach(function () {
            appList.destroy();
        });

        it('#launcher/groups should show as Provisioning', function () {
            appList.showAs('groups');
            var categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group');
            expect(categories.length).to.equal(6);

            // should be sorted, REST_Groups has out of order categories
            expect(categories[0].find(headerText).getText()).to.equal('Documentation');
            expect(categories[1].find(headerText).getText()).to.equal('Monitoring');
            expect(categories[2].find(headerText).getText()).to.equal('Performance and Optimization');
            expect(categories[3].find(headerText).getText()).to.equal('Provisioning');
            expect(categories[4].find(headerText).getText()).to.equal('Security');
            expect(categories[5].find(headerText).getText()).to.equal('System');

            // check for icon and border
            expect(categories[0].find('.eaLauncher-ApplicationList-group-iconHolder')).not.to.be.undefined;
            expect(categories[0].getAttribute('class').indexOf('eaLauncher-ApplicationList-group-borderColor')).not.to.equal(-1);

            // check category content
            var cat0Items = categories[0].findAll('.eaLauncher-ListItem');
            expect(cat0Items.length).to.equal(1);
            expect(cat0Items[0].find('a').getText().trim()).to.equal('Alex Library');

            // Items inside should be sorted
            var cat1Items = categories[1].findAll('.eaLauncher-ListItem');
            expect(cat1Items.length).to.equal(3);
            expect(cat1Items[0].find('a').getText().trim()).to.equal('Alarm History');
            expect(cat1Items[1].find('a').getText().trim()).to.equal('Alarm Monitoring (FM)');
            expect(cat1Items[2].find('a').getText().trim()).to.equal('Alarm Text Routing (FM)');
        });

        it('#launcher/apps should show as A-Z', function () {
            appList.showAs('apps');

            // Using ordered modifier as A-Z should have that set
            var categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group_ordered');
            expect(categories.length).to.equal(8) // A S P U L O C N

            expect(categories[0].find(headerText).getText()).to.equal('A');
            expect(categories[1].find(headerText).getText()).to.equal('C');
            expect(categories[2].find(headerText).getText()).to.equal('L');
            expect(categories[3].find(headerText).getText()).to.equal('N');
            expect(categories[4].find(headerText).getText()).to.equal('O');
            expect(categories[5].find(headerText).getText()).to.equal('P');
            expect(categories[6].find(headerText).getText()).to.equal('S');
            expect(categories[7].find(headerText).getText()).to.equal('U');

            // check for no icon and border
            expect(categories[0].find('.eaLauncher-ApplicationList-group-iconHolder')).to.be.undefined;
            expect(categories[0].getAttribute('class').indexOf('eaLauncher-ApplicationList-group-borderColor')).to.equal(-1);

            // Check items inside for sorting
            var catAItems = categories[0].findAll('.eaLauncher-ListItem');
            expect(catAItems.length).to.equal(6);

            [
                'Advanced MO Scripting (AMOS)',
                'Alarm History',
                'Alarm Monitoring (FM)',
                'Alarm Text Routing (FM)',
                'Alex Library',
                'Automatic ID Management'
            ].forEach(function (value, index) {
                    expect(catAItems[index].find('a').getText().trim()).to.equal(value);
                });

            var catCItems = categories[1].findAll('.eaLauncher-ListItem');
            expect(catCItems.length).to.equal(1);
            expect(catCItems[0].find('a').getText().trim()).to.equal('Command Line Interface (CLI)');
        });

        it('if viewing favorites and no favorites are present, message will show instead', function () {
            appList.showAs('favorites');

            // should be no cat or items at all!
            var categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group');
            var listItems = appList.getElement().findAll('.eaLauncher-ListItem');
            expect(categories.length).to.equal(0);
            expect(listItems.length).to.equal(0);
            expect(appList.getElement().find('.eaLauncher-EmptyFavorites')).not.to.be.undefined;
        });

        it('#launcher/favorites should show Favorites', function () {
            var CloneREST = JSON.parse(JSON.stringify(REST_Groups));
            CloneREST[0].apps[1].favorite = 'true'; // alarmhistory
            CloneREST[4].apps[0].favorite = 'true'; // user management
            CloneREST[5].apps[1].favorite = 'true'; // command line interface
            appList.setApps(CloneREST);

            appList.showAs('favorites');

            // no message since we have favorites
            expect(appList.getElement().find('.eaLauncher-EmptyFavorites')).to.be.undefined;

            // should only be one category
            var categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group');
            expect(categories.length).to.equal(1);

            // no title or anything
            expect(categories[0].find(headerText)).to.be.undefined;
            expect(categories[0].find('.eaLauncher-ApplicationList-group-iconHolder')).to.be.undefined;
            expect(categories[0].getAttribute('class').indexOf('eaLauncher-ApplicationList-group-borderColor')).to.equal(-1);

            // verify the items
            var items = appList.getElement().findAll('.eaLauncher-ListItem');

            [
                'Alarm History',
                'OSS Monitoring (OSS-MT)',
                'User Management'
            ].forEach(function (value, index) {
                    expect(items[index].find('a').getText().trim()).to.equal(value);
                });

        });

        it('All Items should be destroyed on view change', function () {
            sinon.spy(ListItem.prototype, 'destroy');
            appList.showAs('groups');
            expect(ListItem.prototype.destroy.callCount).to.equal(0);
            appList.showAs('apps');
            expect(ListItem.prototype.destroy.callCount).to.equal(11);
            ListItem.prototype.destroy.restore();

        });

        it('favorite message should be gone on change', function () {
            appList.showAs('favorites');
            expect(appList.getElement().find('.eaLauncher-EmptyFavorites')).not.to.be.undefined;
            appList.showAs('apps');
            expect(appList.getElement().find('.eaLauncher-EmptyFavorites')).to.be.undefined;
        });

        it('All groups should be gone on view change', function () {
            appList.showAs('groups');
            var categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group');
            expect(categories.length).to.equal(6);
            appList.showAs('apps');
            categories = appList.getElement().findAll('.eaLauncher-ApplicationList-group');
            expect(categories.length).to.equal(8);
        });

    });

});
