define([
    'jscore/core',
    'text!./eNMContainerHelper.html'
], function (core, template) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        }

    });

});
