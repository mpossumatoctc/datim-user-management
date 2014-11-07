angular.module('PEPFAR.usermanagement').factory('webappManifest', function () {
    return {
        "version": "0.0.1",
        "name": "PEPFAR User Management",
        "description": "User management app for PEPFAR.",
        "icons": {
            "48": "images/icons/user-maintenance.png"
        },
        "developer": {
            "url": "",
            "name": "Mark Polak"
        },
        "launch_path": "index.html",
        "default_locale": "en",
        "activities": {
            "dhis": {
                "href": "http://localhost:8080/dhis"
            }
        }
    };
});