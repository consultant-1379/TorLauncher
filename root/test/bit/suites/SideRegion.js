define([
    'launcher/regions/SideRegion/SideRegion',
    'jscore/core',
    '../Stubs'
], function (SideRegion, core, Stubs) {

    describe('SideRegion', function () {

        var sideRegion, coreSetIntervalStub;

        before(function () {
            sideRegion = new SideRegion({
                delay: 500,
                removeTimeout: 50
            });
            coreSetIntervalStub = sinon.stub(core.Window, 'setInterval', function (fn, time) {
                var handle = setInterval(fn, time);

                return {
                    stop: function () {
                        clearInterval(handle);
                    }
                };
            });
        });

        after(function () {
            coreSetIntervalStub.restore();
        });

        beforeEach(function () {
            sideRegion.start(core.Element.wrap(container));
        });

        afterEach(function () {
            sideRegion.stop();
        });

        describe('Tutorial URL Link', function(){
           it('tutorial link should be: "#help/topic/network-management-workflows"',function(){
               var tutorialHREFLink = sideRegion.getElement().find('[data-name="tutorials"]');
               expect(tutorialHREFLink.getAttribute('href')).to.equal('#help/topic/network-management-workflows');
           });
        });

        describe('Help URL Link', function(){
           it('help link should be: "#help', function(){
               var helpHREFLink = sideRegion.getElement().find('[data-name="help"]');
               expect(helpHREFLink.getAttribute('href')).to.equal('#help');
           })
        });
    });
});