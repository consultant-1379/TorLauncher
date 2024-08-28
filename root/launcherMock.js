module.exports = function (app) {

    var latency = 500;

    var apps = [{
        "id": "advanced_mo_scripting",
        "name": "Advanced MO Scripting",
        "shortInfo": "AMOS CLI provides access to a number of services (Alarm, Configuration, File Transfer, Inventory , Log, Notification Services) for the administration of CPP Platform Network Elements.",
        "acronym": "AMOS",
        "favorite": "false",
        "host": "NOT_USED",
        "params": null,
        "paramHelp": null,
        "resources": null,
        "roles": "",
        "hidden": false,
        "uri": "/rest/apps/citrix/Advanced_MO_Scripting.ica",
        "openInNewWindow": false
    }, {
        "id": "alarmhistory",
        "name": "Alarm History",
        "shortInfo": "Alarm History is used to search alarms from history of alarm stored in database based on the specified search criteria",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarmhistory",
        "targetUri": "http://localhost:8585/#alarmhistory",
        "openInNewWindow": false
    }, {
        "id": "alarm_viewer",
        "name": "Alarm Monitoring",
        "shortInfo": "Use the Alarm Monitoring UI to monitor alarm state in ENM for Fault Management. The alarm state shown in UI reflects the fault situation that is there in network at the moment.",
        "acronym": "FM",
        "favorite": "true",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarm_viewer",
        "targetUri": "http://localhost:8585/#alarmviewer",
        "openInNewWindow": false
    }, {
        "id": "alarmtextrouting",
        "name": "Alarm Text Routing",
        "shortInfo": "Alarm Text Routing is used to perform CRUD operations on route policies which are used by FM Applications to send alarm to destination based on the route policy and alarm information.",
        "acronym": "FM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarmtextrouting",
        "targetUri": "http://localhost:8585/#alarmtextrouting",
        "openInNewWindow": false
    }, {
        "id": "autoidmanagement",
        "name": "Automatic ID Management",
        "shortInfo": "Automatic ID Management is used to manage the PCI functionalities in the network",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/autoidmanagement",
        "targetUri": "http://localhost:8585/#autoidmanagement",
        "openInNewWindow": false
    }, {
        "id": "command_line_interface",
        "name": "Command Line Interface",
        "shortInfo": "Command Line Interface enables users to perform essential viewing and updating of OSS and network data.",
        "acronym": "CLI",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/command_line_interface",
        "targetUri": "http://localhost:8585/#cliapp",
        "openInNewWindow": false
    }, {
        "id": "log_viewer",
        "name": "Log Viewer",
        "shortInfo": "Use to query and view details of the platform syslogs, provides a full text search and complex filtering of logs based on syslog data.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/Log_Viewer",
        "targetUri": "http://localhost:8585/#logviewer",
        "openInNewWindow": false
    }, {
        "id": "networkexplorer",
        "name": "Network Explorer",
        "shortInfo": "Use Network Explorer to search and retrieve all Network Configuration Data. The returned data can be grouped into Collections or Saved searches to facilitate sharing and reuse.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/networkexplorer",
        "targetUri": "http://localhost:8585/#networkexplorer",
        "openInNewWindow": false
    }, {
        "id": "oss_monitoring",
        "name": "OSS Monitoring",
        "shortInfo": "Use to monitor OSS Server hardware and OSS Operating system via agents installed on the servers which transmit back information to display on the portal.",
        "acronym": "OSS-MT",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/OSS_Monitoring",
        "targetUri": "https://192.168.0.42:57005/",
        "openInNewWindow": false
    }, {
        "id": "pmic",
        "name": "PM Initiation and Collection",
        "shortInfo": "PM Initiation and Collection provides functionality to allow a user to manage PM measurements in the LTE RAN, allowing a user create, schedule, start, stop, modify and delete subscriptions.",
        "acronym": "PMIC",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/pmic",
        "targetUri": "http://localhost:8585/#pmiclistsubscription",
        "openInNewWindow": false
    }, {
        "id": "shm",
        "name": "Software and Hardware Manager",
        "shortInfo": "Use Software and Hardware Manager to perform Software, Hardware, Backup and License Administration related tasks. It includes software upgrade, node backup and restore, license installation.",
        "acronym": "SHM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/shm",
        "targetUri": "http://localhost:8585/#shm",
        "openInNewWindow": false
    }, {
        "id": "system_logs",
        "name": "System Logs",
        "shortInfo": "System logs contain events that are logged by the operating system components on Event, Error, Command, Security and Network Status level.",
        "acronym": "OSS_LOGVIEWER",
        "favorite": "false",
        "host": "NOT_USED",
        "params": null,
        "paramHelp": null,
        "resources": null,
        "roles": "",
        "hidden": false,
        "uri": "/rest/apps/citrix/System_Logs.ica",
        "openInNewWindow": false
    }, {
        "id": "user_management",
        "name": "User Management",
        "shortInfo": "User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/user_management",
        "targetUri": "http://localhost:8585/#usermanagement",
        "openInNewWindow": false
    }, {
        "id": "transport_network_discovery",
        "name": "Transport Network Discovery",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "alarm_monitor",
        "name": "Alarm Monitor",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "automatic_alarm_handling",
        "name": "Automatic Alarm Handling",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "nhm",
        "name": "Network Health Monitor",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "alarm_search",
        "name": "Alarm Search",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "node_monitor",
        "name": "Node Monitor",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "kpimanagement",
        "name": "KPI Management",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "pkimanagement",
        "name": "PKI Management",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "role_management",
        "name": "Role Management",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "target_group_management",
        "name": "Target Group Management",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "topology_browser",
        "name": "Topology Browser",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "shell_terminal",
        "name": "Shell Terminal",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": false
    }, {
        "id": "alexlibrary",
        "name": "Alex Library",
        "shortInfo": "Some app description.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/someapp",
        "targetUri": "http://localhost:8585/#someapp",
        "openInNewWindow": true
    }];

    var groups = [{
        "id": "Provisioning",
        "name": "Provisioning",
        "apps": [
            "networkexplorer"
        ]
    }, {
        "id": "Monitoring",
        "name": "Monitoring",
        "apps": [
            "alarmhistory", "alarm_viewer", "alarmtextrouting", "alarm_monitor",
            "automatic_alarm_handling", "nhm", "alarm_search", "node_monitor"
        ]
    }, {
        "id": "Performance_and_Optimization",
        "name": "Performance and Optimization",
        "apps": [
            "autoidmanagement", "pmic", "kpimanagement"
        ]
    }, {
        "id": "Security",
        "name": "Security",
        "apps": [
            "user_management", "pkimanagement", "role_management", "target_group_management"
        ]
    }, {
        "id": "System",
        "name": "System",
        "apps": [
            "log_viewer", "oss_monitoring", "system_logs"
        ]
    }, {
        "id": "Tools",
        "name": "Tools",
        "apps": [
            "advanced_mo_scripting",
            "command_line_interface",
            "topology_browser",
            "shell_terminal"
        ]
    }, {
        "id": "Documentation",
        "name": "Documentation",
        "apps": [
            "alexlibrary"
        ]
    }];

    var hostname = {
        "name" : "EMpTy"
    };

    function cloneAndTranslate(payload, appsProp) {
        var output = JSON.parse(JSON.stringify(payload));
        var translate = function(array) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < apps.length; j++) {
                    if (apps[j].id === array[i]) {
                        array[i] = apps[j];
                        break;
                    }
                }
            }
        };

        if (appsProp) {
            for (var i = 0; i < output.length; i++) {
                translate(output[i][appsProp]);
            }
        } else {
            translate(output);
        }
        return output;
    }

    app.get('/rest/system/v1/name', function(req,res){
        setTimeout(function(){
            res.status(200).send(cloneAndTranslate(hostname))
        }, latency);
    });

    app.get("/rest/groups", function (req, res) {
        setTimeout(function () {
            res.status(200).send(cloneAndTranslate(groups, "apps"));
        }, latency);
    });

    app.get("/rest/apps", function (req, res) {
        setTimeout(function () {
            res.status(200).send(apps);
        }, latency);
    });
    app.get("/rest/favorites", function (req, res) {
        setTimeout(function () {
            var output = [];
            for (var i = 0; i < apps.length; i++) {
                if (apps[i].favorite === 'true') {
                    output.push(apps[i])
                }
            }
            res.status(200).send(output);
        }, latency);
    });

    app.get("/rest/ui/settings/launcher/favorites", function(req, res) {
        var output = [];
        for (var i = 0; i < apps.length; i++) {
            if (apps[i].favorite === 'true') {
                output.push({id: apps[i].id, value: apps[i].favorite})
            }
        }

        res.status(200).send(output);
    });

    app.put("/rest/ui/settings/launcher/favorites", function (req, res) {
        for (var i = 0; i < apps.length; i++) {
            if (apps[i].id === req.body.id) {
                apps[i].favorite = req.body.value;
            }
        }

        res.status(204).send();
    });

    app.get(/\/rest\/apps\/[A-Za-z0-9\/\?=-_#]+\.ica/, function (req, res) {
        setTimeout(function () {
            res.set('Content-Type', 'application/x-ica');
            res.status(200).send('Some proprietary guff');
        }, latency);
    });
    app.get(/\/rest\/apps\/[A-Za-z0-9\/\?=-_#]+/, function (req, res) {
        setTimeout(function () {
            res.status(200).send('Redirected to targetUri stored on server.');
        }, latency);
    });
};
