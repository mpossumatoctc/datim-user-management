angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, dataGroups, dataGroupsService, userToEdit,
                            userLocale, userFormService, userActionsService,
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

    $scope.user = vm.user;

    initialise();
    debugWatch();

    function initialise() {
        vm.userToEdit = userToEdit;
        vm.user.locale = userLocale;

        dataGroupsService.getDataGroupsForUser(userToEdit)
            .then(function (dataGroups) {
                dataGroups.reduce(function (dataGroups, dataGroup) {
                    if (dataGroup && dataGroup.name) {
                        dataGroups[dataGroup.name] = dataGroup.access;
                    }
                    return dataGroups;
                }, $scope.user.dataGroups);
            });
        userActionsService.getActionsForUser(userToEdit)
            .then(function (actions) {
                vm.actions = actions;
                vm.actions.map(function (action) {
                    if (action.hasAction === true) {
                        vm.user.userActions[action.name] = true;
                    }
                });
            });
    }

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }

    function editUser() {
        var userGroups = dataGroupsService.getUserGroups(vm.userToEdit, vm.dataGroups, vm.user.dataGroups);

        userToEdit.userCredentials.userRoles = userActionsService.combineSelectedUserRolesWithExisting(vm.userToEdit, vm.user, vm.dataGroups, vm.actions);

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

    function debugWatch() {
        $scope.$watch('user.locale', logUserLocaleChange);

        $scope.$watch('user.dataGroups', function (newVal, oldVal) {
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
