angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, userTypesService, dataGroupsService, userListService, userStatusService, userActionsService, $state, errorHandler) {
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
    vm.detailsUserActions = [];
    vm.doSearch = doSearch;
    vm.editUser = editUser;

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
            vm.detailsUserUserType = userTypesService.getUserType(user);
            userActionsService.getActionsForUser(user).then(function (actions) {
                vm.detailsUserActions = actions;
            });
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
        vm.doSearch();
    }

    function editUser(user) {
        if (user && user.id && user.userCredentials && user.userCredentials.code) {
            $state.go('edit', {userId: user.id, username: user.userCredentials.code});
        }
    }
}
