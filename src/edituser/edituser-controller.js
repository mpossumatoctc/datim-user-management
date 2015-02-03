angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, $state, currentUser, dataGroups, dataGroupsService, userToEdit, //jshint maxstatements: 55
                            userLocale, userFormService, userActions,
                            notify, userService, userTypesService, userUtils, errorHandler) {
    var vm = this;
    var validations = userFormService.getValidations();

    vm.userToEdit = userToEdit;
    vm.user = {
        locale: userLocale,
        dataGroups: {},
        userActions: {}
    };
    vm.actions = [];
    vm.dataGroups = getDataGroupsForUserType(dataGroups);
    vm.dataGroupsInteractedWith = validations.dataGroupsInteractedWith;
    vm.isProcessingEditUser = false;
    vm.userEntityName = '';
    vm.dataEntryStreamNamesForUserType = [];
    vm.isUserManager = userUtils.hasUserAdminRights(userToEdit);

    vm.validateDataGroups = validateDataGroups;
    vm.isRequiredDataStreamSelected = isRequiredDataStreamSelected;
    vm.editUser = editUser;
    vm.getUserType = getUserType;
    vm.changeUserStatus = changeUserStatus;
    vm.updateDataEntry = updateDataEntry;
    vm.getOrganisationUnitForUserToEdit = getOrganisationUnitForUserToEdit;
    vm.checkAllBoxesForUserManager = checkAllBoxesForUserManager;

    $scope.user = vm.user;

    initialise();
    debugWatch();

    function initialise() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
            return;
        }

        if (currentUser.id && userToEdit.id && currentUser.id === userToEdit.id) {
            $state.go('noaccess', {message: 'Editing your own account would only allow you to restrict it further, therefore it has been disabled.'});
            return;
        }

        vm.dataEntryStreamNamesForUserType = getDataEntryStreamNamesForUserType();

        dataGroupsService.getDataGroupsForUser(userToEdit)
            .then(correctUserRolesForType)
            .then(createDataGroupsObject);

        userActions.getActionsForUser(userToEdit)
            .then(setUserActionsForThisUser);

        userService.getUserEntity(userToEdit)
            .then(setUserEntityName);
    }

    function correctUserRolesForType(response) {
        ((Array.isArray(vm.dataGroups) && vm.dataGroups) || []).forEach(function (dataGroup) {
            window.console.log('logging groups');
            window.console.log(dataGroup);
            var userRoles = userActions.dataEntryRestrictions && userActions.dataEntryRestrictions[getUserType()] && userActions.dataEntryRestrictions[getUserType()][dataGroup.name];
            dataGroup.userRoles = (userRoles || [])
                .filter(function (userRole) {
                    return userRole.userRole && userRole.userRoleId && userRole.userRoleId !== '';
                }).map(function (userRole) {
                    return {
                        id: userRole.userRoleId,
                        name: userRole.userRole
                    };
                });
            return dataGroup;
        });

        return response;
    }

    function createDataGroupsObject(dataGroups) {
        getDataGroupsForUserType(dataGroups).reduce(function (dataGroups, dataGroup) {
            if (dataGroup && dataGroup.name) {
                dataGroups[dataGroup.name] = {
                    access: dataGroup.access,
                    entry: dataGroup.entry
                };
            }
            return dataGroups;
        }, $scope.user.dataGroups);
    }

    function setUserActionsForThisUser(actions) {
        vm.actions = userActions.filterActionsForCurrentUser(actions);

        vm.actions.map(function (action) {
            if (action.hasAction === true) {
                vm.user.userActions[action.name] = true;
            }
        });
    }

    function updateDataEntry(streamName) {
        userUtils.updateDataEntry(getUserType(), userActions, streamName, $scope);
    }

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }

    function editUser() {
        removeExtraUserManagementRoles();

        var userGroups = dataGroupsService.getUserGroups(vm.userToEdit, vm.dataGroups, vm.user.dataGroups);
        window.console.log('initial roles');
        window.console.log(userToEdit.userCredentials.userRoles);
        userToEdit.userCredentials.userRoles = userActions.combineSelectedUserRolesWithExisting(vm.userToEdit, vm.user, vm.dataGroups, vm.actions);
        window.console.log('adjusted roles');
        window.console.log(userToEdit.userCredentials.userRoles);
        userToEdit.userGroups = userGroups;

        fixUserManagementRole();
        addExtraUserManagementRoles();

        setProcessingTo(true);

        userService.updateUser(userToEdit)
            .then(function () {
                if ($scope.user.locale && $scope.user.locale.name) {
                    saveUserLocale()
                        .then(notifyUserOfSuccessfullSave)
                        .catch(notifyUserOfFailedLocaleSave);
                } else {
                    notifyUserOfSuccessfullSave();
                }
            })
            .catch(errorHandler.errorFn('Failed to save user'))
            .finally(setProcessingToFalse);
    }

    function fixUserManagementRole() {
        var userManagementRole = userActions.actions.reduce(function (current, action) {
            if (action.userRole === 'User Administrator' && action.userRoleId) {
                return {id: action.userRoleId, name: action.userRole};
            }
            return current;
        }, undefined);

        if (!userManagementRole) {return;}

        if (vm.isUserManager && !userUtils.hasUserRole(vm.userToEdit, {name: 'User Administrator'})) {
            userToEdit.userCredentials.userRoles.push(userManagementRole);

            errorHandler.debug('Adding user management role to the user');
        }

        if (!vm.isUserManager && userUtils.hasUserRole(vm.userToEdit, {name: 'User Administrator'})) {
            userToEdit.userCredentials.userRoles = (userToEdit.userCredentials.userRoles || []).filter(function (userRole) {
                return userRole.id !== userManagementRole.id;
            });

            errorHandler.debug('Removing user management role from the user');
        }
    }

    function addExtraUserManagementRoles() {
        if (vm.isUserManager) {
            var extraUserRoles = getExtraUserManagementRoles(userToEdit.userCredentials.userRoles);

            errorHandler.debug('Adding extra user management roles', extraUserRoles);

            userToEdit.userCredentials.userRoles = userToEdit.userCredentials.userRoles.concat(extraUserRoles);
        }
    }

    function getExtraUserManagementRoles() {
        return getUserManagementRoles()
            .filter(function (userRole) {
                var currentUserRoleIds = getCurrentUserRoleIds();

                return currentUserRoleIds.indexOf(userRole.id) === -1;
            })
            .value();
    }

    function getCurrentUserRoleIds() {
        return userToEdit.userCredentials.userRoles
            .map(function (item) {
                return item.id;
            });
    }

    function getUserManagementRoleIds() {
        return getUserManagementRoles()
            .map(function (userRole) {
                return userRole.id;
            });
    }

    function removeExtraUserManagementRoles() {
        if (!vm.isUserManager) {
            userToEdit.userCredentials.userRoles = (userToEdit.userCredentials.userRoles || [])
                .filter(function (userRole) {
                    var userManagementRoleIds = getUserManagementRoleIds();

                    return userManagementRoleIds.indexOf(userRole.id) === -1;
                });
        }
    }

    function getUserManagementRoles() {
        return _.chain(userActions.dataEntryRestrictionsUserManager[getUserType()])
            .values()
            .flatten()
            .unique('userRoleId')
            .map(function (userAction) {
                return {
                    id: userAction.userRoleId,
                    name: userAction.userRole
                };
            });
    }

    function notifyUserOfSuccessfullSave() {
        return notify.success('User updated');
    }

    function notifyUserOfFailedLocaleSave() {
        return notify.warning('Updated user but failed to save the ui locale');
    }

    function setProcessingTo(isProcessing) {
        vm.isProcessingEditUser = isProcessing;
    }

    function setProcessingToFalse() {
        return setProcessingTo(false);
    }

    function saveUserLocale() {
        return userService.saveUserLocale(userToEdit.userCredentials.username, $scope.user.locale.name);
    }

    function getUserType() {
        return userTypesService.getUserType(userToEdit);
    }

    function getDataEntryStreamNamesForUserType() {
        return userUtils.getDataEntryStreamNamesForUserType(currentUser, userActions, getUserType);
    }

    function changeUserStatus() {
        if (vm.userToEdit && vm.userToEdit.userCredentials) {
            vm.userToEdit.userCredentials.disabled = vm.userToEdit.userCredentials.disabled ? false : true;
        }
    }

    function setUserEntityName(userEntity) {
        if (userEntity && userEntity.userUserGroup) {
            if (userEntity.name) {
                vm.userEntityName = userEntity.name;
            } else {
                vm.userEntityName = String.prototype.replace.apply(userEntity.userUserGroup.name || '', [/^OU /, '']);
            }
        }
    }

    function getOrganisationUnitForUserToEdit() {
        if (userToEdit.organisationUnits && userToEdit.organisationUnits[0] && userToEdit.organisationUnits[0].name) {
            return userToEdit.organisationUnits[0].name;
        }
        return 'Unknown';
    }

    function checkAllBoxesForUserManager() {
        if (vm.isUserManager) {
            userUtils.storeDataStreamsAndEntry($scope.user.dataGroups);
            userUtils.storeUserActions($scope.user.userActions);

            $scope.user.dataGroups = userUtils.setAllDataStreamsAndEntry($scope.user.dataGroups);
            $scope.user.userActions = userUtils.setAllActions(vm.actions, true);
        } else {
            //TODO: Remove all the extra added fields that are not possible to be removed through the ui
            //TODO: check if there is some data to be able to be restored, otherwise reset to empty
            _.forEach(vm.actions, function (action) {
                if ($scope.user.userActions[action.name] && !action.default) {
                    $scope.user.userActions[action.name] = false;
                }
            });
            _.forEach($scope.user.dataGroups, function (userGroup) {
                userGroup.access = false;
                userGroup.entry = false;
            });
        }
    }

    function getDataGroupsForUserType(dataGroups) {
        if (getUserType() === 'Partner') {
            errorHandler.debug('Partner type found remove sims as datagroup');
            return _.chain(dataGroups)
                .reject({name: 'SIMS'})
                .value();
        }
        return dataGroups || [];
    }

    /**
     * Following function is only used for debugging information
     * TODO: When going into production, call to this method can be removed.
     */
    function debugWatch() {
        $scope.$watch('user.locale', logUserLocaleChange);

        $scope.$watch('user.dataGroups', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                Object.keys(newVal || {}).map(function (key) {
                    if (!(oldVal[key] && oldVal[key].access === newVal[key].access)) {
                        if (newVal[key].access === true) {
                            errorHandler.debug([key, 'added.'].join(' '));
                        } else {
                            errorHandler.debug([key, 'removed.'].join(' '));
                        }
                    }
                });
            }
        }, true);

        $scope.$watch('user.userActions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                Object.keys(newVal || {}).map(function (key) {
                    if (!(oldVal[key] && oldVal[key] === newVal[key])) {
                        if (newVal[key] === true) {
                            errorHandler.debug([key, 'added.'].join(' '));
                        } else {
                            errorHandler.debug([key, 'removed.'].join(' '));
                        }
                    }
                });
            }
        }, true);

        function logUserLocaleChange(newVal, oldVal) {
            if (newVal !== oldVal) {
                errorHandler.debug('Changed locale from:', oldVal, ' to ', newVal); //jshint ignore:line
            }
        }
    }
}
