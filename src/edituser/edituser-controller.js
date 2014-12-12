angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, $state, currentUser, dataGroups, dataGroupsService, userToEdit,
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
    vm.changeUserStatus = changeUserStatus;
    vm.updateDataEntry = updateDataEntry;

    $scope.user = vm.user;

    initialise();
    debugWatch();

    function initialise() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
        }

        vm.userToEdit = userToEdit;
        vm.user.locale = userLocale;

        dataGroupsService.getDataGroupsForUser(userToEdit)
            .then(createDataGroupsObject)
            .then(setDataEntryModelValue);

        userActions.getActionsForUser(userToEdit)
            .then(setUserActionsForThisUser);
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
        vm.actions = actions;

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
    function updateDataEntry() {
        var userType = getUserType(userToEdit);
        var userGroupsThatApplyForDataEntryForUserType = userActions.getDataEntryRestrictionDataGroups(userType);

        if (vm.dataEntryAction === true) {
            Object.keys($scope.user.dataGroups)
                .forEach(function (dataGroup) {
                    $scope.user.dataGroups[dataGroup].entry = userGroupsThatApplyForDataEntryForUserType.indexOf(dataGroup) >= 0;
                });
        } else {
            Object.keys($scope.user.dataGroups)
                .forEach(function (dataGroup) {
                    $scope.user.dataGroups[dataGroup].entry = false;
                });
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

        setProcessingTo(true);

        userService.updateUser(userToEdit, userGroups)
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
        return userService.saveUserLocale(userToEdit.userCredentials.code, $scope.user.locale.name);
    }

    function getUserType() {
        return userTypesService.getUserType(userToEdit);
    }

    function changeUserStatus() {
        if (vm.userToEdit && vm.userToEdit.userCredentials) {
            vm.userToEdit.userCredentials.disabled = vm.userToEdit.userCredentials.disabled ? false : true;
        }
    }

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
