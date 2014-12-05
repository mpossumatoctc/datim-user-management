angular.module('PEPFAR.usermanagement').controller('editUserController', editUserController);

function editUserController($scope, dataGroups, dataGroupsService, userToEdit, userLocale, userFormService,
                            userActionsService) {
    var vm = this;
    var validations = userFormService.getValidations();

    vm.userToEdit = {};
    vm.user = {
        locale: undefined,
        dataGroups: {}
    };
    vm.actions = [];
    vm.dataGroups = dataGroups || [];
    vm.validateDataGroups = validateDataGroups;
    vm.dataGroupsInteractedWith = validations.dataGroupsInteractedWith;
    vm.isRequiredDataStreamSelected = isRequiredDataStreamSelected;
    $scope.user = vm.user;

    initialise();

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
                console.log(actions); //jshint ignore:line
                vm.actions = actions;
            });
    }

    function validateDataGroups() {
        return validations.validateDataGroups($scope.user.dataGroups);
    }

    function isRequiredDataStreamSelected(dataGroupNames) {
        return validations.isRequiredDataStreamSelected(dataGroupNames, $scope.user, vm.dataGroups);
    }
}
