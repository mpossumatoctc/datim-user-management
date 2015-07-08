angular.module('PEPFAR.usermanagement').controller('globalUserEditController', globalUserEditController);

function globalUserEditController(notify, userGroups, $state, userToEdit, userLocale, userUtils, userService, $q) {
    'use strict';
    /*jshint validthis: true*/
    var vm = this;

    //Properties
    vm.user = {
        email: userToEdit.email,
        locale: userLocale,
        userActions: {
            'Manage users': userUtils.hasUserAdminRights(userToEdit)
        }
    };

    //Methods
    vm.getErrorString = getErrorString;
    vm.editUser = editUser;
    vm.isProcessing = false;

    window.console.log('Global user edit', vm.userToEdit);
    window.console.log(userGroups);

    function getErrorString() {
        return 'Save user';
    }

    function editUser() {

        vm.isProcessing = true;

        $q.all([userToEdit.save(), userService.saveUserLocale(userToEdit.userCredentials.username, vm.user.locale.name)])
            .then(function (responses) {
                window.console.log(responses);
                notify.success('User updated');
            })
            .catch(function () {
                notify.error('Request to update user not processed correctly');
            })
            .finally(function () {
                vm.isProcessing = false;
            });
    }
}
