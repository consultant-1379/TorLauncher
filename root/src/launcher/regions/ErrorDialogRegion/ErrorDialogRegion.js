// Handles errors from other regions. Will show multiple errors on top of each other.
// Has specific support for HTTP/REST errors, as well as generic errors.

define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!launcher/app.json'
], function (core, Dialog, Dictionary) {

    return core.Region.extend({

        onStart: function () {
            this.getEventBus().subscribe('error', function (options) {
                this.onError(options);
            }.bind(this));

            // Binding hide forcefully for testing purposes
            this.hide = this.hide.bind(this);
        },

        onError: function (options) {
            if (!this.displayingError) {

                this.dialog = new Dialog({
                    header: options.header,
                    content: options.content || Dictionary.get('tryAgainLater'),
                    visible: true,
                    buttons: [
                        {caption: Dictionary.get('ok'), color: 'blue', action: this.hide}
                    ]
                });

                this.displayingError = true;
            }
        },

        hide: function () {
            this.displayingError = false;
            this.dialog.hide();
        },

        onStop: function () {
            if (this.dialog) {
                this.dialog.hide();
            }
        }

    });
});