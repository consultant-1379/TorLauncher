define([
    'launcher/regions/ContentRegion/ContentRegion',
    'jscore/core',
    '../Stubs'
], function (ContentRegion, core, Stubs) {

    describe('ContentRegion', function () {

        var contentRegion;

        beforeEach(function () {
            contentRegion = new ContentRegion({
                context: new (Stubs.AppContext())()
            });
            contentRegion.start(core.Element.wrap(container));
        });

        afterEach(function () {
            contentRegion.stop();
        });

        it('should instantiate applist', function () {
            expect(contentRegion.getElement().find('.eaLauncher-ApplicationList')).not.to.be.undefined;
        });

        it('should call setApps once appsloaded', function () {
            sinon.stub(contentRegion.appList, 'setApps');
            contentRegion.getEventBus().publish('appsloaded', [{name: 'lol'}]);
            expect(contentRegion.appList.setApps.calledWith([{name: 'lol'}])).to.be.true;
        });

        it('should call showAs on hashchange', function () {
            sinon.stub(contentRegion.appList, 'showAs');
            contentRegion.getEventBus().publish('hashchange', 'groups');
            expect(contentRegion.appList.showAs.calledWith('groups')).to.be.true;
        });

        it('should hide list and show loader on appsloading', function () {
            sinon.stub(contentRegion.view, 'hideAppListContent');
            sinon.stub(contentRegion.view, 'showLoadingAnimation');
            contentRegion.getEventBus().publish('appsloading');
            expect(contentRegion.view.hideAppListContent.calledOnce).to.be.true;
            expect(contentRegion.view.showLoadingAnimation.calledOnce).to.be.true;
        });
    })

});