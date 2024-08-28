define([
    'launcher/widgets/Search/Search',
    'launcher/widgets/ListItem/ListItem',
    'jscore/core',
    '../bitPromises',
    'launcher/ext/LocationService',
    'launcher/ext/AppsService',
    '../Stubs'
], function (Search, ListItem, core, Promises, LocationService, AppsService, Stubs) {

    describe('Search Field', function () {

        var search;
        var up = '\\x38';
        var down = '\\x40';

        beforeEach(function () {
            search = new Search();
            search.setApps(Stubs.sortedRESTGroups());
            search.attachTo(core.Element.wrap(container));

            // Start core.App in order to get styles attached
            core.App.prototype.start(document.body);
        });

        afterEach(function () {
            search.destroy();
            core.App.prototype.stop();
        });

        function getResults() {
            return document.querySelector('.eaLauncher-SearchResults');
        }

        function getFocusedItem() {
            return document.querySelector('.eaLauncher-ListItem_focused');
        }

        function getFocusedItemLabel() {
            return document.querySelector('.eaLauncher-ListItem_focused .eaLauncher-ListItem-label');
        }

        function getLabelHighlighted(label) {
            return label.querySelector('.eaLauncher-ListItem-highlight').textContent;
        }

        it('should should show dropdown with filtered apps on keypress', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alarm');
                    var results = getResults();
                    expect(results).not.to.be.null;
                    expect(results.children.length).to.equal(3);
                    done();
                })
        });

        it('should hide dropdown when there\'s no content', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alarm');
                    // Send backspace character
                    return Promises.sendKeys(search.view.getInput(), '\\x08');
                })
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alar');
                    expect(getResults()).not.to.be.null;
                    return Promises.sendKeys(search.view.getInput(), '\\x08\\x08\\x08\\x08');
                })
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('');
                    expect(getResults()).to.be.null;
                    done();
                });
        });

        it('should show cancel button appropriately', function (done) {
            expect(search.view.getCancel().getStyle('display')).to.equal('none');
            Promises.sendKeys(search.view.getInput(), 'A')
                .then(function () {
                    expect(search.view.getCancel().getStyle('display')).to.equal('block');
                    return Promises.sendKeys(search.view.getInput(), '\\x08');
                })
                .then(function () {
                    expect(search.view.getCancel().getStyle('display')).to.equal('none');
                    done();
                });
        })

        it('clicking close should wipe the value and hide dropdown', function (done) {
            Promises.sendKeys(search.view.getInput(), 'A')
                .then(function () {
                    search.view.getCancel().trigger('click');
                    expect(getResults()).to.be.null;
                    done();
                })
        });

        it('tab should close dropdown', function (done) {
            Promises.sendKeys(search.view.getInput(), 'A')
                .then(function () {
                    return Promises.sendKeys(search.view.getInput(), '\\x09')
                })
                .then(function () {
                    expect(getResults()).to.be.null;
                    done();
                })
        });

        it('ESC should close dropdown', function (done) {
            Promises.sendKeys(search.view.getInput(), 'A')
                .then(function () {
                    return Promises.sendKeys(search.view.getInput(), '\\x27')
                })
                .then(function () {
                    expect(getResults()).to.be.null;
                    done();
                })
        });

        it('should highlight the searched string', function (done) {
            var testHighlight = function (el, check) {
                var html = el.querySelector('.eaLauncher-ListItem-label').innerHTML;
                check = check.replace('[', '<span class="eaLauncher-ListItem-highlight">')
                check = check.replace(']', '</span>');
                html = html.replace(/<span class='eaLauncher-ListItem-acronym'>(.*?)<\/span>/, '');
                expect(html).to.include(check);
            };


            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    var results = getResults();
                    testHighlight(results.children[0], '[Alarm] History');
                    search.view.getInput().setValue('');
                    return Promises.sendKeys(search.view.getInput(), 'Automatic');
                })
                .then(function () {
                    var results = getResults();
                    testHighlight(results.children[0], '[Automatic] ID Management')
                    done();
                })
        });

        it('up and down should cycle through items', function (done) {
            /**
             * Alarm History
             * Alarm Monitoring (FM)
             * Alarm Text Routing (FM)
             */

            var assert = function (value) {
                expect(getFocusedItemLabel().textContent.trim()).to.equal(value);
            };

            var press = function (dir) {
                return Promises.sendKeys(search.view.getInput(), dir);
            };

            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    expect(getFocusedItem()).to.be.null;
                    return press(up);
                })
                .then(function () {
                    assert('Alarm Text Routing (FM)');
                    return press(up);
                })
                .then(function () {
                    assert('Alarm Monitoring (FM)');
                    return press(up);
                })
                .then(function () {
                    assert('Alarm History');
                    return press(up);
                })
                .then(function () {
                    expect(getFocusedItem()).to.be.null;
                    return press(down);
                })
                .then(function () {
                    assert('Alarm History');
                    return press(down);
                })
                .then(function () {
                    assert('Alarm Monitoring (FM)')
                    return press(down);
                })
                .then(function () {
                    assert('Alarm Text Routing (FM)')
                    return press(down);
                })
                .then(function () {
                    expect(getFocusedItem()).to.be.null;
                    return Promises.sendKeys(search.view.getInput(), '\\x08\\x08\\x08\\x08\\x08Automatic')
                })
                .then(function () {
                    expect(getFocusedItem()).to.be.null;
                    return press(down);
                })
                .then(function () {
                    assert('Automatic ID Management');
                    done();
                })
        });

        it('displayed items should have _search modifier and not have tabindex', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    var items = document.querySelectorAll('.eaLauncher-ListItem_search');
                    expect(items.length).to.equal(3);
                    expect(items[0].querySelector('a').getAttribute('tabindex')).to.equal('-1');
                    expect(items[1].querySelector('a').getAttribute('tabindex')).to.equal('-1');
                    expect(items[2].querySelector('a').getAttribute('tabindex')).to.equal('-1');
                    done();
                })
        });


        it('pressing i while highlighting an item should show it\'s info', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    return Promises.sendKeys(search.view.getInput(), down);
                })
                .then(function () {
                    return Promises.sendKeys(search.view.getInput(), 'i')
                })
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alarm');
                    expect(getFocusedItem().querySelector('.eaLauncher-Tooltip')).not.to.be.null;
                    return Promises.sendKeys(search.view.getInput(), 'I')
                })
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alarm');
                    expect(getFocusedItem().querySelector('.eaLauncher-Tooltip')).to.be.null;
                    done();
                })
        });

        it('pressing up/down while info is opened should close it', function (done) {
            var target;

            Promises.sendKeys(search.view.getInput(), 'Alarm' + down + 'i')
                .then(function () {
                    target = getFocusedItem();
                    expect(target.querySelector('.eaLauncher-Tooltip')).not.to.be.null;
                    return Promises.sendKeys(search.view.getInput(), up);
                })
                .then(function () {
                    expect(target.querySelector('.eaLauncher-Tooltip')).to.be.null;
                    return Promises.sendKeys(search.view.getInput(), down + 'I')
                })
                .then(function () {
                    expect(target.querySelector('.eaLauncher-Tooltip')).not.to.be.null;
                    return Promises.sendKeys(search.view.getInput(), down);
                })
                .then(function () {
                    expect(target.querySelector('.eaLauncher-Tooltip')).to.be.null;
                    done();
                });
        });

        it('pressing f/i while nothing is highlighted should type the key', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm')
                .then(function () {
                    return Promises.sendKeys(search.view.getInput(), 'fi')
                })
                .then(function () {
                    expect(search.view.getInput().getValue()).to.equal('Alarmfi');
                    done();
                });
        });

        it('pressing enter while highlighting an item should trigger that item link', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm' + down)
                .then(function () {
                    sinon.stub(ListItem.prototype, 'launchApp');
                    return Promises.sendKeys(search.view.getInput(), '\\x13'); // enter key
                })
                .then(function () {
                    expect(ListItem.prototype.launchApp.callCount).to.equal(1);
                    ListItem.prototype.launchApp.restore();
                    done();
                });
        })

        it('pressing f while highlighting an item should favourite it', function (done) {
            sinon.stub(AppsService, 'updateFavorite');
            Promises.sendKeys(search.view.getInput(), 'Alarm' + down + 'f')
                .then(function () {
                    expect(AppsService.updateFavorite.callCount).to.equal(1);
                    return Promises.sendKeys(search.view.getInput(), 'F')
                })
                .then(function () {
                    expect(AppsService.updateFavorite.callCount).to.equal(2);
                    AppsService.updateFavorite.restore();
                    done();
                });
        });

        it('clicking the body should close the dropdown', function (done) {
            Promises.sendKeys(search.view.getInput(), 'Alarm' + down)
                .then(function () {
                    core.Element.wrap(getFocusedItem()).trigger('mousedown');
                    expect(getResults()).not.to.be.null;
                    core.Element.wrap(document.body).trigger('mousedown');
                    expect(getResults()).to.be.null;
                    done();
                });
        });

    });

});