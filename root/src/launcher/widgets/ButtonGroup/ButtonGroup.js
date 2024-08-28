define([
    'jscore/core',
    './ButtonGroupView',
    'i18n!launcher/app.json'
], function (core, View, Dictionary) {

    return core.Widget.extend({

        init: function () {
            this.options.items = [
                {label: Dictionary.get('views.az'), value: 'apps'},
                {label: Dictionary.get('views.category'), value: 'groups'},
                {label: Dictionary.get('views.favorites'), value: 'favorites'}
            ];
        },

        view: function () {
            return new View(this.options);
        },

        onViewReady: function () {
            ['apps', 'groups', 'favorites'].forEach(function (index) {
                var radio = this.view.getRadio(index);
                radio.addEventHandler('click change', this.onChange.bind(this));
            }.bind(this));
        },

        onChange: function () {
            window.location.hash = 'launcher/' + this.view.getSelectedRadio().getValue();
        },

        setSelection: function (hash) {
            this.view.getRadio(hash).setProperty('checked', true);
        }

    });

});
