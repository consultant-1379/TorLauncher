// Instantiated when the info button is clicked in ListItem
// Shows a short description of the application above or below, depending on the location of the  button in the window.

define([
    'jscore/core',
    './TooltipView'
], function (core, View) {

    var currentTooltip;

    return core.Widget.extend({

        view: function () {
            return new View({
                content: this.options.content
            });
        },

        init: function () {
            this.shown = false;
        },

        attachTo: function (parent) {
            this.parentElt = parent;
            core.Widget.prototype.attachTo.apply(this, arguments);
        },

        onViewReady: function () {
            this.view.getCloseButton().addEventHandler('click', this.hide.bind(this));
        },

        addCloseHandler: function (callback) {
            this.view.getCloseButton().addEventHandler('click', callback);
        },

        show: function () {
            // We're utilising the static variable currentTooltip at the top which
            // is the same variable across all instances of Tooltip. This allows
            // us to make sure only one tooltip is showing at any time.
            if (currentTooltip) {
                currentTooltip.view.getCloseButton().trigger('click');
            }

            this.shown = true;
            this.attach();
            currentTooltip = this;

            var shownOnBottom,
                lastPosition = this.parentElt.getPosition(),
                eachFrame = function () {
                    var parentPosition = this.parentElt.getPosition();

                    if (parentPosition.top !== lastPosition.top) {
                        this.hide();
                        return;
                    }

                    var newShownOnBottom = showOnBottom.call(this, parentPosition);

                    if (shownOnBottom === newShownOnBottom) {
                        return;
                    }

                    this.view.setRootModifier(newShownOnBottom);
                    shownOnBottom = newShownOnBottom;
                }.bind(this);

            eachFrame();

            this.lastRequestedFrame = core.Window.eachFrame(eachFrame);

            this.clickAndTouchEvent = core.Element.wrap(document.body).addEventHandler('click touchend', function (e) {
                var contains = this.getElement().getNative().contains(e.originalEvent.target) || this.options.parent.getNative().contains(e.originalEvent.target);
                if(!contains){
                    this.hide();
                }
            }.bind(this));

        },

        hide: function () {
            this.lastRequestedFrame.stop();
            this.shown = false;
            if(this.clickAndTouchEvent){
                this.clickAndTouchEvent.destroy();
            }
            this.detach();
        },

        isShown: function () {
            return this.shown;
        }
    });

    function showOnBottom(parentPosition) {
        var contentHeight = this.getElement().getProperty('offsetHeight'),
            windowHeight = core.Window.getProperty('innerHeight');

        return (parentPosition.bottom + contentHeight + 16) < windowHeight;
    }

});