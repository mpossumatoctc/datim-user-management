angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, userTypes, dataGroupsService, userListService, userStatusService, errorHandler) { //jshint ignore:line
    var vm = this;

    vm.detailsOpen = false;
    vm.users = [];
    vm.pagination = userListService.pagination;
    vm.processing = {};
    vm.listIsLoading = false;
    vm.currentPage = 1;
    vm.pageChanged = pageChanged;
    vm.activateUser = activateUser;
    vm.deactivateUser = deactivateUser;
    vm.isProcessing = isProcessing;
    vm.showDetails = showDetails;
    vm.detailsUser = undefined;
    vm.isDetailsUser = isDetailsUser;
    vm.getDataGroupsForUser = getDataGroupsForUser;
    vm.detailsUserDataGroups = [];
    vm.detailsUserUserType = '';
    vm.getUserType = getUserType;
    vm.doSearch = doSearch;

    vm.search = {
        options: userFilter,
        filterType: undefined,
        filterTypeSecondary: undefined,
        searchWord: '',
        doSearch: _.debounce(vm.doSearch, 400),
        doSecondarySearch: doSecondarySearch
    };

    initialise();

    function initialise() {
        loadList();
    }

    function setUserList(users) {
        vm.listIsLoading = false;
        vm.users = users;
    }

    function pageChanged() {
        vm.pagination.setCurrentPage(vm.currentPage);
        loadList();
    }

    function loadList() {
        vm.listIsLoading = true;
        userListService.getList()
            .then(setUserList)
            .catch(function () {
                vm.listIsLoading = false;
            });
    }

    function activateUser(user) {
        vm.processing[user.id] = true;

        userStatusService.enable(user.id)
            .then(function () {
                user.userCredentials.disabled = false;
                vm.processing[user.id] = false;
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
                user.userCredentials.disabled = true;
                vm.processing[user.id] = false;
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
            vm.getDataGroupsForUser(user);
            vm.detailsUserUserType = vm.getUserType(user);
        } else {
            vm.detailsUser = undefined;
            vm.detailsOpen = false;
        }
    }

    function isDetailsUser(user) {
        return user === vm.detailsUser;
    }

    function getDataGroupsForUser(user) {
        dataGroupsService.getDataGroupsForUser(user)
            .then(function (dataGroups) {
                vm.detailsUserDataGroups = dataGroups;
            })
            .catch(function () {
                errorHandler.warning('Failed to load datagroups for user');
            });
    }

    //TODO: Move this out and perhaps use the available usertype services
    function getUserType(user) {
        var userTypesForMatches = userTypes.map(fixCountryType).reverse();

        return userTypesForMatches.reduce(function (currentType) {
            var userGroupRegex = new RegExp('OU .+? (.+?) ', 'i');
            (user && user.userGroups || []).forEach(function (userGroup) {
                var matches = userGroupRegex.exec(userGroup.name);

                if (matches && (userTypesForMatches.indexOf(matches[1]) >= 0)) {
                    currentType = matches[1];

                    if (currentType.toLowerCase() === 'country') {
                        currentType = 'Inter-Agency';
                    }
                }
            });
            return currentType;
        }, 'Unknown type');

        function fixCountryType(userType) {
            if (userType.name === 'Inter-Agency') {
                return 'Country';
            }
            return userType.name;
        }
    }

    //TODO: Move the search stuff to the filter service
    function doSearch() {
        var selectedFilterType = vm.search.filterType.name.toLowerCase();
        var filter = [];
        var fieldNames = {
            name: 'name',
            username: 'userCredentials.code',
            'e-mail': 'email',
            roles: 'userCredentials.userRoles.name',
            'user groups': 'userGroups.name',
            'organisation unit': 'organisationUnits.name',
            types: 'userGroups.name'
        };

        if (!selectedFilterType && (!vm.search.filterTypeSecondary || vm.search.searchWord === '')) {
            return;
        }

        filter.push(fieldNames[selectedFilterType]);
        filter.push('like');
        if (vm.search.filterType.secondary) {
            //secondary search
            //TODO: Don't compare the string here but make it some option in the filter service
            if (vm.search.filterTypeSecondary.name === 'Inter-Agency') {
                filter.push('Country team');
            } else {
                filter.push(vm.search.filterTypeSecondary.name);
            }

        } else {
            //text search
            filter.push(vm.search.searchWord);
        }
        console.log(filter.join(':')); //jshint ignore:line
        userListService.setFilter(filter.join(':'));
        loadList();
    }

    function doSecondarySearch($item) {
        vm.search.filterTypeSecondary = $item;
        doSearch();
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
