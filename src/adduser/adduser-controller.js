angular.module('PEPFAR.usermanagement').controller('addUserController', addUserController);

function addUserController($scope, userTypes, dataGroups, userActionsService) {
    var vm = this;

    vm.title = 'Add or delete user';
    vm.dataGroups = dataGroups || [];
    vm.actions = [];
    vm.languages = [];
    vm.isProcessingAddUser = false;
    vm.addUser = addUser;
    vm.validateDataGroups = validateDataGroups;

    $scope.userTypes = userTypes || [];
    $scope.user = {
        userType: undefined,
        userEntity: undefined,
        email: undefined,
        userActions: {},
        userGroups: [],
        userRoles: [],
        dataGroups: {}
    };

    initialize();

    $scope.$watch('user.userType', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.name) {
            vm.actions = userActionsService.getActionsFor(newVal.name);
        }
    });

    function initialize() {
        vm.dataGroups.reduce(function (dataGroups, dataGroup) {
            if (dataGroup && dataGroup.name) {
                dataGroups[dataGroup.name] = false;
            }
            return dataGroups;
        }, $scope.user.dataGroups);
    }

    function addUser() {
        vm.isProcessingAddUser = true;
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
}
