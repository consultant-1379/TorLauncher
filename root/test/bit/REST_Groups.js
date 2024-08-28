define(function () {
    return [{
        'id': 'Monitoring',
        'name': 'Monitoring',
        'apps': [{
            'id': 'alarmtextrouting',
            'name': 'Alarm Text Routing',
            'shortInfo': 'Alarm Text Routing is used to perform CRUD operations on route policies which are used by FM Applications to send alarm to destination based on the route policy and alarm information.',
            'acronym': 'FM',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/alarmtextrouting',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#alarmtextrouting'
        }, {
            'id': 'alarmhistory',
            'name': 'Alarm History',
            'shortInfo': 'Alarm History is used to search alarms from history of alarm stored in database based on the specified search criteria',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/alarmhistory',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#alarmhistory'
        }, {
            'id': 'alarm_viewer',
            'name': 'Alarm Monitoring',
            'shortInfo': 'Use the Alarm Monitoring UI to monitor alarm state in ENM for Fault Management. The alarm state shown in UI reflects the fault situation that is there in network at the moment.',
            'acronym': 'FM',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/alarm_viewer',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#alarmviewer'
        }]
    }, {
        'id': 'Documentation',
        'name': 'Documentation',
        'apps': [{
            'id': 'alexlibrary',
            'name': 'Alex Library',
            'shortInfo': 'shortInfo',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/alex',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/alex'
        }]
    }, {
        'id': 'Provisioning',
        'name': 'Provisioning',
        'apps': [{
            'id': 'shm',
            'name': 'Software and Hardware Manager',
            'shortInfo': 'Use Software and Hardware Manager to perform Software, Hardware, Backup and License Administration related tasks. It includes software upgrade, node backup and restore, license installation.',
            'acronym': 'SHM',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/shm',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#shm'
        }]
    }, {
        'id': 'Performance_and_Optimization',
        'name': 'Performance and Optimization',
        'apps': [{
            'id': 'autoidmanagement',
            'name': 'Automatic ID Management',
            'shortInfo': 'Automatic ID Management is used to manage the PCI functionalities in the network',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/autoidmanagement',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#autoidmanagement'
        }, {
            'id': 'pmic',
            'name': 'PM Initiation and Collection',
            'shortInfo': 'PM Initiation and Collection provides functionality to allow a user to manage PM measurements in the LTE RAN, allowing a user create, schedule, start, stop, modify and delete subscriptions.',
            'acronym': 'PMIC',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/pmic',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#pmiclistsubscription'
        }]
    }, {
        'id': 'Security',
        'name': 'Security',
        'apps': [{
            'id': 'user_management',
            'name': 'User Management',
            'shortInfo': 'User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/user_management',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#usermanagement'
        }]
    }, {
        'id': 'System',
        'name': 'System',
        'apps': [{
            'id': 'Log_Viewer',
            'name': 'Log Viewer',
            'shortInfo': 'Use to query and view details of the platform syslogs, provides a full text search and complex filtering of logs based on syslog data.',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/Log_Viewer',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#logviewer'
        }, {
            'id': 'OSS_Monitoring',
            'name': 'OSS Monitoring',
            'shortInfo': 'Use to monitor OSS Server hardware and OSS Operating system via agents installed on the servers which transmit back information to display on the portal.',
            'acronym': 'OSS-MT',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/OSS_Monitoring',
            'targetUri': 'https://192.168.0.42:57005/'
        }, {
            'id': 'System_Logs',
            'name': 'System Logs',
            'shortInfo': 'System logs contain events that are logged by the operating system components on Event, Error, Command, Security and Network Status level.',
            'acronym': 'OSS_LOGVIEWER',
            'favorite': 'false',
            'host': 'NOT_USED',
            'params': null,
            'paramHelp': null,
            'resources': null,
            'roles': '',
            'hidden': false,
            'uri': '/rest/apps/citrix/System_Logs.ica'
        }]
    }, {
        'id': 'Tools',
        'name': 'Tools',
        'apps': [{
            'id': 'Advanced_MO_Scripting',
            'name': 'Advanced MO Scripting',
            'shortInfo': 'AMOS CLI provides access to a number of services (Alarm, Configuration, File Transfer, Inventory , Log, Notification Services) for the administration of CPP Platform Network Elements.',
            'acronym': 'AMOS',
            'favorite': 'false',
            'host': 'NOT_USED',
            'params': null,
            'paramHelp': null,
            'resources': null,
            'roles': '',
            'hidden': false,
            'uri': '/rest/apps/citrix/Advanced_MO_Scripting.ica'
        }, {
            'id': 'command_line_interface',
            'name': 'Command Line Interface',
            'shortInfo': 'Command Line Interface enables users to perform essential viewing and updating of OSS and network data.',
            'acronym': 'CLI',
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/command_line_interface',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#cliapp'
        }, {
            'id': 'network_explorer',
            'name': 'Network Explorer',
            'shortInfo': 'Use Network Explorer to search and retrieve all Network Configuration Data. The returned data can be grouped into Collections or Saved searches to facilitate sharing and reuse.',
            'acronym': null,
            'favorite': 'false',
            'resources': null,
            'hidden': false,
            'roles': '',
            'uri': '/rest/apps/web/network_explorer',
            'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#networkexplorer'
        }]
    }];
});
