/* global pick */
angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, currentUser, dimensionConstraint, //jshint maxstatements: 46
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
    vm.isGlobalUser = currentUser.isGlobalUser && currentUser.isGlobalUser();
    vm.dataEntryStreamNamesForUserType = [];
    vm.getDataEntryStreamNamesForUserType = getDataEntryStreamNamesForUserType;

    vm.isUserManager = undefined;

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
            vm.actions = userActions.filterActionsForCurrentUser(userActions.getActionsForUserType(newVal.name));

            if (newVal.name === 'Inter-Agency') {
                interAgencyService.getUserGroups(getCurrentOrgUnit()).then(function (interAgencyUserGroups) {
                    $scope.user.userEntity = interAgencyUserGroups;
                });
            }

            vm.dataEntryStreamNamesForUserType = vm.getDataEntryStreamNamesForUserType();

            vm.dataGroups.forEach(function (stream) {
                if (stream.name && (vm.dataEntryStreamNamesForUserType.indexOf(stream.name) < 0)) {
                    $scope.user.dataGroups[stream.name].entry = false;
                }
            });
        }
    });

    function updateDataEntry(streamName) {
        var userType = getUserType();
        var userGroupsThatApplyForDataEntryForUserType = userActions.getDataEntryRestrictionDataGroups(userType);

        if (!angular.isString(streamName)) {
            errorHandler.debug('Update data entry the streamname given is invalid');
            return;
        }

        if (userGroupsThatApplyForDataEntryForUserType.indexOf(streamName) >= 0) {
            //If data entry is given, also give the stream access
            if (streamName && $scope.user.dataGroups[streamName] && $scope.user.dataGroups[streamName].entry) {
                if ($scope.user.dataGroups[streamName].access === false) {
                    $scope.user.dataGroups[streamName].access = true;
                }
            }
        } else {
            //This is not a valid dataGroup for entry
            if ($scope.user.dataGroups[streamName]) {
                $scope.user.dataGroups[streamName].entry = false;
            }
        }
    }

    function initialize() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            errorHandler.debug('This user is not a user administrator');
            errorHandler.debug('All authority returned: ', currentUser.hasAllAuthority());
            errorHandler.debug('User administrator role returned: ', currentUser.isUserAdministrator());
            $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
            return;
        }
        if (vm.dataGroups.length <= 0) {
            errorHandler.debug('This user does not seem to have access to any data streams');
            errorHandler.debug('User data streams', vm.dataGroups, dataGroups);
            $state.go('noaccess', {message: 'Your user account does not seem to have access to any of the data streams.'});
            return;
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

    function getCurrentOrgUnit() {
        return ($scope.userOrgUnit && $scope.userOrgUnit.current) || {};
    }

    function addUser() {
        if (vm.isUserManager) {
            addUserManager();
        } else {
            addNormalUser();
        }
    }

    function addUserManager() {
        vm.isProcessingAddUser = true;

        vm.userInviteObject = getAdminInviteObject();
        addDimensionConstraintForType();
        addUserManagerUserRoles();
        addAllAvailableDataStreams();

        if (verifyUserInviteObject() &&
            addUserGroupsForMechanismsAndUsers() &&
            addUserGroupForUserAdmin()) {

            sendInvite();
        } else {
            notify.error('Unable to invite user manager');
        }
    }

    function addNormalUser() {
        vm.isProcessingAddUser = true;

        vm.userInviteObject = getInviteObject();
        addDimensionConstraintForType();

        if (!verifyUserInviteObject() || !addUserGroupsForMechanismsAndUsers()) {
            return;
        }

        sendInvite();
    }

    function sendInvite() {
        //TODO: Clean this up
        userService.inviteUser(vm.userInviteObject)
            .then(function (newUser) {
                if (newUser.userCredentials && angular.isString(newUser.userCredentials.username) && $scope.user.locale && $scope.user.locale.name) {
                    userService.saveUserLocale(newUser.userCredentials.username, $scope.user.locale.name)
                        .then(function () {
                            notify.success('User invitation sent');
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

    function getInviteObject() {
        return userService.getUserInviteObject(
            $scope.user,
            vm.dataGroups,
            vm.actions,
            [getCurrentOrgUnit()],
            userActions.dataEntryRestrictions
        );
    }

    function getAdminInviteObject() {
        return userService.getUserInviteObject(
            $scope.user,
            [],
            [],
            [getCurrentOrgUnit()],
            userActions.dataEntryRestrictionsUserManager
        );
    }

    function addDimensionConstraintForType() {
        if (getUserType() !== 'Inter-Agency') {
            vm.userInviteObject.addDimensionConstraint(dimensionConstraint);
        }
    }

    function verifyUserInviteObject() {
        if (!userService.verifyInviteData(vm.userInviteObject)) {
            notify.error('Invite did not pass basic validation');
            vm.isProcessingAddUser = true;
            return false;
        }
        return true;
    }

    function addUserGroupsForMechanismsAndUsers() {
        //Add the all mechanisms group from the user entity
        if (userEntityHasValidUserGroups()) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.mechUserGroup);
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userUserGroup);

            return true;
        }

        notify.error('User groups for mechanism and users not found on selected entity');
        return false;
    }

    function addUserGroupForUserAdmin() {
        if ($scope.user.userEntity.userAdminUserGroup) {
            vm.userInviteObject.addEntityUserGroup($scope.user.userEntity.userAdminUserGroup);
            return true;
        }
        notify.error('User admin group can not be found');
        return false;
    }

    function userEntityHasValidUserGroups() {
        return $scope.user.userEntity &&
            $scope.user.userEntity.mechUserGroup &&
            $scope.user.userEntity.userUserGroup &&
            $scope.user.userEntity.mechUserGroup.id &&
            $scope.user.userEntity.userUserGroup.id;
    }

    function addUserManagerUserRoles() {
        var hasUserRoleId = _.compose(_.size, _.values, _.partialRight(_.pick, ['userRoleId']));

        var adminActions = _.chain(vm.actions)
            .filter(hasUserRoleId)
            .map(function (userAction) {
                return {id: userAction.userRoleId};
            })
            .value();

        vm.userInviteObject.userCredentials.userRoles = vm.userInviteObject.userCredentials.userRoles.concat(adminActions);
    }

    function addAllAvailableDataStreams() {
        var dataAccessGroups = _.chain(vm.dataGroups)
            .map('userGroups')
            .flatten()
            .map(_.partialRight(_.pick, ['id']))
            .value();

        vm.userInviteObject.userGroups = vm.userInviteObject.userGroups.concat(dataAccessGroups);

        var dataEntryRoles = _.chain(userActions.dataEntryRestrictionsUserManager[getUserType()])
            .values()
            .flatten()
            .map(function (userAction) {
                return {id: userAction.userRoleId};
            })
            .value();

        vm.userInviteObject.userCredentials.userRoles = vm.userInviteObject.userCredentials.userRoles.concat(dataEntryRoles);
    }

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }

    //TODO: Duplicate code with the edit controller
    function getDataEntryStreamNamesForUserType() {
        if (!(currentUser && currentUser.userCredentials && Array.isArray(currentUser.userCredentials.userRoles))) {
            errorHandler.debug('currentUser.userCredentials.userRoles was not found on the currentUser object');
            return [];
        }

        var userEntryDataEntryStreams = userActions.getDataEntryRestrictionDataGroups(getUserType())
            .filter(function (streamName) {
                return currentUser.hasAllAuthority() || currentUser.userCredentials.userRoles
                    .map(pick('name'))
                    .some(function (roleName) {
                        return roleName === ['Data Entry', streamName].join(' ') ||
                            (streamName === 'SI' && /^Data Entry SI(?: Country Team)?$/.test(roleName));
                    });
            });

        errorHandler.debug('The following data entry streams were found based on your userroles or ALL authority and the selected usertype: ', userEntryDataEntryStreams);

        return userEntryDataEntryStreams;
    }

    function getUserType() {
        return $scope.user && $scope.user.userType && $scope.user.userType.name;
    }
}
