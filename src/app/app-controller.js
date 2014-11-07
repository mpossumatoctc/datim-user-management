function appController(webappManifest) {
    this.title = 'User management';

    console.log(webappManifest); //jshint ignore:line
}

angular.module('PEPFAR.usermanagement').controller('appController', appController);
