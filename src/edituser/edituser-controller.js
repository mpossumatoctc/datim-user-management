angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, dataGroups, dataGroupsService, userToEdit,
                            userLocale, userFormService, userActionsService,
                            notify, errorHandler, _) {
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
        var userGroupIds = _.values(_.pluck(_.flatten(_.pluck(vm.dataGroups, 'userGroups')), 'id'));
        var baseGroups = _.filter(userToEdit.userGroups, function (userGroup) {
            return userGroupIds.indexOf(userGroup.id) === -1;
        });
        var dataUserGroups = _.flatten(_.pluck(_.filter(vm.dataGroups, function (dataGroup) {
            console.log(dataGroup); //jshint ignore:line
            return dataGroup.access === true;
        }), 'userGroups'));

        [].concat(baseGroups).concat(dataUserGroups);

        console.log(dataUserGroups); //jshint ignore:line

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
