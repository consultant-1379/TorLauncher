define([
    'launcher/widgets/ListItem/ListItem',
    'jscore/core',
    '../bitPromises',
    'launcher/ext/AppsService',
    'launcher/ext/LocationService'
], function (ListItem, core, Promises, AppsService, LocationService) {

    describe('List Item', function () {

        var listItem;

        function createItem(options) {
            listItem = new ListItem(options);
            listItem.attachTo(core.Element.wrap(container));
        }

        function assertFav(item, state) {
            expect(item.getElement().find('.eaLauncher-ListItem-favIcon').hasModifier('favorited', state + '')).to.be.true;
        }

        afterEach(function () {
            if (listItem) {
                listItem.destroy();
                listItem = undefined;
            }

        });

        it('check required options', function () {
            createItem({
                name: 'My App',
                uri: '/rest/app/myapp'
            });
            expect(listItem.getElement().getAttribute('tabindex')).to.equal('0');
            expect(listItem.getElement().find('a').getText().trim()).to.equal('My App');
            expect(listItem.getElement().find('a').getAttribute('href')).to.equal('/rest/app/myapp');
            expect(listItem.getElement().find('.eaLauncher-ListItem-infoIcon')).to.be.undefined;
            expect(listItem.getElement().find('.eaLauncher-ListItem-acronym')).to.be.undefined;

        });

        it('should add icon if shortInfo is supplied', function () {
            createItem({
                name: 'My App',
                uri: '/rest/app/myapp',
                shortInfo: 'My Short Info'
            });
            expect(listItem.getElement().find('.eaLauncher-ListItem-infoIcon')).not.to.be.undefined;
        });

        it('should add acronym if supplied', function () {
            createItem({
                name: 'My App',
                uri: '/rest/app/myapp',
                acronym: 'MA'
            });
            expect(listItem.getElement().find('.eaLauncher-ListItem-acronym')).not.to.be.undefined;
            expect(listItem.getElement().find('.eaLauncher-ListItem-acronym').getText()).to.equal(' (MA)');
        });

        it('pressing f should favorite the app', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(AppsService, 'updateFavorite');
            Promises.sendKeys(listItem.getElement(), 'f')
                .then(function () {
                    expect(AppsService.updateFavorite.callCount).to.equal(1);
                    expect(AppsService.updateFavorite.calledWith('myapp', true));
                    return Promises.sendKeys(listItem.getElement(), 'F');
                })
                .then(function () {
                    expect(AppsService.updateFavorite.callCount).to.equal(2);
                    AppsService.updateFavorite.restore();
                    done();
                });

        });

        it('pressing i should toggle the info for the app', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                shortInfo: 'lol'
            });

            Promises.sendKeys(listItem.getElement(), 'i')
                .then(function () {
                    expect(listItem.getElement().find('.eaLauncher-Tooltip')).not.to.be.undefined;
                    return Promises.sendKeys(listItem.getElement(), 'I')
                })
                .then(function () {
                    expect(listItem.getElement().find('.eaLauncher-Tooltip')).to.be.undefined;
                    done();
                })
        });

        it('pressing enter should trigger the app', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(listItem, 'launchApp');
            Promises.sendKeys(listItem.getElement(), '\\x13') // enter key
                .then(function () {
                    expect(listItem.launchApp.callCount).to.equal(1);
                    listItem.launchApp.restore();
                    done();
                });
        });

        it('pressing click should trigger the app in same tab', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: false,
                        shiftKey: false,
                        which: 0
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(1);
            expect(listItem.launchAppInNewTab.callCount).to.equal(0);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();

        });

        it('pressing ctrl + click should trigger the app in new tab', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: true,
                        shiftKey: false,
                        which: 0
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(0);
            expect(listItem.launchAppInNewTab.callCount).to.equal(1);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();

        });

        it('pressing shift + click should trigger the app in new tab', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: false,
                        shiftKey: true,
                        which: 0
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(0);
            expect(listItem.launchAppInNewTab.callCount).to.equal(1);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();

        });

        it('pressing middle mouse button should trigger the app in new tab', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: true,
                        shiftKey: false,
                        which: 2
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(0);
            expect(listItem.launchAppInNewTab.callCount).to.equal(1);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();

        });

        it('Should open in new tab if openInNewWindow is true', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: false,
                        shiftKey: false,
                        which: 0
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                openInNewWindow: true
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(0);
            expect(listItem.launchAppInNewTab.callCount).to.equal(1);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();
        });

        it('Should open in same tab if openInNewWindow is false', function (done) {

            var originalLaunchAppMethod = ListItem.prototype.launchApp;
            ListItem.prototype.launchApp = function (e) {
                e = {
                    preventDefault: e.preventDefault,
                    originalEvent: {
                        ctrlKey: false,
                        shiftKey: false,
                        which: 0
                    }
                };
                originalLaunchAppMethod.call(this, e);
            };

            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                openInNewWindow: false
            });

            sinon.stub(listItem, 'launchAppInNewTab');
            sinon.stub(listItem, 'launchAppInSameTab');

            listItem.getElement().find('.eaLauncher-ListItem-label').trigger('click');
            expect(listItem.launchAppInSameTab.callCount).to.equal(1);
            expect(listItem.launchAppInNewTab.callCount).to.equal(0);
            listItem.launchAppInNewTab.restore();
            listItem.launchAppInSameTab.restore();
            ListItem.prototype.launchApp = originalLaunchAppMethod;
            done();
        });

        it('should be able to click info icon', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                shortInfo: 'lol'
            });

            listItem.getElement().find('.eaLauncher-ListItem-infoIcon').trigger('click');
            expect(listItem.getElement().find('.eaLauncher-Tooltip')).not.to.be.undefined;
            expect(document.activeElement).to.equal(listItem.getElement().getNative());
            expect(listItem.getElement().hasModifier('selected', 'true')).to.be.true;

            listItem.getElement().find('.eaLauncher-ListItem-infoIcon').trigger('click');
            expect(listItem.getElement().find('.eaLauncher-Tooltip')).to.be.undefined;
            expect(listItem.getElement().hasModifier('selected', 'true')).to.be.false;
            done();
        });


        it('shortInfo should be used for tooltip', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                shortInfo: 'lol 123'
            });

            listItem.getElement().find('.eaLauncher-ListItem-infoIcon').trigger('click');
            var tooltip = listItem.getElement().find('.eaLauncher-Tooltip-contentText');
            expect(tooltip.getText().trim()).to.equal('lol 123');
            done();
        });

        it('should be able to click favorite icon', function (done) {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp'
            });

            sinon.stub(AppsService, 'updateFavorite');
            listItem.getElement().find('.eaLauncher-ListItem-favIcon').trigger('click');
            expect(AppsService.updateFavorite.calledWith('myapp', true)).to.be.true;
            AppsService.updateFavorite.restore();
            done();
        });

        it('blurring from item should close info popup', function () {
            createItem({
                id: 'myapp',
                name: 'My App',
                uri: '/rest/app/myapp',
                shortInfo: 'lol'
            });

            listItem.getElement().find('.eaLauncher-ListItem-infoIcon').trigger('click');
            expect(listItem.getElement().find('.eaLauncher-Tooltip')).not.to.be.undefined;
            expect(document.activeElement).to.equal(listItem.getElement().getNative());
            expect(listItem.getElement().hasModifier('selected', 'true')).to.be.true;

            listItem.getElement().getNative().blur();
            expect(listItem.getElement().find('.eaLauncher-Tooltip')).to.be.undefined;
            expect(listItem.getElement().hasModifier('selected', 'true')).to.be.false;
        });

        it('if favorite is passed as an argument, should already be favorited', function (done) {
            createItem({
                id: 'favapp',
                name: 'My Favorite App',
                uri: '/dat/app',
                favorite: 'true'
            });

            expect(listItem.getElement().find('.eaLauncher-ListItem-favIcon').hasModifier('favorited', 'true')).to.be.true;
            sinon.stub(AppsService, 'updateFavorite');
            listItem.getElement().find('.eaLauncher-ListItem-favIcon').trigger('click');
            expect(AppsService.updateFavorite.calledWith('favapp', false));
            AppsService.updateFavorite.restore();
            done();
        });

        it('should unsubscribe from AppsService favorite updates when destroyed', function () {
            sinon.stub(AppsService, 'subscribe', function () {
                return 'handle';
            });

            createItem({
                id: 'boringapp',
                name: ':(',
                uri: '/sad/face'
            });

            sinon.stub(AppsService, 'unsubscribe');
            listItem.destroy();
            expect(AppsService.unsubscribe.calledWith('favorite', 'handle')).to.be.true;
            AppsService.subscribe.restore();
            AppsService.unsubscribe.restore();
        });


        it('changing favorite should update all other instances with the same id', function () {

            sinon.stub(AppsService, 'updateFavorite');

            var listItem1 = new ListItem({
                id: 'myapp1'
            });
            listItem1.attachTo(core.Element.wrap(container));

            var listItem2 = new ListItem({
                id: 'myapp1'
            });
            listItem2.attachTo(core.Element.wrap(container));

            var listItem3 = new ListItem({
                id: 'myapp3'
            });
            listItem3.attachTo(core.Element.wrap(container));

            listItem1.getElement().find('.eaLauncher-ListItem-favIcon').trigger('click');
            // This is actually correct, we don't want the favorite state to update until we hear back.
            assertFav(listItem1, false);
            AppsService.publish('favorite', 'myapp1', true);

            // Now that we've heard back, all of the items should be updated.
            assertFav(listItem1, true);
            assertFav(listItem2, true);
            assertFav(listItem3, false);
            AppsService.updateFavorite.restore();
            listItem3.destroy();
            listItem2.destroy();
            listItem1.destroy();
        });

    })

})