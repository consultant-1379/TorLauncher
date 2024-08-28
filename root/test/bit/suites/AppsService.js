define([
    'launcher/ext/AppsService',
    '../REST_Groups',
    'jscore/core',
    '../Stubs'
], function (AppsService, REST_Groups, core, Stubs) {

    describe('AppsService', function () {

        var xhr, requests, eventBus;

        // Sinon Fake Implementation of abort is incorrect.
        // In real browser scenarios the onload and onerror
        // do not trigger when you abort a request.
        var requests = [];
        var __FakeAbort = sinon.FakeXMLHttpRequest.prototype.abort;
        sinon.FakeXMLHttpRequest.prototype.abort = function () {
            this.onload = function () {
            };
            this.onerror = function () {
            };
            __FakeAbort.call(this);
        };

        var goodResponse = [200, {
            'Content-Type': 'application/json'
        }, JSON.stringify(REST_Groups)];

        var badResponse = [400];

        beforeEach(function () {
            AppsService.clearApps();
            requests = [];
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function (req) {
                requests.push(req);
            };

            eventBus = new core.EventBus();
            AppsService.setEventBus(eventBus);
        });

        afterEach(function () {
            xhr.restore();
        });

        describe('getApps', function () {
            var callback, errorback;

            beforeEach(function () {
                callback = sinon.spy();
                errorback = sinon.spy();
                eventBus.subscribe('error', errorback);
                AppsService.getApps(callback);
            });

            it('should call /rest/groups for data and call callback', function () {
                requests[0].respond.apply(requests[0], goodResponse);
                expect(callback.calledWith(Stubs.sortedRESTGroups())).to.be.true;
            });

            it('if immediate error, should retry (fail pass)', function () {
                requests[0].respond.apply(requests[0], badResponse);
                expect(callback.callCount).to.equal(0);
                requests[1].respond.apply(requests[1], goodResponse);
                expect(errorback.callCount).to.equal(0);
            });

            it('should publish error on event bus if all four attempts fail', function () {
                requests[0].respond.apply(requests[0], badResponse);
                expect(callback.callCount).to.equal(0);
                requests[1].respond.apply(requests[1], badResponse);
                expect(callback.callCount).to.equal(0);
                expect(errorback.callCount).to.equal(1);
            });

            it('if timed out, should abort and retry (fail pass)', function (done) {
                this.timeout(70000);

                setTimeout(function () {
                    expect(requests[0].aborted).to.be.true;
                    expect(requests.length).to.equal(2);
                }, 31000); // 2000 passed

                setTimeout(function () {
                    requests[1].respond.apply(requests[1], goodResponse);
                    expect(callback.callCount).to.equal(1);
                    expect(errorback.callCount).to.equal(0);
                    done();
                }, 31000); // 2000 + 2000 + 5000 + middle of 10000
            });


            it('if all timed out, should throw error', function (done) {
                this.timeout(70000);

                // setTimeout(function () {
                //     expect(requests[0].aborted).to.be.true;
                //     expect(requests.length).to.equal(2);
                // }, 31000); // 2000 passed

                setTimeout(function () {
                    expect(requests[0].aborted).to.be.true;
                    expect(callback.callCount).to.equal(0);
                    expect(errorback.callCount).to.equal(1);
                    done();
                }, 61000); // 2000 + 2000 + 5000 + 10000
            });

        });

        describe('Internal Event Bus', function () {

            it('subscribe, unsubscribe, publish working', function () {
                var callback1 = sinon.spy();
                var callback2 = sinon.spy();
                var callback3 = sinon.spy();

                var handle1 = AppsService.subscribe('channel', callback1);
                var handle2 = AppsService.subscribe('channel', callback2);
                var handle3 = AppsService.subscribe('otherchannel', callback3);
                AppsService.publish('channel', 'lol');
                expect(callback1.calledWith('lol')).to.be.true;
                expect(callback2.calledWith('lol')).to.be.true;
                expect(callback3.calledWith('lol')).to.be.false;

                AppsService.unsubscribe('channel', handle1);
                AppsService.publish('channel', 'abc');
                expect(callback1.calledWith('abc')).to.be.false;
                expect(callback2.calledWith('abc')).to.be.true;
                expect(callback3.calledWith('abc')).to.be.false;

                AppsService.unsubscribe('channel', handle2);
                AppsService.unsubscribe('otherchannel', handle3);
            });

        });

        describe('updateFavorite', function () {
            it('should call ui settings with fav delta', function () {
                AppsService.updateFavorite('someid', true);
                expect(requests[0].url).to.equal('/rest/ui/settings/launcher/favorites');
                expect(requests[0].method).to.equal('PUT');
                expect(requests[0].requestHeaders['Content-Type'].indexOf('application/json') === 0).to.be.true;

                expect(requests[0].requestBody).to.equal(JSON.stringify({
                    id: 'someid',
                    value: 'true'
                }));
            });

            it('should update internal apps array with new state', function () {
                var theApps;

                AppsService.getApps(function (apps) {
                    theApps = apps;
                });

                requests[0].respond.apply(requests[0], goodResponse);

                AppsService.updateFavorite('autoidmanagement', true);
                requests[1].respond.apply(requests[1], [200]);
                expect(theApps[2].apps[0].id).to.equal('autoidmanagement');
                expect(theApps[2].apps[0].favorite).to.equal('true');
                AppsService.updateFavorite('autoidmanagement', false);
                requests[2].respond.apply(requests[2], [200]);
                expect(theApps[2].apps[0].id).to.equal('autoidmanagement');
                expect(theApps[2].apps[0].favorite).to.equal('false');
            });

            it('should publish favorite on internalEB with id and state', function () {
                var controlback = sinon.spy();
                eventBus.subscribe('favorite', controlback);

                var favoriteback = sinon.spy();
                AppsService.subscribe('favorite', favoriteback);
                AppsService.getApps(function () {
                });
                requests[0].respond.apply(requests[0], goodResponse);
                AppsService.updateFavorite('alarmhistory', true);
                requests[1].respond.apply(requests[1], [200]);
                expect(favoriteback.callCount).to.equal(1);
                expect(favoriteback.calledWith('alarmhistory', true)).to.be.true;
                AppsService.updateFavorite('alarmhistory', false);
                requests[2].respond.apply(requests[2], [200]);
                expect(favoriteback.callCount).to.equal(2);
                expect(favoriteback.calledWith('alarmhistory', false)).to.be.true;

                expect(controlback.callCount).to.equal(0);
            });

            it('should publish error on app event bus if fails', function () {
                var favoriteback = sinon.spy();
                var errorback = sinon.spy();
                AppsService.subscribe('favorite', favoriteback);
                eventBus.subscribe('error', errorback);

                var theApps;
                AppsService.getApps(function (apps) {
                    theApps = apps;
                });
                requests[0].respond.apply(requests[0], goodResponse);
                AppsService.updateFavorite('autoidmanagement', true);
                requests[1].respond.apply(requests[1], [404]);
                expect(theApps[2].apps[0].id).to.equal('autoidmanagement');
                expect(theApps[2].apps[0].favorite).to.equal('false');
                expect(favoriteback.callCount).to.equal(0);
                expect(errorback.callCount).to.equal(1);
            });
        });

    })

})