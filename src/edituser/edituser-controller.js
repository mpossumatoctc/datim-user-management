angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, userToEdit, userLocale) {
    var vm = this;

    vm.userToEdit = {};
    vm.user = {
        locale: undefined
    };
    $scope.user = vm.user;

    initialise();

    function initialise() {
        vm.userToEdit = userToEdit;
        vm.user.locale = userLocale;
    }
}
