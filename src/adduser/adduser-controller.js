angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, currentUser,
                           userActionsService, userService, $state) { //jshint ignore:line
    var vm = this;
    var regex = /^dataStream.+$/g;
    var dataStreamIds;
    var dataStreamInteractedWith = false;

    vm.title = 'Add or delete user';
    vm.dataGroups = dataGroups || [];
    vm.actions = userActionsService.getActionsFor();
    vm.languages = [];
    vm.isProcessingAddUser = false;
    vm.addUser = addUser;
    vm.validateDataGroups = validateDataGroups;
    vm.dataGroupsInteractedWith = dataGroupsInteractedWith;
    vm.allowUserAdd = false;

    //Temp
    vm.inviteObject = {};

    $scope.userTypes = userTypes || [];
    $scope.user = userService.getUserObject();

    initialize();

    $scope.$watch('user.userType', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.name) {
            $scope.user.userActions = {};
            vm.actions = userActionsService.getActionsFor(newVal.name);
        }
    });

    function initialize() {
        if (!currentUser.hasAllAuthority() && !currentUser.hasUserRole('User Administrator')) {
            $state.go('noaccess');
        }

        vm.dataGroups.reduce(function (dataGroups, dataGroup) {
            if (dataGroup && dataGroup.name) {
                dataGroups[dataGroup.name] = false;
            }
            return dataGroups;
        }, $scope.user.dataGroups);
    }

    function addUser() {
        vm.isProcessingAddUser = true;

        vm.inviteObject = JSON.stringify(
            userService.getUserInviteObject($scope.user, vm.dataGroups, vm.actions),
            undefined,
            2
        );
    }

    function validateDataGroups() {
        var valid = false;

        valid = Array.prototype.map.call(Object.keys($scope.user.dataGroups), function (value) {
            return $scope.user.dataGroups[value];
        }).reduce(function (valid, curr) {
            return valid || curr;
        }, valid);

        return valid;
    }

    function dataGroupsInteractedWith(form) {
        var groups = dataStreamIds || (dataStreamIds = Object.keys(form).filter(function (key) {
            return regex.test(key);
        }));

        groups.forEach(function (key) {
            if (form[key].$dirty) { dataStreamInteractedWith = true; }
        });

        return dataStreamInteractedWith;
    }
}
