// The search field. Renders the search results in the dropdown as searches are typed.

define([
    'jscore/core',
    './SearchView',
    './KeyCodes',
    '../../widgets/ListItem/ListItem',
    '../../widgets/SearchResults/SearchResults',
    'i18n!launcher/app.json'
], function (core, View, Keys, SearchItem, SearchResults, Dictionary) {
    return core.Widget.extend({

        view: function () {
            return new View({
                i18n: {
                    search: Dictionary.get('search')
                }
            });
        },

        setApps: function (apps) {
            this.apps = apps;
        },

        onViewReady: function () {
            this.view.getInput().addEventHandler('keyup', this.onSearchFieldKeyUp, this);
            this.view.getInput().addEventHandler('keydown', this.onSearchFieldKeyDown, this);
            this.view.getCancel().addEventHandler('click', this.onSearchCancel, this);
            this.searchResultsWidget = new SearchResults({tracker: this.getElement()});
            this.previousSearchTerm = '';

            core.Window.addEventHandler('resize', function () {
                this.searchResultsWidget.hide();
            }.bind(this));
        },

        onSearchFieldKeyDown: function (e) {
            var cfi = this.searchResultsWidget.currentFocusedItem;
            // by default up and down arrows move the caret in the input field.
            // we don't want that behaviour because we will be using arrow keys to navigate the items.
            if (Keys.isUpArrowKey(e)) {
                e.preventDefault();
                this.searchResultsWidget.moveUp();

                if (cfi && cfi.tooltip) {
                    cfi.tooltip.hide();
                }

            } else if (Keys.isDownArrowKey(e)) {
                e.preventDefault();
                this.searchResultsWidget.moveDown();
                if (cfi && cfi.tooltip) {
                    cfi.tooltip.hide();
                }
            }

            // If we're focused on an item, then we want to delegate "f" and "i"
            // to the item and not type them into the search field.
            if (cfi && (Keys.isFavoriteKey(e) || Keys.isTooltipKey(e))){
                cfi.onRootKeyup(e);
                e.preventDefault();
            }

            if (Keys.isTabKey(e) || Keys.isEscapeKey(e)) {
                this.searchResultsWidget.hide();
            }

            if (Keys.isEnterKey(e) && cfi) {
                cfi.onRootKeyup(e);
            }
        },

        onSearchFieldKeyUp: function (e) {
            // If we're focused on an item, then we want to delegate "f" and "i"
            // to the item and not type them into the search field.
            if (this.searchResultsWidget.currentFocusedItem &&
                (Keys.isFavoriteKey(e) || Keys.isTooltipKey(e))) {
                return;
            }

            var searchTerm = this.view.getInput().getValue().trim();

            if (searchTerm !== this.previousSearchTerm) {
                this.clearSearchItemViews();
                this.view.setCancelButtonVisibility(searchTerm.length > 0);

                if (searchTerm) {
                    var searchResults = this.doSearch(searchTerm);

                    if (searchResults.length > 0) {
                        this.renderSearchResults(searchResults);
                        this.searchResultsWidget.show();
                    }
                    else {
                        this.searchResultsWidget.hide();
                    }
                } else {
                    this.searchResultsWidget.hide();
                }
                this.previousSearchTerm = searchTerm;
            }

        },

        onSearchCancel: function () {
            this.view.getInput().setValue('');
            this.view.setCancelButtonVisibility(false);
            this.searchResultsWidget.hide();
        },

        doSearch: function (searchTerm) {
            var searchResults = [];
            searchTerm = searchTerm
                .replace('\\', '\\\\')
                .replace('*', '\\*')
                .replace('+', '\\+')
                .replace('(', '\\(')
                .replace(')', '\\)')
                .replace('[', '\\[')
                .replace(']', '\\]');

            var regex = new RegExp(searchTerm, "gi"),
                replacer = function (str) {
                    return '<span class="eaLauncher-ListItem-highlight">' + str + '</span>';
                };

            this.apps.forEach(function (category) {
                category.apps.forEach(function (app) {
                    var appName = app.name;
                    var matchesAppName = (appName !== undefined) ? appName.match(regex) : null;

                    var acronym = app.acronym;
                    var matchesAcronym = (acronym !== undefined && acronym !== null) ? acronym.match(regex) : null;

                    if ((matchesAppName !== null && matchesAppName.length > 0) || (matchesAcronym !== null && matchesAcronym.length > 0)) {
                        var searchAttributes = JSON.parse(JSON.stringify(app));

                        var replacedName = appName;
                        if (matchesAppName !== null && matchesAppName.length > 0) {
                            replacedName = appName.replace(regex, replacer);
                        }

                        var replacedAcronym = acronym;
                        if (matchesAcronym !== null && matchesAcronym.length > 0) {
                            replacedAcronym = acronym.replace(regex, replacer);
                        }

                        searchAttributes.name = replacedName;
                        searchAttributes.acronym = replacedAcronym;
                        searchResults.push(searchAttributes);
                    }
                });
            });

            return searchResults;
        },

        renderSearchResults: function (searchResults) {
            searchResults.forEach(function (appModel) {
                var searchItem = new SearchItem(appModel);
                this.searchResultsWidget.addItem(searchItem);
            }.bind(this));
        },

        clearSearchItemViews: function () {
            this.searchResultsWidget.clear();
        }
    });

});
