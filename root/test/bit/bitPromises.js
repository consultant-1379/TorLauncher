define(['jscore/core'], function (core) {

    var WAIT_INTERVAL = 200;

    var promises = {
        // Operator & helper type functions should not be removed.
        waitForElementsByClassName: function (className, parentEl) {
            return new Promise(function (resolve, reject) {
                var count = 0;

                var waitInterval = setInterval(function () {
                    var el;
                    if (parentEl) {
                        el = parentEl.getElementsByClassName(className);
                    }
                    else {
                        el = document.getElementsByClassName(className);
                    }

                    if (el !== null && el.length > 0) {
                        clearInterval(waitInterval);
                        resolve(el);
                    } else if (count >= 5) {
                        clearInterval(waitInterval);
                        reject('No matching elements found');
                    }
                    count++;
                }.bind(this), 100);
            });
        },

        waitForElementVisible: function (selector, timeout, parentEl, index) {
            var singleEl = index === undefined ? false : true;
            index = index || 0;
            return new Promise(function (resolve, reject) {
                var count = 0;
                var waitInterval = setInterval(function () {
                    var el;
                    if (parentEl) {
                        el = parentEl.querySelectorAll(selector);
                    }
                    else {
                        el = document.querySelectorAll(selector);
                    }

                    if ((el !== null && el.length > index && el[index].offsetParent !== null) || count >= timeout / 100) {
                        clearInterval(waitInterval);
                        if (singleEl) {
                            resolve(el[index]);
                        } else {
                            resolve(el);
                        }
                    } else if (count >= timeout / 100) {
                        clearInterval(waitInterval);
                        reject('No matching elements found and visible');
                    }
                    count++;
                }.bind(this), 100);
            });
        },

        sendKeys: function (el, string) {
            return new Promise(function (resolve, reject) {
                var i = 0;
                if (!el.getNative) {
                    el = core.Element.wrap(el);
                }
                el.focus();
                var currentValue = el.getValue();
                var interval = setInterval(function () {
                    var keyCode;
                    var key;

                    if (string[i] === '\\') {
                        key = string.substring(i, i + 4);
                        keyCode = parseInt(key.substring(2, 4), 10);
                        i += 4;
                    } else {
                        key = string[i];
                        keyCode = key.charCodeAt(0);
                        i++;
                    }

                    var ev1 = document.createEvent('Events');
                    ev1.initEvent('keydown', true, true);
                    ev1.keyCode = keyCode;
                    el.getNative().dispatchEvent(ev1);

                    if (!ev1.defaultPrevented) {
                        if (key.indexOf('\\') === 0) {
                            // backspace 
                            if (key === '\\x08') {
                                currentValue = currentValue.substring(0, currentValue.length - 1);
                                el.setValue(currentValue);
                                el.trigger('input');
                            }

                        } else {
                            currentValue += key;
                            el.setValue(currentValue);
                            el.trigger('input');
                        }
                    }

                    var ev2 = document.createEvent('Events');
                    ev2.initEvent('keyup', true, true);
                    ev2.keyCode = keyCode;
                    el.getNative().dispatchEvent(ev2);


                    if (i === string.length) {
                        clearInterval(interval);
                        resolve();
                    }

                }, 5);
            });
        },

        runTestSteps: function (testSteps) {
            var currentStep = testSteps[0]();
            for (var i = 1; i < testSteps.length; i++) {
                // Needed to get correct errors from Mocha/Chai
                currentStep.catch(function (e) {
                    requestAnimationFrame(function () {
                        throw new Error(e);
                    });
                });
                currentStep = currentStep.then(testSteps[i]);
            }
            ;
        },

        skipFrames: function () {
            return new Promise(function (resolve, reject) {
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            resolve();
                        });
                    });
                });
            });
        },

        clickElement: function (el) {
            if (el.length) {
                el = el[0];
            }
            if (!el.getNative) {
                el = core.Element.wrap(el);
            }
            el.trigger('click');
            return Promise.resolve();
        },

        isElementVisible: function (el) {
            if (
                el === null ||
                el.style.display === 'none' ||
                window.getComputedStyle(el).display === 'none' ||
                el.style.visibility === 'hidden' ||
                window.getComputedStyle(el).visibility === 'hidden' ||
                (
                el.getBoundingClientRect().top === 0 &&
                el.getBoundingClientRect().left === 0
                ) ||
                (
                el.offsetHeight === 0 ||
                el.offsetWidth === 0
                )
            ) {
                return false;
            } else {
                return true;
            }
        },

        enterInputFieldValue: function (el, value) {
            if (!el.getNative) {
                el = core.Element.wrap(el);
            }
            el.trigger('keydown');
            el.setValue(value);
            el.trigger('keyup');
            el.trigger('keypress')
            el.trigger('input');
            return Promise.resolve();
        },

        /**
         * Can the user see the element specified by {selector}?
         *
         * @param selector
         * @param timeout
         * @returns {Promise}
         */
        waitForElementToDisappear: function (selector, timeout) {
            return new Promise(function (resolve, reject) {
                var count = 0;
                var waitInterval = setInterval(function () {
                    var el = document.querySelector(selector);
                    if (!isElementVisibleToUser(el) || navigator.userAgent.toLowerCase().indexOf('phantom') >= 0 ? !areElementsAncestorsVisibleToUser(el) : false) {
                        clearInterval(waitInterval);
                        resolve(el);
                    } else if (count >= timeout / WAIT_INTERVAL) {
                        clearInterval(waitInterval);
                        reject('Element ' + el.innerHTML + ' did not disappear after ' + timeout + 'ms');
                    }
                    count++;
                }.bind(this), WAIT_INTERVAL);
            });
        },

        hashChange: function (hash) {
            return new Promise(function (resolve, reject) {
                var listener = function (HashChangeEvent) {
                    var newURL = HashChangeEvent.newURL;
                    var newHash = '';
                    if (newURL && newURL.indexOf('#')) {
                        newHash = newURL.substr(newURL.indexOf('#') + 1);
                    }
                    console.log('hash updated: ' + newHash);
                    if (newHash && hash && newHash.replace('#', '') === hash.replace('#', '')) {
                        window.removeEventListener('hashchange', listener);
                        resolve(hash);
                    }
                    else {
                        reject('hash mismatch [' + hash + ' != ' + newHash + ']');
                    }
                };
                window.addEventListener('hashchange', listener);
                window.location.hash = hash;
            });
        }
    };

    /**
     * Check if a Element is in some way visible and interactable to the user
     *
     * @param el
     * @returns {boolean}
     */
    function isElementVisibleToUser(el) {
        if (
            el === undefined ||
            el.style.display === 'none' ||
            window.getComputedStyle(el).display === 'none' ||
            el.style.visibility === 'hidden' ||
            window.getComputedStyle(el).visibility === 'hidden' ||
            (
            el.getBoundingClientRect().top === 0 &&
            el.getBoundingClientRect().left === 0
            ) ||
            (
            el.offsetHeight === 0 ||
            el.offsetWidth === 0
            )
        ) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Returns true if there is nothing to suggest the element may be hidden
     * You should not need this. isElementVisibleToUser() should be enough. But PhantomJS 1.9.7 needs it.
     *
     * @param el
     * @returns {*}
     */
    function areElementsAncestorsVisibleToUser(el) {
        if (el.parentNode.tagName === 'HTML') return true;
        else if (!isElementVisibleToUser(el)) {
            return false;
        } else {
            return areElementsAncestorsVisibleToUser(el.parentNode);
        }
    }

    return promises;

});