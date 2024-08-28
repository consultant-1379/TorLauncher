/**
 * Ideally this should be separated to a different metadata file so that it can be reused for Navigation Panel.
 */
define([
    'i18n!launcher/app.json'
], function (Dictionary) {
    return {

        "Monitoring": {
            "name": Dictionary.get('categories.monitoring.name'),
            "icon": "monitoring",
            "color": "#e32119"
        },
        "Provisioning": {
            "name": Dictionary.get('categories.provisioning.name'),
            "icon": "config",
            "color": "#89ba17"
        },
        "Performance_and_Optimization": {
            "name": Dictionary.get('categories.performance_and_optimisation.name'),
            "icon": "performance",
            "color": "#fabb00"
        },
        "Security": {
            "name": Dictionary.get('categories.security.name'),
            "icon": "security",
            "color": "#00625f"
        },
        "System": {
            "name": Dictionary.get('categories.system.name'),
            "icon": "system",
            "color": "#00a9d4"
        },
        "Documentation": {
            "name": Dictionary.get('categories.documentation.name'),
            "id": "documentation",
            "icon": "documentation",
            "color": "#953882"
        }
    };
});