define([
    'launcher/ext/LocationService',
    'jscore/ext/locationController',
    'jscore/core'
], function (LocationService, LocationController, core) {

    describe('LocationService', function () {

        var eventBus;

        beforeEach(function () {
            eventBus = new core.EventBus();
            window.location.hash = '';

            // Need to do this so location events will work as expected
            core.App.prototype.start(document.body);
        });

        afterEach(function () {
            core.App.prototype.stop();
        });

        it('should instantiate LocationController with namespace', function () {
            sinon.spy(LocationController.prototype, 'init');

            LocationService.start({
                namespace: 'mynamespace',
                eventBus: eventBus
            });

            expect(LocationController.prototype.init.calledWith({
                namespace: 'mynamespace'
            })).to.be.true;

            LocationService.stop();
        });

        it('once started, should trigger hashchange event with hash to passed eventbus', function (done) {
            window.location.hash = 'mynamespace';

            var hashSpy = sinon.spy();
            eventBus.subscribe('hashchange', hashSpy);

            LocationService.start({
                namespace: 'mynamespace',
                eventBus: eventBus
            });

            expect(hashSpy.callCount).to.equal(1);
            expect(hashSpy.args[0][0]).to.equal('groups');

            // Why skip here and not above? Because we need the window hashchange event to occur.
            window.location.hash = 'mynamespace/apps';

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    expect(hashSpy.callCount).to.equal(2);
                    expect(hashSpy.args[1][0]).to.equal('apps');
                    LocationService.stop();
                    done();
                })
            })


        });

        it('should redirect to groups if invalid', function (done) {
            window.location.hash = 'mynamespace/apps';

            var hashSpy = sinon.spy();
            eventBus.subscribe('hashchange', hashSpy);

            LocationService.start({
                namespace: 'mynamespace',
                eventBus: eventBus
            });

            expect(hashSpy.callCount).to.equal(1);
            expect(hashSpy.args[0][0]).to.equal('apps');

            window.location.hash = 'mynamespace/fallback';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    expect(hashSpy.callCount).to.equal(2);
                    expect(hashSpy.args[1][0]).to.equal('groups');
                    expect(window.location.hash).to.equal('#mynamespace/groups');
                    done();
                })
            })
        });

        it('if stopped, should no longer trigger hashchange event', function (done) {
            window.location.hash = 'mynamespace';

            var hashSpy = sinon.spy();
            eventBus.subscribe('hashchange', hashSpy);

            LocationService.start({
                namespace: 'mynamespace',
                eventBus: eventBus
            });

            // Why skip here and not above? Because we need the window hashchange event to occur.
            LocationService.stop();
            window.location.hash = 'mynamespace/apps';

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    expect(hashSpy.callCount).to.equal(1);
                    expect(hashSpy.args[0][0]).to.equal('groups');
                    done();
                })
            })
        });

        it('retrigger should trigger hashchange with current hash', function (done) {
            var hashSpy = sinon.spy();
            eventBus.subscribe('hashchange', hashSpy);
            window.location.hash = 'mynamespace/favorites';

            LocationService.start({
                eventBus: eventBus,
                namespace: 'mynamespace'
            });

            expect(hashSpy.callCount).to.equal(1);
            expect(hashSpy.args[0][0]).to.equal('favorites');

            LocationService.retrigger();

            expect(hashSpy.callCount).to.equal(2);
            expect(hashSpy.args[1][0]).to.equal('favorites');
            done();

        });

    });

})