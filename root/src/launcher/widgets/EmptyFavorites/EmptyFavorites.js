// Shows a message with instructions on how to favorite apps when there are no favorites

define([
    'jscore/core',
    './EmptyFavoritesView',
    'i18n!launcher/app.json'
], function (core, View, Dictionary) {

    var star = '(<span title="star" class="eaLauncher-EmptyFavorites-favoriteStar"></span>)';

    return core.Widget.extend({

        view: function () {
            return new View({
                header: Dictionary.get('noFavoritesHeader'),
                message: Dictionary.get('noFavoritesMessage').replace('(*)', star).replace(/\n/g, '<br>')
            });
        }

    });

});