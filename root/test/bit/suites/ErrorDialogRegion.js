define([
    'launcher/regions/ErrorDialogRegion/ErrorDialogRegion',
    'jscore/core',
    '../Stubs',
    'widgets/Dialog'
], function (ErrorDialogRegion, core, Stubs, Dialog) {

    describe('ErrorDialogRegion', function () {

        var errorDialogRegion;

        beforeEach(function () {
            var Context = Stubs.AppContext();
            errorDialogRegion = new ErrorDialogRegion({
                context: new Context()
            });
            errorDialogRegion.start(core.Element.wrap(container));
        });

        afterEach(function () {
            errorDialogRegion.stop();
        });

        it('should listen to error event and trigger onError', function () {
            sinon.stub(errorDialogRegion, 'onError');
            errorDialogRegion.getEventBus().publish('error');
            expect(errorDialogRegion.onError.callCount).to.equal(1);
        });

        it('should show a dialog onError', function () {
            sinon.spy(Dialog.prototype, 'init');
            errorDialogRegion.getEventBus().publish('error', {
                header: 'My Header'
            });
            expect(Dialog.prototype.init.calledWith({
                header: 'My Header',
                content: 'Please try again later.',
                visible: true,
                buttons: [
                    {caption: 'OK', color: 'blue', action: errorDialogRegion.hide}
                ]
            })).to.be.true;
            Dialog.prototype.init.restore();
        });

        it('should not show another dialog if one is already opened', function () {
            sinon.spy(Dialog.prototype, 'init');
            errorDialogRegion.getEventBus().publish('error', {
                header: 'My Header'
            });
            expect(Dialog.prototype.init.callCount).to.equal(1);
            errorDialogRegion.getEventBus().publish('error', {
                header: 'My Other Header'
            });
            expect(Dialog.prototype.init.callCount).to.equal(1);
            errorDialogRegion.hide();
            errorDialogRegion.getEventBus().publish('error', {
                header: 'Header 3'
            });
            expect(Dialog.prototype.init.callCount).to.equal(2);
            Dialog.prototype.init.restore();
        });

        it('should hide the dialog on click of button', function () {
            sinon.spy(Dialog.prototype, 'hide');
            errorDialogRegion.getEventBus().publish('error', {header: 'lol'});
            errorDialogRegion.hide();
            expect(Dialog.prototype.hide.callCount).to.equal(1);
            Dialog.prototype.hide.restore();
        })
    })

})