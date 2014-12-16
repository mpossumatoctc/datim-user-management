angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, currentUser, userTypesService, dataGroupsService, userListService,  //jshint ignore:line
                            userStatusService, $state, $scope, errorHandler, userActions) {
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
    vm.placeHolder = 'Search for user';
    vm.checkDownload = checkDownload;

    vm.search = {
        options: userFilter,
        filterType: undefined,
        filterTypeSecondary: undefined,
        searchWord: '',
        doSearch: _.debounce(vm.doSearch, 400),
        doSecondarySearch: doSecondarySearch,
        fileCreated: false,
        fileDownload: {
            url: '',
            download: ''
        }
    };

    initialise();

    function initialise() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            return $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
        }
        //window.console.log(currentUser);

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
            .then(buildCSV)
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
        return (vm.processing[id] && vm.processing[id] === true) ? true : false;
    }

    function showDetails(user) {
        if (user !== vm.detailsUser) {
            vm.detailsUser = user;
            vm.detailsOpen = true;
            vm.getDataGroupsForUser(user);
            vm.detailsUserUserType = userTypesService.getUserType(user);
            userActions.getActionsForUser(user).then(function (actions) {
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

    $scope.$watch('userList.search.filterType', function (newVal) {
        var phText = 'Search for ';
        var outputStr = '';

        if (newVal) {

            if (newVal.name === 'E-Mail' || newVal.name === 'Roles') {
                outputStr = phText + 'user ';
            } else {
                outputStr = phText;
            }
            //vm.placeHolder = phText + ' ' + newVal.name;

            vm.placeHolder = outputStr + newVal.name;
        }
    });

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
        resetFileDownload();

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

    //TODO: Refactor to factory if CSV functionality is needed elsewhere
    function checkDownload() {
        return !window.externalHost && 'download' in document.createElement('a'); //jshint ignore:line
    }

    function resetFileDownload() {
        vm.search.fileCreated = false;
    }

    function buildCSV() {
        var header = 'Name, Email, Last Login, Access Level, Groups\n';
        var localUsers = vm.users;
        var finalCSV = [];

        if (!vm.checkDownload()) {
            return;
        }

        for (var i = 0, len = localUsers.length; i < len; i = i + 1) {
            finalCSV.push(buildRow(localUsers[i]));
        }

        vm.search.fileDownload.url = 'data:text/csv;base64,' + window.btoa(
            header + finalCSV.join('\n')
        );
        vm.search.fileDownload.download = getFileName();
        vm.search.fileCreated = true;

    }

    function buildRow(row) {
        var tempObj = [];
        tempObj = [];
        tempObj.push(row.name);
        tempObj.push(row.email || '');
        tempObj.push(row.userCredentials.userRoles[0].name || '');
        tempObj.push(row.userCredentials.userRoles[0].lastUpdated);
        tempObj.push(row.userGroups || '');
        tempObj.push(row.organisationUnits || '');

        return tempObj.join(',');
    }

    function getFileName() {
        var res = new Date().toISOString();
        var filterName = vm.search.filterType && vm.search.filterType.name.toLowerCase() || '';
        var fileName = [];
		//jscs:disable
        fileName.push(res.substring(0,16).replace(/:/g,''));
        window.console.log(res.substring(0,16));
        //jscs:enable
        fileName.push(currentUser.name);
        if (filterName.length > 0) {
            fileName.push(filterName);
        }

        return fileName.join('-') + '.csv';
    }
}
