// Encapsulates the application link, info button and favorite icon/button into a single widget for use in AppList.

define([
    'jscore/core',
    'jscore/ext/net',
    './ListItemView',
    '../../widgets/Tooltip/Tooltip',
    'jscore/ext/privateStore',
    '../../ext/AppsService',
    '../../ext/LocationService',
    'i18n!launcher/app.json'
], function (core, net, View, Tooltip, PrivateStore, AppsService, LocationService, Dictionary) {

    return core.Widget.extend({

        view: function () {
            return new View({
                data: this.options,
                i18n: {
                    showInfo: Dictionary.get('showInfo'),
                    toggleFavorite: Dictionary.get('toggleFavorite')
                }
            });
        },

        onViewReady: function () {
            this.favorite = this.options.favorite === 'true';
            this.view.setFavIconState(this.favorite);
            var linkLabel = this.view.getLinkLabel();
            linkLabel.addEventHandler('click', this.launchApp.bind(this));
            this.getElement().addEventHandler('blur', this.onRootBlur.bind(this));
            this.getElement().addEventHandler('keyup', this.onRootKeyup.bind(this));

            // Doing it this way rather than through handlebars because of highlighted text markup
            var appText = linkLabel.getText();
            var launchText = Dictionary.get('launchApp').replace('<app>', appText);
            linkLabel.setAttribute('title', launchText.trim());

            this.view.getFavIcon().addEventHandler('click', this.onFavoriteClicked.bind(this));
            var infoIcon = this.view.getInfoIcon();
            if (infoIcon !== undefined) {
                infoIcon.addEventHandler('click', this.onInfoClicked.bind(this));
            }

            this.favoriteHandle = AppsService.subscribe('favorite', function (id, state) {
                if (this.options.id === id) {
                    this.favorite = state;
                    this.view.setFavIconState(state);
                }
            }.bind(this));

            if (this.options.openInNewWindow) {
                this.view.showExternalIcon();
            }
        },

        onDestroy: function () {
            AppsService.unsubscribe('favorite', this.favoriteHandle);
        },

        onFavoriteClicked: function () {
            AppsService.updateFavorite(this.options.id, !this.favorite);
        },

        onInfoClicked: function () {
            if (!this.tooltip) {
                this.tooltip = new Tooltip({
                    content: this.options.shortInfo,
                    parent: this.view.getInfoIcon()
                });
                this.tooltip.attachTo(this.getElement());
                this.tooltip.addCloseHandler(this.onTooltip.bind(this));
            }

            if (!this.tooltip.isShown()) {
                this.tooltip.show();
            } else {
                this.tooltip.hide();
            }

            this.onTooltip();

            // Focusing so that if we blur away the tooltip will close correctly.
            this.getElement().focus();
        },

        onTooltip: function () {
            this.view.setInfoIconState(this.tooltip.isShown());
            this.view.setLinkItemState(this.tooltip.isShown());
        },

        onRootKeyup: function (event) {
            if (event.originalEvent.keyCode === 13) {
                this.launchApp(event);
            } else if (event.originalEvent.keyCode === 70 || event.originalEvent.keyCode === 102) { // keyup f
                this.onFavoriteClicked(event);
            } else if (event.originalEvent.keyCode === 73 || event.originalEvent.keyCode === 105) { // keyup i
                this.onInfoClicked(event);
            }
        },

        onRootBlur: function () {
            if (this.tooltip && this.tooltip.isShown()) {
                this.tooltip.hide();
                this.onTooltip();
            }
        },

        launchApp: function (e) {
            e.preventDefault();
            net.ajax({
                type: 'HEAD',
                dataType: 'json',
                url: this.options.uri
            });
            // check if event is a ctrl click, shift click, or a middle mouse click (e.originalEvent.which == 2)
            if (e.originalEvent.ctrlKey || e.originalEvent.shiftKey || e.originalEvent.which === 2 || this.options.openInNewWindow) {
                this.launchAppInNewTab(this.options.targetUri);
            } else {
                this.launchAppInSameTab(this.options.targetUri);
            }
        },

        launchAppInNewTab: function (uri) {
            window.open(uri);
        },

        launchAppInSameTab: function (uri) {
            window.location = uri;
        }
    });

});
