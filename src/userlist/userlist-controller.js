angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, userTypes, dataGroups, userListService) {
    var vm = this;

    vm.users = [];
    vm.pagination = userListService.pagination;
    vm.processing = {};
    vm.currentPage = 1;
    vm.pageChanged = pageChanged;
    vm.activateUser = activateUser;
    vm.deactivateUser = deactivateUser;
    vm.isProcessing = isProcessing;

    initialise();

    function initialise() {
        loadList();
    }

    function setUserList(users) {
        vm.users = users;
    }

    function pageChanged() {
        vm.pagination.setCurrentPage(vm.currentPage);
        loadList();
    }

    function loadList() {
        userListService.getList()
            .then(setUserList);
    }

    function activateUser() {
        //We need to request :all fields for the user to be able to disable him/her
        console.log(userId); //jshint ignore:line
    }

    function deactivateUser(user) {
        vm.processing[user.id] = true;
        console.log(user); //jshint ignore:line
    }

    function isProcessing(id) {
        console.log(vm.processing[id]); //jshint ignore:line
        if (vm.processing[id] && vm.processing[id] === true) {
            return true;
        }
        return false;
    }

//    //$scope.userTypes = userTypes || [];
//    $scope.userFilter = userFilter;
//    $scope.filter = $scope.userFilter[0];
//    $scope.filterRefine = [];
//    //vm.userFilter = userFilterService.getUserFilter();
//
//    vm.userTypes = userTypes;
//    vm.dataGroups = dataGroups;
//
//    vm.users = [
//        {name: 'Mark'},
//        {name: 'Paul'}
//    ];
//
//    $scope.setFilterRefine = function () {
//        window.console.log($scope.filter.name);
//        $scope.filterRefine = [];
//
//        if ($scope.filter.name === 'Types') {
//            $scope.filterRefine = vm.userTypes;
//            $scope.filterSecond = vm.userTypes[0];
//        } else if ($scope.filter.name === 'User Groups') {
//            $scope.filterRefine = vm.dataGroups;
//            $scope.filterSecond = vm.dataGroups[0];
//        }
//
//    };
//
//    $scope.getUserList = function (val) {
//        var inputText = val;
//        window.console.log(inputText);
//
//        return Restangular.one('users.json').get({
//            fields: 'id,name,email,userGroups,userCredentials',
//            filter: getFilterOptions(inputText),
//            paging: true,
//            pageSize: 25
//        }).then(function (response) {
//            vm.users = [];
//            return response.users.map(function (item) {
//                vm.users.push(item);
//                return item.name;
//            });
//
///*
//            return response.data.users.map(function (item) {
//                return item.name;
//            });
//*/
//            /*
//            var inputMatch = response.userRoles;
//
//            actions.forEach(function (action) {
//                //Only search roles for type independent actions
//                if (action.typeDependent) { return true; }
//
//                action.userRoleId = userRoles.reduce(function (current, value) {
//                    if (value.name === action.userRole) {
//                        return value.id;
//                    }
//                    return current;
//                }, action.userRoleId);
//            });
//*/
//        }, errorHandler.errorFn('Failed to load user roles for actions'));
//    };
//
//    function getFilterOptions(inputText) {
//        window.console.log('Filter Name: %o    Second Filter: %o  Text Input: %o',
//            $scope.filter, $scope.filterSecond, inputText);
//        //window.console.log($scope.filterRefine);
//        inputText = '';
//        return inputText;
//    }

    //function buildFilterOption
}
