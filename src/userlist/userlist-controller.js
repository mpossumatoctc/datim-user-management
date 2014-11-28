angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, userTypes, dataGroups, userListService, userStatusService, errorHandler) {
    var vm = this;

    vm.detailsOpen = false;
    vm.users = [];
    vm.pagination = userListService.pagination;
    vm.processing = {};
    vm.currentPage = 1;
    vm.pageChanged = pageChanged;
    vm.activateUser = activateUser;
    vm.deactivateUser = deactivateUser;
    vm.isProcessing = isProcessing;
    vm.showDetails = showDetails;
    vm.detailsUser = undefined;
    vm.isDetailsUser = isDetailsUser;

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

    function activateUser(user) {
        vm.processing[user.id] = true;

        userStatusService.enable(user.id)
            .then(function () {
                vm.processing[user.id] = false;
                user.userCredentials.disabled = false;
            })
            .catch(function () {
                vm.processing[user.id] = false;
                errorHandler.error('Unable to enable the user');
            });
    }

    function deactivateUser(user) {
        vm.processing[user.id] = true;

        userStatusService.disable(user.id)
            .then(function () {
                vm.processing[user.id] = false;
                user.userCredentials.disabled = true;
            })
            .catch(function () {
                vm.processing[user.id] = false;
                errorHandler.error('Unable to disable the user');
            });
    }

    function isProcessing(id) {
        if (vm.processing[id] && vm.processing[id] === true) {
            return true;
        }
        return false;
    }

    function showDetails(user) {
        if (user !== vm.detailsUser) {
            vm.detailsUser = user;
            vm.detailsOpen = true;
        } else {
            vm.detailsUser = undefined;
            vm.detailsOpen = false;
        }
    }

    function isDetailsUser(user) {
        return user === vm.detailsUser;
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
