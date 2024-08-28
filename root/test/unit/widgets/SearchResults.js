define([
    'jscore/core',
    'launcher/widgets/SearchResults/SearchResults'
], function(core, SearchResults) {

    describe("SearchResults", function() {
        var sandbox, objectUnderTest;
        var requestAnimationFrameId = 123;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            objectUnderTest = new SearchResults();
        });

        afterEach(function () {
            objectUnderTest = undefined;
            sandbox.restore();
        });

        describe("show", function() {
            var setStyleOptions;

            beforeEach(function () {
                objectUnderTest.tracker = {
                    getPosition: function() {},
                    getProperty: function() {}
                };

                objectUnderTest.getElement = function() {
                    return {
                        setStyle: function(options) {setStyleOptions=options;}
                    };
                };
                objectUnderTest.bodyEvent = 1;
                window.innerHeight = 200;
                sandbox.stub(objectUnderTest, 'attachTo');
                sandbox.stub(window, 'requestAnimationFrame').returns(123);
            });

            describe("Widget not attached", function() {
                beforeEach(function () {
                    sandbox.stub(objectUnderTest, 'isAttached').returns(false);
                    sandbox.stub(objectUnderTest.tracker, 'getPosition').returns({
                        top: 12,
                        left: 6
                    });
                    sandbox.stub(objectUnderTest.tracker, 'getProperty').returns(20);
                });

                it ("should attach the widget", function() {
                    // ACT
                    objectUnderTest.show();
                    // ASSERT
                    expect(objectUnderTest.isShowing).to.equal(true);
                    expect(objectUnderTest.index).to.equal(-1);
                    expect(objectUnderTest.attachTo.callCount).to.equal(1);
                });
            });

            describe("Widget attached", function() {
                beforeEach(function () {
                    sandbox.stub(objectUnderTest, 'isAttached').returns(true);
                    sandbox.stub(objectUnderTest.tracker, 'getPosition').returns({
                        top: 12,
                        left: 6
                    });
                    sandbox.stub(objectUnderTest.tracker, 'getProperty').returns(20);
                });

                it ("should not attach the widget when already attached", function() {
                    // ACT
                    objectUnderTest.show();
                    // ASSERT
                    expect(objectUnderTest.isShowing).to.equal(true);
                    expect(objectUnderTest.index).to.equal(-1);
                    expect(objectUnderTest.attachTo.callCount).to.equal(0);
                });

                it ("__updateStyle", function() {
                    // ACT
                    objectUnderTest.show();
                    // ASSERT
                    expect(objectUnderTest.tracker.getPosition.callCount).to.equal(1);
                    expect(objectUnderTest.tracker.getProperty.callCount).to.equal(2);
                    expect(setStyleOptions.top).to.equal(34);
                    expect(setStyleOptions.left).to.equal(8);
                    expect(setStyleOptions.width).to.equal(14);
                    expect(setStyleOptions.maxHeight).to.equal(166);
                });
            });
        });
    });
});