define({
    name: 'Ericsson Network Manager',
    shortName: 'ENM',
    defaultApp: 'launcher',
    plugin: 'plugin',
    loadOverride: 'config.override.json',
    moduleTimeout: 0,
    properties: {
        help: {
            helpCenter: true,
            search: true,
            i18n: {
                locales: ['en-us']
            }
        },
        helpbutton: {
            helpCenter: true,
            aboutDialog: true,
            i18n: {
                locales: ['en-us']
            }
        },
        helpsearch: {
            url: '/help-search/rest/help/search',
            i18n: {
                locales: ['en-us']
            }
        },
        navigation: {
            content: {
                url: '/rest/groups'
            },
            hideIn: ['help', 'launcher', 'remotedesktop']
        },
        systemtime: {
            url: '/rest/system/time'
        },
        helplib: {
            i18n: {
                locales: ['en-us']
            }
        }
    },
    webpush: {
        urls: {
            stream: '/web-push/oss/push',
            id: '/web-push/rest/oss/push/id',
            subscriptions: '/web-push/rest/oss/push/subscriptions/diff'
        },
        heartbeat: {
            enable: true,
            url: '/web-push/rest/oss/push/heartbeatInterval'
        }
    },
    logger: {
        url: '/rest/service/log',
        sendFrequency: 5000,
        autoLog: false,
        autoSend: 5,
        logLevel: 'ERROR',
        maxCache: 10
    },
    components: [
        {
            path: 'UserProfileMenu'
        },
        {
            path: 'enmcontainerhelper'
        },
        {
            path: 'helpbutton'
        },
        {
            path: 'systemtime'
        },
        {
            path: 'flyout'
        },
        {
            path: 'contextmenu'
        },
        {
            path: 'systemidentifier'
        },
        {
            path: 'navigation'
        }
    ]
});
