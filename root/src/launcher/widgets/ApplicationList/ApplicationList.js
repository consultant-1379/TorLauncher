define([
    'jscore/core',
    './ApplicationListView',
    './group/Group',
    '../ListItem/ListItem',
    '../../ext/Categories',
    '../EmptyFavorites/EmptyFavorites'
], function (core, View, Group, ListItem, Categories, EmptyFavorites) {

    return core.Widget.extend({

        init: function () {
            this.apps = [];
            this.items = [];
        },

        view: function () {
            return new View(this.options);
        },


        /**
         * Called once on load to set the apps in memory.
         * Anytime the hash changes this apps array is referenced.
         * It is also updated when favorite changes occur because it
         * shares a reference pointer to AppsService.
         *
         * @method setApps
         * @param {Array<Object>} apps
         */
        setApps: function (apps) {
            this.apps = apps;
        },

        /**
         * Destroys the items and then triggers a
         * different show method based on the hash.
         *
         * @method showAs
         * @param {String} hash
         */
        showAs: function (hash) {
            // We have to destroy the items cleanly so that they unsubscribe from AppsService.
            this.items.forEach(function (item) {
                item.destroy();
            });
            this.items = [];

            // Quickest way to wipe the categories
            this.view.getContent().setText('');

            // Execute function depending on hash value
            if (hash === 'groups') {
                this.showAsCategoryList();
            } else if (hash === 'apps') {
                this.showAsOrderedList();
            } else if (hash === 'favorites') {
                this.showAsFavoriteList();
            }
        },

        /**
         * Iterates through all of the apps in memory
         * and finds which ones have been favorited.
         * These are added to a single category. If there
         * are no favorite apps then a message is shown instead.
         *
         * @method showAsFavoriteList
         */
        showAsFavoriteList: function () {
            var favoriteApps = [];

            this.apps.forEach(function (category) {
                category.apps.forEach(function (app) {
                    if (app.favorite === 'true') {
                        favoriteApps.push(app);
                    }
                });
            });

            if (favoriteApps.length === 0) {
                new EmptyFavorites().attachTo(this.view.getContent());
            } else {
                this.render([{
                    apps: favoriteApps
                }]);
            }
        },

        /**
         * Iterates over the category names and maps them
         * to the Categories styles.
         *
         * @method showAsCategoryList
         */
        showAsCategoryList: function () {
            var data = [];

            Object.keys(Categories).forEach(function(category) {
                // Cloning so that we don't modify anything.
                var categoryInfo = JSON.parse(JSON.stringify(Categories[category]));

                /*jshint loopfunc: true*/
                mapCategories.call(this, category, categoryInfo);
            }.bind(this));

            function mapCategories(category, categoryInfo) {
                this.apps.forEach(function (categoryObject) {
                    if (categoryObject.id === category) {
                        categoryInfo.apps = categoryObject.apps;
                        data.push(categoryInfo);
                    }
                });
            }

            this.render(data);
        },

        /**
         * Lists the apps in groups with the first letter as the group name.
         *
         * @method showAsOrderedList
         */
        showAsOrderedList: function () {
            var data = [];
            var headers = [];

            // First normalize the apps from their normal categories.
            var apps = [];
            this.apps.forEach(function (category) {
                apps = apps.concat(category.apps);
            });

            // Iterate through all of the apps and find unique first letters.
            apps.forEach(function (app) {
                var header = app.name[0].toUpperCase();
                if (headers.indexOf(header) === -1) {
                    headers.push(header);
                }
            });
            headers.sort();

            // Then for each of these letters, create a new group, and the apps
            // for that group are matched if they start with the same letter.
            headers.forEach(function (letter) {
                var group = {
                    name: letter,
                    ordered: true,
                    apps: apps.filter(function (app) {
                        return (app.name[0].toLowerCase() === letter.toLowerCase() );
                    })
                };
                data.push(group);
            }.bind(this));

            // Finally render the data
            this.render(data);
        },

        /**
         * Renders the data passed. Sorts all of the groups and apps
         * and then instantiates groups/items and attaches them.
         *
         * @method render
         * @param {Array<Object>} data
         */
        render: function (data) {
            var comparator = function (a, b) {
                return a.name.localeCompare(b.name);
            };

            data.sort(comparator);

            data.forEach(function (groupObj) {
                var group = new Group(groupObj);
                group.attachTo(this.view.getContent());

                groupObj.apps.sort(comparator);

                groupObj.apps.forEach(function (appObj) {
                    var item = new ListItem(appObj);
                    group.add(item);
                    this.items.push(item);
                }.bind(this));

            }.bind(this));
        }

    });

});
