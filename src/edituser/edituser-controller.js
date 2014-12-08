angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, dataGroups, dataGroupsService, userToEdit,
                            userLocale, userFormService, userActionsService,
                            notify, errorHandler) {
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
        userToEdit.userCredentials.userRoles = userActionsService.combineSelectedUserRolesWithExisting(vm.userToEdit, vm.user, vm.dataGroups, vm.actions);

        //TODO: These need to be done separate according to
        //https://www.dhis2.org/doc/snapshot/en/developer/html/dhis2_developer_manual_full.html#d4719e1000
        userToEdit.userGroups = dataGroupsService.getUserGroups(vm.userToEdit, vm.dataGroups, vm.user.dataGroups);

        userToEdit.save()
            .then(function () {
                notify.success('User updated');
            })
            .catch(errorHandler.errorFn('Failed to save user'));
    }

    function debugWatch() {
        $scope.$watch('user.locale', function (newVal, oldVal) {
            if (newVal !== oldVal)  {
                console.log('Changed locale from:', oldVal, ' to ', newVal); //jshint ignore:line
            }
        });

        $scope.$watch('user.dataGroups', function (newVal, oldVal) {
            if (newVal !== oldVal)  {
                Object.keys(newVal || {}).map(function (key) {
                    if (!(oldVal[key] && oldVal[key] === newVal[key])) {
                        if (newVal[key] === true) {
                            console.log(key, 'added.'); //jshint ignore:line
                        } else {
                            console.log(key, 'removed.'); //jshint ignore:line
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
                            console.log(key, 'added.'); //jshint ignore:line
                        } else {
                            console.log(key, 'removed.'); //jshint ignore:line
                        }
                    }
                });
            }
        }, true);

        $scope.$watch('userToEdit', function (newVal, oldVal) {
            if (newVal !== oldVal)  {
                console.log(userToEdit); //jshint ignore:line
            }
        }, true);
    }
}
