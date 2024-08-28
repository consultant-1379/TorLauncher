define([
    'jscore/core',
    'template!./SideRegion.html',
    'styles!./SideRegion.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getActivity: function () {
            return this.getElement().find('.eaLauncher-SideRegion-activity');
        },

        getTutorials: function () {
            return this.getElement().find('.eaLauncher-SideRegion-tutorials');
        },

        getCarouselLeft: function () {
            return this.getElement().find('.eaLauncher-SideRegion-carouselLeft');
        },

        getCarouselRight: function () {
            return this.getElement().find('.eaLauncher-SideRegion-carouselRight');
        },

        getCarouselContent: function () {
            return this.getElement().find('.eaLauncher-SideRegion-carouselContentWrapper');
        },

        getCarouselDots: function () {
            return this.getElement().findAll('.eaLauncher-SideRegion-carouselDot');
        },

        getCarousel: function () {
            return this.getElement().find('[data-name="carousel"]');
        },

        getCarouselBackgrounds: function () {
            return this.getElement().findAll('.eaLauncher-SideRegion-carouselBackground');
        }

    });

});
