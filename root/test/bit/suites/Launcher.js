define([
    'launcher/Launcher',
    '../bitPromises',
    'jscore/core',
    '../REST_Groups',
    'launcher/ext/AppsService',
    '../Stubs'
], function (Launcher, Promises, core, REST_Groups, AppsService, Stubs) {

    describe('Launcher', function () {
        var launcher, server;

        beforeEach(function () {
            server = sinon.fakeServer.create();
            sinon.stub(core.EventBus.prototype, 'publish');
            server.respondWith('GET', '/rest/groups', function (xhr) {
                xhr.respond(
                    200,
                    {
                        'Content-type': 'application/json'
                    },
                    JSON.stringify(REST_Groups)
                );
            });

            launcher = new Launcher({
                properties: {
                    title: 'Application Launcher'
                },
                namespace: 'launcher'
            });
            launcher.start(core.Element.wrap(container));
            window.location.hash = '';
        });

        afterEach(function () {
            core.EventBus.prototype.publish.restore();
            server.restore();
            launcher.stop();
        });

        describe('Location Change', function () {
            it('default -- groups', function (done) {
                Promises.hashChange('#launcher').then(function () {
                    server.respond();
                    expect(core.EventBus.prototype.publish.calledWith('hashchange', 'groups')).to.be.true;
                    done();
                });

            });

            it('#launcher/groups', function (done) {
                Promises.hashChange('#launcher/groups').then(function () {
                    server.respond();
                    expect(core.EventBus.prototype.publish.calledWith('hashchange', 'groups')).to.be.true;
                    done();
                });

            });

            it('#launcher/favorites', function (done) {
                Promises.hashChange('#launcher/favorites').then(function () {
                    server.respond();
                    expect(core.EventBus.prototype.publish.calledWith('hashchange', 'favorites')).to.be.true;
                    done();
                });

            });

            it('#launcher/apps', function (done) {
                Promises.hashChange('#launcher/apps').then(function () {
                    server.respond();
                    expect(core.EventBus.prototype.publish.calledWith('hashchange', 'apps')).to.be.true;
                    done();
                });
            })
        });

        describe('onStart', function () {
            it('should fetch apps and trigger appsloaded and hashchange', function (done) {
                Promises.hashChange('#launcher/favorites').then(function () {
                    server.respond();
                    expect(core.EventBus.prototype.publish.calledWith('appsloaded', Stubs.sortedRESTGroups())).to.be.true;
                    expect(core.EventBus.prototype.publish.calledWith('hashchange', 'favorites')).to.be.true;
                    done();
                });
            });
        });

        describe('onResume', function () {
            it('should fetch apps and trigger appsloading, appsloaded and hashchange', function (done) {
                launcher.onResume();
                server.respond();
                expect(core.EventBus.prototype.publish.calledWith('appsloading')).to.be.true;
                expect(core.EventBus.prototype.publish.calledWith('appsloaded', Stubs.sortedRESTGroups())).to.be.true;
                expect(core.EventBus.prototype.publish.calledWith('hashchange', 'favorites')).to.be.true;
                done();
            });
        });

    });

});