angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, currentUser, dimensionConstraint,
                           userActionsService, userService, $state, notify, interAgencyService) {
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
    vm.inviteObject = {};

    $scope.userTypes = userTypes || [];
    $scope.user = userService.getUserObject();

    initialize();

    $scope.$watch('user.userType', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.name) {
            $scope.user.userActions = {};
            vm.actions = userActionsService.getActionsFor(newVal.name);

            if (newVal.name === 'Inter-Agency') {
                interAgencyService.getUserGroups().then(function (interAgencyUserGroups) {
                    $scope.user.userEntity = interAgencyUserGroups;
                });
            }
        }
    });

    function initialize() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            $state.go('noaccess');
        }

        if (vm.dataGroups.length <= 0) {
            $state.go('noaccess', {message: 'Your user account does not seem to have access to any of the data streams.'});
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

        if (!userService.verifyInviteData(vm.userInviteObject)) {
            notify.error('Invite did not pass basic validation');
            return;
        }

        //Add the all mechanisms group from the user entity
        if ($scope.user.userEntity &&
            $scope.user.userEntity.mechUserGroup &&
            $scope.user.userEntity.userUserGroup &&
            $scope.user.userEntity.mechUserGroup.id &&
            $scope.user.userEntity.userUserGroup.id) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.mechUserGroup);
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userUserGroup);
        } else {
            notify.error('User groups for mechanism and users not found on selected entity');
            return false;
        }

        if ($scope.user.userActions && $scope.user.userActions[managerRole] === true && $scope.user.userEntity.userAdminUserGroup) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userAdminUserGroup);
        }

        userService.inviteUser(vm.userInviteObject)
            .then(function (newUser) {
                if (newUser && angular.isString(newUser.name) && $scope.user.locale && $scope.user.locale.name) {
                    userService.saveUserLocale(newUser.name, $scope.user.locale.name)
                        .then(function () {
                            notify.success('User added successfully');
                            vm.isProcessingAddUser = false;
                            $state.go('add', {}, {reload: true});
                        }, function () {
                            notify.warning('Saved user but was not able to save the user locale');
                        });
                }

            }, function () {
                notify.error('Request to add the user failed');
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
