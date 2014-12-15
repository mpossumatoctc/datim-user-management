angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, currentUser, dimensionConstraint,
                           userActions, userService, $state, notify, interAgencyService,
                           userFormService, errorHandler) {
    var vm = this;
    var validations = userFormService.getValidations();

    vm.title = 'Add or delete user';
    vm.dataGroups = dataGroups || [];
    vm.actions = [];
    vm.languages = [];
    vm.isProcessingAddUser = false;
    vm.addUser = addUser;
    vm.validateDataGroups = validateDataGroups;
    vm.dataGroupsInteractedWith = validations.dataGroupsInteractedWith;
    vm.allowUserAdd = false;
    vm.dimensionConstraint = dimensionConstraint;
    vm.userInviteObject = {};
    vm.isRequiredDataStreamSelected = isRequiredDataStreamSelected;
    vm.updateDataEntry = updateDataEntry;
    vm.dataEntryAction = false;
    vm.isGlobalUser = currentUser.isGlobalUser && currentUser.isGlobalUser();

    errorHandler.debug(currentUser.isGlobalUser && currentUser.isGlobalUser() ? 'Is a global user' : 'Is not a global user');
    $scope.userOrgUnit = {
        current:  vm.activeOrgUnit = (currentUser && currentUser.organisationUnits && currentUser.organisationUnits[0]) || undefined
    };
    $scope.userTypes = userTypes || [];
    $scope.user = userService.getUserObject();

    $scope.$watch('userOrgUnit.current', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal && newVal.name) {
            $scope.$broadcast('ORGUNITCHANGED', newVal);
        }
    });

    initialize();

    $scope.$watch('user.userType', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal && newVal.name) {
            $scope.user.userActions = {};
            vm.actions = userActions.getActionsForUserType(newVal.name);

            if (newVal.name === 'Inter-Agency') {
                interAgencyService.getUserGroups().then(function (interAgencyUserGroups) {
                    $scope.user.userEntity = interAgencyUserGroups;
                });
            }
        }
    });

    function updateDataEntry() {
        var userType = $scope.user && $scope.user.userType && $scope.user.userType.name;
        var userGroupsThatApplyForDataEntryForUserType = userActions.getDataEntryRestrictionDataGroups(userType);

        Object.keys($scope.user.dataGroups)
            .forEach(function (dataGroup) {
                $scope.user.dataGroups[dataGroup].entry = vm.dataEntryAction && (userGroupsThatApplyForDataEntryForUserType.indexOf(dataGroup) >= 0);
            });
    }

    function initialize() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
        }

        if (vm.dataGroups.length <= 0) {
            $state.go('noaccess', {message: 'Your user account does not seem to have access to any of the data streams.'});
        }

        vm.dataGroups.reduce(function (dataGroups, dataGroup) {
            if (dataGroup && dataGroup.name) {
                dataGroups[dataGroup.name] = {
                    access: false,
                    entry: false
                };
            }
            return dataGroups;
        }, $scope.user.dataGroups);

        vm.actions = userActions.getActionsForUserType();
    }

    function addUser() {
        var managerRole = 'Manage users';

        vm.isProcessingAddUser = true;

        vm.userInviteObject = userService.getUserInviteObject($scope.user, vm.dataGroups, vm.actions, currentUser, userActions.dataEntryRestrictions);
        vm.userInviteObject.addDimensionConstraint(dimensionConstraint);
        if (!userService.verifyInviteData(vm.userInviteObject)) {
            notify.error('Invite did not pass basic validation');
            return;
        }

        //Add the all mechanisms group from the user entity
        console.log($scope.user); //jshint ignore:line
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

        //TODO: Clean this up
        userService.inviteUser(vm.userInviteObject)
            .then(function (newUser) {
                if (newUser.userCredentials && angular.isString(newUser.userCredentials.code) && $scope.user.locale && $scope.user.locale.name) {
                    userService.saveUserLocale(newUser.userCredentials.code, $scope.user.locale.name)
                        .then(function () {
                            notify.success('User added successfully');
                            $scope.user = userService.getUserObject();
                            vm.isProcessingAddUser = false;
                            $state.go('add', {}, {reload: true});
                        }, function () {
                            vm.isProcessingAddUser = false;
                            notify.warning('Saved user but was not able to save the user locale');
                        });
                }

            }, function () {
                notify.error('Request to add the user failed');
                vm.isProcessingAddUser = false;
            });
    }

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }
}
