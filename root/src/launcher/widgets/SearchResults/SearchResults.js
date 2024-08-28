define([
    'jscore/core',
    './SearchResultsView'
], function (core, View) {

    return core.Widget.extend({

        View: View,

        onViewReady: function () {
            this.tracker = this.options.tracker;
            this.index = -1;
            this.items = [];
            this.currentFocusedItem = undefined;

            // preventDefault with mousedown prevents the unfocusing
            // done by the browser. The stopPropagation ensures that
            // we don't hit the body tag.
            this.getElement().addEventHandler('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
            }.bind(this));
        },

        show: function () {
            this.isShowing = true;
            this.index = -1;
            if (!this.isAttached()) {
                this.attachTo(core.Element.wrap(document.body));
            }

            var prevPos = this.tracker.getPosition();

            var __updateStyle = function (pos) {
                var topCoord = pos.top + this.tracker.getProperty('offsetHeight') + 2;
                this.getElement().setStyle({
                    top: topCoord,
                    left: pos.left + 2, // adding these numbers for aligning purposes
                    width: this.tracker.getProperty('offsetWidth') - 6,
                    maxHeight: window.innerHeight - topCoord
                });
            }.bind(this);

            __updateStyle(prevPos);

            var __update = function () {
                // We make sure the list persists as we're scrolling.
                var currentPos = this.tracker.getPosition();
                if (currentPos.left !== prevPos.left || currentPos.top !== prevPos.top) {
                    __updateStyle(currentPos);
                    prevPos = currentPos;
                }

                if (!core.Element.wrap(document.body).contains(this.tracker)) {
                    this.hide();
                }

                this.interval = requestAnimationFrame(__update);
            }.bind(this);

            this.interval = requestAnimationFrame(__update);

            if (!this.bodyEvent) {
                this.bodyEvent = core.Element.wrap(document.body).addEventHandler('mousedown', this.hide.bind(this));
            }

        },

        hide: function () {
            this.isShowing = false;
            this.detach();
            cancelAnimationFrame(this.interval);

            // This function can get called without show occurring.
            if (this.bodyEvent) {
                core.Element.wrap(document.body).removeEventHandler(this.bodyEvent);
                this.bodyEvent = undefined;
            }

        },

        clear: function () {
            this.items.forEach(function (item) {
                item.destroy();
            });
            this.items = [];
        },

        addItem: function (item) {
            this.items.push(item);
            item.getElement().setModifier('search');
            item.getElement().removeAttribute('tabindex');
            item.attachTo(this.getElement());
        },

        getItemCount: function () {
            return this.getElement().children().length;
        },

        moveUp: function () {
            this.index--;
            if (this.index === -2) {
                this.index = this.getItemCount() - 1;
            }
            this.updateItemFocus();
        },

        updateItemFocus: function () {
            if (this.currentFocusedItem) {
                this.currentFocusedItem.getElement().removeModifier('focused');
            }
            this.currentFocusedItem = this.items[this.index];


            if (this.currentFocusedItem) {
                this.currentFocusedItem.getElement().setModifier('focused');
            }

        },

        moveDown: function () {
            this.index++;
            if (this.index === this.getItemCount()) {
                this.index = -1;
            }
            this.updateItemFocus();
        }

    });

});