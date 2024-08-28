define([
    'container/SystemBarComponent',
    'container/api',
    'jscore/core',
    'jscore/ext/net'
], function (SystemBarComponent, container, core, net) {

    return SystemBarComponent.extend({

        onStart: function () {
            this.setIdentifier();
        },

        setIdentifier: function () {
            var element = core.Element.wrap(this.getNativeElement());

            getHostName({
                success: function (data) {
                    if (!data || !data.name) {
                        hideElement(element);
                    } else {
                        this.setCaption(data.name);
                        element.setAttribute('title', data.name);
                        container.getEventBus().publish('hostname', data.name);
                    }
                }.bind(this),
                error: hideElement.bind(this, element)
            });

            // don't show if the is no identifier
            this.setIcon(this.resolveIconPath("icon.svg"));
            this.setFixed(true);

            var body = element.find('.eaContainer-SystemBarComponent-body');
            var caption = element.find('.eaContainer-SystemBarComponent-caption');

            // disable hover style
            element.setStyle({
                'background-color': 'transparent'
            });

            // in case the SystemBarComponent implementation changes
            if (body) {
                // remove the cursor pointer
                body.setStyle({
                    cursor: 'auto'
                });
            }

            // in case the SystemBarComponent implementation changes
            if (caption) {
                // allows ellipsis on the text and limiting the width of the component
                caption.setStyle({
                    'max-width': '110px',
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis'
                });
            }

        }

    });

    function hideElement(element) {
        element.setStyle({
            display: 'none'
        });
    }


    // This function is used to fetch the hostname from the api
    function getHostName(option) {
        net.ajax({
            url: '/rest/system/v1/name',
            type: "GET",
            dataType: "json",
            success: option.success,
            error: option.error
        });
    }

});