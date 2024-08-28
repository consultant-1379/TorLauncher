define({
    "defaultApp": "launcher",
    "name": "Ericsson Network Manager",
    "shortName": "ENM",
    "plugin": "plugin",
    "components": [
        {
            "path": "container/components/LogoutButton/LogoutButton"
        },
        {
            "path": "enmcontainerhelper"
        },
        {
            "path": "helpbutton"
        },
        {
            "path": "systemidentifier"
        },
        {
            "path": "navigation"
        }
    ],
    "logger": {
        "url": "/rest/service/log",
        "sendFrequency": 5000,
        "autoLog": false
    }
});