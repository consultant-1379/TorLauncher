/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'systemidentifier/Systemidentifier'
], function (Systemidentifier) {
    'use strict';


    describe('Systemidentifier', function () {

        var component;
        var server;


        var selectors = {
            caption: '.eaContainer-SystemBarComponent-caption',
            body: '.eaContainer-SystemBarComponent-body'
        };

        function startComponent() {
            component = new Systemidentifier({
                path: 'somePath'
            });
            component.start(document.body);
        }

        function assertText(identifier) {
            expect(component.getNativeElement().querySelector(selectors.caption).textContent).to.be.eq(identifier);
            expect(component.getNativeElement().title).to.be.eq(identifier);
        }

        function assertNotVisible() {
            expect(component.getNativeElement().style.display).to.be.eq('none');
        }

        function serverResponse(hostname, serverCode) {
            server.respondWith('GET', '/rest/system/v1/name', [
                serverCode || 200, {'Content-Type': 'application/json'}, JSON.stringify(hostname)
            ]);
        }

        function wait(cb) {
            setTimeout(cb, 200);
        }

        beforeEach(function () {
            server = sinon.fakeServer.create();
            server.autoRespond = true;
        });

        afterEach(function () {
            server.restore();
        });

        describe('style', function () {
            it('should overwrite the hover background', function (done) {
                var hostname = {
                    'name': 'enm-host'
                };

                startComponent();
                serverResponse(hostname, 200);
                wait(function () {
                    expect(component.getNativeElement().style['background-color']).to.be.eq('transparent');
                    done();
                });
            });

            it('should overwrite the cursor pointer', function (done) {
                var hostname = {
                    'name': 'enm-host'
                };

                startComponent();
                serverResponse(hostname, 200);
                wait(function () {
                    var body = component.getNativeElement().querySelector(selectors.body);
                    expect(body.style.cursor).to.be.eq('auto');
                    done();
                });
            });

            it('should limit the with of the caption to no more than 110 px', function (done) {
                var hostname = {
                    "name": "this-is-a-long-hostname-because-i-can.idowhatiwanttodo.com"
                };
                serverResponse(hostname, 200);
                startComponent();
                wait(function () {
                    var caption = component.getNativeElement().querySelector(selectors.caption);
                    expect(caption.offsetWidth).to.be.within(30, 110);
                    done();
                });
            });
        });

        describe('identifier', function () {
            it('should show hostname', function (done) {
                var hostname = {
                    'name': 'enm-host'
                };
                serverResponse(hostname, 200);
                startComponent();
                wait(function () {
                    assertText(hostname.name);
                    done();
                });
            });

            it('should not display hostname when name is blank', function (done) {
                var hostname = {
                    'name': ''
                };
                serverResponse(hostname, 200);
                startComponent();
                wait(function () {
                    assertNotVisible();
                    done();
                });
            });

            it('should not display hostname when name is null', function (done) {
                var hostname = {
                    'name': null
                };
                serverResponse(hostname, 200);
                startComponent();
                wait(function () {
                    assertNotVisible();
                    done();
                });
            });

            it('should not display hostname when property name does not exist', function (done) {
                var hostname = {
                    'not_name': 'enm-host'
                };
                serverResponse(hostname, 200);
                startComponent();
                wait(function () {
                    assertNotVisible();
                    done();
                });
            });

            it('should not display hostname when API fails (error)', function (done) {
                serverResponse({}, 403);
                startComponent();
                wait(function () {
                    assertNotVisible();
                    done();
                });
            });
        });
    });
});