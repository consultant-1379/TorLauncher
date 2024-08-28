/*global define, describe, before, after, beforeEach, afterEach, it, expect, sinon */
define([
    'plugin/Plugin',
    'container/api'
], function (Plugin, container) {
    'use strict';

    var testSuiteTitle = document.title;
    var defaultTitle = "AppTitle";
    var systemIdentifier = "ENMHost";
    var defaultWithIdentifier = defaultTitle + ' - ' + systemIdentifier;

    var mockContainerOnBeforeAppChange = function () {
        document.title = defaultTitle;
    };

    function assertDefaultTitle() {
        expect(document.title).to.be.equal(defaultTitle);
    }

    function assertTitle(title) {
        expect(document.title).to.be.equal(title);
    }

    function mockHelpCenter(title) {
        document.title = title;
        container.getEventBus().publish('help:titlechange');
    }

    afterEach(function () {
        //Restore the original title
        document.title = testSuiteTitle;
    });

    describe('Plugin', function () {

        it('The plugin should call the container\'s onBeforeAppChange', function () {
            //The test suite title is still applied at this point
            assertTitle(testSuiteTitle);

            var pluginSpy = sinon.spy();
            Plugin.onBeforeAppChange(pluginSpy);
            expect(pluginSpy.calledOnce).to.be.true;
        });


        describe('System identifier unavailable', function () {

            it('should not modify the document title', function (done) {
                assertTitle(testSuiteTitle);
                Plugin.onBeforeAppChange(mockContainerOnBeforeAppChange);

                requestAnimationFrame(function () {
                    assertDefaultTitle();
                    expect(document.title.indexOf(systemIdentifier)).not.to.be.equal(0);
                    done();
                });
            });

            describe('Help Center used', function () {

                it('should not update the document title after help has set it', function (done) {
                    var helpTitle = 'Help1';
                    mockHelpCenter(helpTitle);
                    requestAnimationFrame(function () {
                        assertTitle(helpTitle);
                        done();
                    });
                });
            });
        });

        describe('System identifier available', function () {

            before(function () {
                container.getEventBus().publish('hostname', systemIdentifier);
            });

            after(function () {
                //Reset plugin
                container.getEventBus().publish('hostname', undefined);
            });

            it('should prepend the system identifier to the document title', function (done) {
                assertTitle(testSuiteTitle);

                Plugin.onBeforeAppChange(mockContainerOnBeforeAppChange);

                requestAnimationFrame(function () {
                    assertTitle(defaultWithIdentifier);
                    expect(document.title.indexOf(systemIdentifier)).to.be.above(0);
                    done();
                });
            });

            it('The document title should be updated after each application change', function (done) {
                var appTitle1 = "App1";
                assertTitle(testSuiteTitle);

                Plugin.onBeforeAppChange(mockContainerOnBeforeAppChange);

                requestAnimationFrame(function () {

                    assertTitle(defaultWithIdentifier);
                    Plugin.onBeforeAppChange(function () {
                        document.title = appTitle1;
                    });

                    requestAnimationFrame(function () {
                        assertTitle(appTitle1 + ' - ' + systemIdentifier);
                        done();
                    });
                });
            });

            describe('Help Center used', function () {

                //Note: Help center sets the document title itself, it notifies application when it has updated the title
                it('should update the document title after help center has set it', function (done) {
                    var helpTitle = 'Help1';
                    mockHelpCenter(helpTitle);
                    requestAnimationFrame(function () {
                        assertTitle(helpTitle + ' - ' + systemIdentifier);
                        done();
                    });
                });

            });
        });

        describe('System identifier updated', function () {

            after(function () {
                //Reset plugin
                container.getEventBus().publish('hostname', undefined);
            });

            it('should apply the new identifier after change', function (done) {
                var newSystemIdentifier = "New System";

                container.getEventBus().publish('hostname', systemIdentifier);

                Plugin.onBeforeAppChange(mockContainerOnBeforeAppChange);

                requestAnimationFrame(function () {
                    assertTitle(defaultWithIdentifier);
                    container.getEventBus().publish('hostname', newSystemIdentifier);

                    Plugin.onBeforeAppChange(mockContainerOnBeforeAppChange);

                    requestAnimationFrame(function () {
                        assertTitle(defaultTitle + ' - ' + newSystemIdentifier);
                        done();
                    });
                });
            });
        });
    });

});
