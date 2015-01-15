/* global pick */
angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, $state, currentUser, dataGroups, dataGroupsService, userToEdit, //jshint maxstatements: 38
                            userLocale, userFormService, userActions,
                            notify, userService, userTypesService, errorHandler) {
    var vm = this;
    var validations = userFormService.getValidations();

    vm.userToEdit = {};
    vm.user = {
        locale: undefined,
        dataGroups: {},
        userActions: {}
    };
    vm.actions = [];
    vm.dataGroups = dataGroups || [];
    vm.validateDataGroups = validateDataGroups;
    vm.dataGroupsInteractedWith = validations.dataGroupsInteractedWith;
    vm.isRequiredDataStreamSelected = isRequiredDataStreamSelected;
    vm.editUser = editUser;
    vm.isProcessingEditUser = false;
    vm.getUserType = getUserType;
    vm.userEntityName = '';
    vm.changeUserStatus = changeUserStatus;
    vm.updateDataEntry = updateDataEntry;
    vm.dataEntryStreamNamesForUserType = [];

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

        vm.userToEdit = userToEdit;
        vm.user.locale = userLocale;

        vm.dataEntryStreamNamesForUserType = getDataEntryStreamNamesForUserType();

        dataGroupsService.getDataGroupsForUser(userToEdit)
            .then(correctUserRolesForType)
            .then(createDataGroupsObject)
            .then(setDataEntryModelValue);

        userActions.getActionsForUser(userToEdit)
            .then(setUserActionsForThisUser);

        userService.getUserEntity(userToEdit)
            .then(setUserEntityName);
    }

    function correctUserRolesForType(response) {
        ((Array.isArray(vm.dataGroups) && vm.dataGroups) || []).forEach(function (dataGroup) {
            var userRoles = userActions.dataEntryRestrictions && userActions.dataEntryRestrictions[getUserType()] && userActions.dataEntryRestrictions[getUserType()][dataGroup.name];
            dataGroup.userRoles = (userRoles || []).filter(function (userRole) {
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
        dataGroups.reduce(function (dataGroups, dataGroup) {
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

    function setDataEntryModelValue() {
        vm.dataEntryAction = Object.keys($scope.user.dataGroups).reduce(function (dataEntryStatus, dataGroup) {
            return dataEntryStatus || $scope.user.dataGroups[dataGroup].entry;
        }, false);
    }

    //TODO: This is partial duplicate code with the add controller and should be refactored
    function updateDataEntry(streamName) {
        var userType = getUserType(userToEdit);
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

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }

    function editUser() {
        var userGroups = dataGroupsService.getUserGroups(vm.userToEdit, vm.dataGroups, vm.user.dataGroups);
        userToEdit.userCredentials.userRoles = userActions.combineSelectedUserRolesWithExisting(vm.userToEdit, vm.user, vm.dataGroups, vm.actions);
        userToEdit.userGroups = userGroups;

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

    //TODO: Duplicate code with the add controller
    function getDataEntryStreamNamesForUserType() {
        if (!(currentUser && currentUser.userCredentials && Array.isArray(currentUser.userCredentials.userRoles))) {
            return [];
        }

        return userActions.getDataEntryRestrictionDataGroups(getUserType())
            .filter(function (steamName) {
                return currentUser.hasAllAuthority() || currentUser.userCredentials.userRoles
                    .map(pick('name'))
                    .some(function (roleName) {
                        return roleName === ['Data Entry', steamName].join(' ');
                    });
            });
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

    /**
     * Following function is only used for debugging information
     * TODO: When going into production, call to this method can be removed.
     */
    function debugWatch() {
        $scope.$watch('user.locale', logUserLocaleChange);

        $scope.$watch('user.dataGroups', function (newVal, oldVal) {
            if (newVal !== oldVal)  {
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
            if (newVal !== oldVal)  {
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
            if (newVal !== oldVal)  {
                errorHandler.debug('Changed locale from:', oldVal, ' to ', newVal); //jshint ignore:line
            }
        }
    }
}
