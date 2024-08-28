/* global define, describe, it, beforeEach, afterEach, after, before, expect */
define([
    'jscore/core',
    'enmcontainerhelper/ENMContainerHelper',
    'container/api',
    'logger/main'
], function (core, ENMContainerHelper, container, fakeLogger) {
    'use strict';

    describe('ENMContainerHelper', function () {
        var app,
            loggerErrorSpy;

        var coreWindowError = {
            error: new Error('Some error'),
            message: 'Some message',
            filename: 'Some File'
        };

        var containerAppChangeWithoutError = {
            app: 'myApp',
            breadcrumb: [{name: 'ENM'}, {name: 'App1'}, {name: 'App2'}]
        };

        var containerAppChangeError = {
            error: 'Application not found',
            errorObject: new Error('My error')
        };

        before(function () {
            loggerErrorSpy = sinon.spy(fakeLogger, 'error');
        });

        afterEach(function () {
            loggerErrorSpy.reset();
        });

        after(function () {
            loggerErrorSpy.restore();
        });

        beforeEach(function () {
            app = new ENMContainerHelper();
            app.start(core.Element.wrap(document.body));
        });

        afterEach(function () {
            clearApp();
        });

        function clearApp() {
            if (app !== undefined) {
                app.stop();
                app = undefined;
            }
        }

        function triggerContainerWindowError() {
            container.getEventBus().publish('container:appchange', containerAppChangeError);
        }

        function triggerAppChange() {
            container.getEventBus().publish('container:appchange', containerAppChangeWithoutError);
        }

        describe('ContainerLogger', function () {

            function triggerWindowError() {
                core.Window.trigger('error', coreWindowError);
            }

            it('should log window errors', function (done) {
                triggerWindowError();
                expect(loggerErrorSpy.calledOnce).to.be.true;
                var args = loggerErrorSpy.getCall(0).args;
                expect(args[0]).to.be.eq(coreWindowError.message);
                expect(args[1]).to.be.eq(coreWindowError.filename);
                expect(args[2]).to.be.eq(coreWindowError.error);
                done();
            });

            it('should log container application errors', function () {
                triggerContainerWindowError();
                expect(loggerErrorSpy.calledOnce).to.be.true;
                var args = loggerErrorSpy.getCall(0).args;
                expect(args[0]).to.be.eq(containerAppChangeError.error);
                expect(args[1]).to.be.eq(containerAppChangeError.errorObject.name);
                expect(args[2]).to.be.eq(containerAppChangeError.errorObject);

            });

            it('should not log if the application changed without error', function () {
                triggerAppChange();
                expect(loggerErrorSpy.calledOnce).to.be.false;
            });

            it('should not log window errors when the component is stopped', function () {
                clearApp();
                triggerContainerWindowError();
                expect(loggerErrorSpy.calledOnce).to.be.false;
            });

            it('should not log container application errors when the component is stopped', function () {
                clearApp();
                triggerContainerWindowError();
                expect(loggerErrorSpy.calledOnce).to.be.false;
            });
        });

        describe('ApplicationLogger', function () {

            var server;

            beforeEach(function () {
                server = sinon.fakeServer.create();
            });

            afterEach(function () {
                server.restore();
            });

            function assertNumberOfServerRequests(number) {
                expect(server.requests.length).to.be.equal(number);
            }

            it('should log when an application has changed', function () {
                triggerAppChange();
                assertNumberOfServerRequests(1);
                expect(server.requests[0].url).to.be.equal('/?applicationPath=["App1","App2"]');
            });

            it('should not log application when the app change event returns an error', function () {
                triggerContainerWindowError();
                assertNumberOfServerRequests(0);
            });

            it('should not log applications when component is stopped', function () {
                clearApp();
                triggerAppChange();
                assertNumberOfServerRequests(0);
            });
        });
    });
});
