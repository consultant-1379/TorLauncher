define([
    'jscore/core',
    'template!./ListItem.html',
    'styles!./ListItem.less'
], function (core, template, styles) {

    return core.View.extend({

        favIconState: null,

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getLinkLabel: function () {
            return this.getElement().find('.eaLauncher-ListItem-label');
        },

        getFavIcon: function () {
            return this.getElement().find('.eaLauncher-ListItem-favIcon');
        },

        getInfoIcon: function () {
            return this.getElement().find('.eaLauncher-ListItem-infoIcon');
        },

        setFavIconState: function (state) {
            this.getFavIcon().setModifier('favorited', state + '');
        },

        setInfoIconState: function (state) {
            this.getInfoIcon().setModifier('clicked', state + '');
        },

        setLinkItemState: function (state) {
            this.getElement().setModifier('selected', state + '');
        },

        getExternalIcon: function () {
            return this.getElement().find('.eaLauncher-ListItem-externalIcon');
        },

        showExternalIcon: function () {
            this.getExternalIcon().removeModifier('hidden');
        }

    });

});