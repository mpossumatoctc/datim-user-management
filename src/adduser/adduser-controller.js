angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, currentUser, dimensionConstraint,
                           userActionsService, userService, $state) {
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
    vm.dimensionConstraint = dimensionConstraint;

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
        var managerRole = 'Manage users';

        vm.isProcessingAddUser = true;

        vm.userInviteObject = userService.getUserInviteObject($scope.user, vm.dataGroups, vm.actions, currentUser);
        vm.userInviteObject.addDimensionConstraint(dimensionConstraint);

        //Add the all mechanisms group from the user entity
        if ($scope.user.userEntity && $scope.user.userEntity.mechUserGroup && $scope.user.userEntity.userUserGroup) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.mechUserGroup);
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userUserGroup);
        }

        if ($scope.user.userActions && $scope.user.userActions[managerRole] === true && $scope.user.userEntity.userAdminUserGroup) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userAdminUserGroup);
        }

        userService.inviteUser(vm.userInviteObject)
            .then(function (response) {
                console.log(response); //jshint ignore:line
                window.alert('user added');
                vm.isProcessingAddUser = false;
            });
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
