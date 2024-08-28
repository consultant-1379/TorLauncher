define([
    'launcher/regions/ActionBarRegion/ActionBarRegion',
    'jscore/core',
    '../Stubs'
], function (ActionBarRegion, core, Stubs) {

    describe('ActionBarRegion', function () {

        var actionBarRegion;

        beforeEach(function () {
            var Context = Stubs.AppContext();
            actionBarRegion = new ActionBarRegion({
                context: new Context()
            });
            actionBarRegion.start(core.Element.wrap(container));
        });

        afterEach(function () {
            actionBarRegion.stop();
        });

        it('should instantiate search and button group', function () {
            expect(actionBarRegion.getElement().find('.eaLauncher-Search')).not.to.be.undefined;
            expect(actionBarRegion.getElement().find('.eaLauncher-ButtonGroup')).not.to.be.undefined;
        });

        it('should call setApps on search after appsloaded', function () {
            sinon.stub(actionBarRegion.search, 'setApps');
            actionBarRegion.getEventBus().publish('appsloaded', [
                {name: 'lol'}
            ]);
            expect(actionBarRegion.search.setApps.calledWith([{name: 'lol'}])).to.be.true;
        });

        it('should call setSelection on buttongroup after hashchange', function () {
            sinon.stub(actionBarRegion.buttonGroup, 'setSelection');
            actionBarRegion.getEventBus().publish('hashchange', 'groups');
            expect(actionBarRegion.buttonGroup.setSelection.calledWith('groups')).to.be.true;
        });
    })

})