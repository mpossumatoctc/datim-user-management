function addUserController($scope, userTypes, dataGroups) {
    this.title = 'Add or delete user';
    this.userTypes = userTypes || [];
    this.dataGroups = dataGroups || [];
    this.actions = [];
    this.languages = [];

    console.log(userTypes); //jshint ignore:line
    console.log(dataGroups); //jshint ignore:line
}

angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);
