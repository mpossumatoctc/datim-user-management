angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController($scope, userFilter, userTypes, dataGroups, Restangular, errorHandler) {
    var vm = this;

    //$scope.userTypes = userTypes || [];
    $scope.userFilter = userFilter;
    $scope.filter = $scope.userFilter[0];
    $scope.filterRefine = [];
    //vm.userFilter = userFilterService.getUserFilter();

    vm.userTypes = userTypes;
    vm.dataGroups = dataGroups;

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

    $scope.getUserList = function (val) {
        var inputText = val;
        window.console.log(inputText);

        return Restangular.one('users.json').get({
            fields: 'id,name,email,userGroups,UserCredentials',
            filter: getFilterOptions(inputText),
            paging: false
        }).then(function (response) {
            vm.users = [];
            return response.users.map(function (item) {
                vm.users.push(item);
                return item.name;
            });

/*
            return response.data.users.map(function (item) {
                return item.name;
            });
*/
            /*
            var inputMatch = response.userRoles;

            actions.forEach(function (action) {
                //Only search roles for type independent actions
                if (action.typeDependent) { return true; }

                action.userRoleId = userRoles.reduce(function (current, value) {
                    if (value.name === action.userRole) {
                        return value.id;
                    }
                    return current;
                }, action.userRoleId);
            });
*/
        }, errorHandler.errorFn('Failed to load user roles for actions'));
    };

    function getFilterOptions(inputText) {
        inputText = '';
        window.console.log('Filter Name: %s    Second Filter: %s  Text Input: %s',
            $scope.filter, $scope.filterRefine, inputText);
        window.console.log($scope.filterRefine);

        return inputText;
    }
}
