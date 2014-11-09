function addUserController($scope, userTypes, dataGroups) {
    this.title = 'Add or delete user';
    this.userTypes = userTypes || [];
    this.dataGroups = dataGroups || [];
    this.actions = [];
    this.languages = [];
}

angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);
