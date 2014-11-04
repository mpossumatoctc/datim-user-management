function userListController() {
    this.users = [
        {name: 'Mark'},
        {name: 'Paul'}
    ];
}

angular.module('PEPFAR.usermanagement').controller('userListController', userListController);
