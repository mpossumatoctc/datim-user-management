angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController() {
    var vm = this;

    vm.users = [
        {name: 'Mark'},
        {name: 'Paul'}
    ];
}
