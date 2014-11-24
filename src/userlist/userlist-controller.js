angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController($scope, userFilter, userTypes, dataGroups) {
    var vm = this;

    //$scope.userTypes = userTypes || [];
    $scope.userFilter = userFilter;
    $scope.filter = $scope.userFilter[0];
    $scope.filterRefine = [];
    //vm.userFilter = userFilterService.getUserFilter();

    vm.userTypes = userTypes;
    vm.dataGroups = dataGroups;

    vm.refine = false;

    vm.users = [
        {name: 'Mark'},
        {name: 'Paul'}
    ];

    $scope.setFilterRefine = function () {
        window.console.log($scope.filter.name);
        $scope.filterRefine = [];

        if ($scope.filter.name === 'Types') {
            $scope.filterRefine = vm.userTypes;
            $scope.filterSecond = vm.userTypes[0];
        } else if ($scope.filter.name === 'User Groups') {
            $scope.filterRefine = vm.dataGroups;
            $scope.filterSecond = vm.dataGroups[0];
        }

    };
}
