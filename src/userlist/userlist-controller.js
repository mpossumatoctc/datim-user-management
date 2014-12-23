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
    vm.updatePlaceholder = updatePlaceholder;
    vm.checkDownload = checkDownload;
    vm.closeDetails = closeDetails;
    vm.removeFilter = removeFilter;
    vm.addFilter = addFilter;
    vm.resetFilters = resetFilters;

    vm.search = {
        options: userFilter,
        filterType: undefined,
        searchWord: '',
        doSearch: _.debounce(vm.doSearch, 500),
        fileCreated: false,
        fileDownload: {
            url: '',
            download: ''
        },
        getFilters: getFilters,
        activeFilters: [],
        addFilter: addFilter,
        placeHolderText: [],
        hasSecondaryFilter: hasSecondaryFilter,
        getSecondaryFilter: getSecondaryFilter

    };

    initialise();

    function initialise() {
        if (!currentUser.hasAllAuthority() && !currentUser.isUserAdministrator()) {
            return $state.go('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
        }

        loadList();
    }

    function hasSecondaryFilter(filterIndex) {
        return (vm.search.activeFilters[filterIndex] && vm.search.activeFilters[filterIndex].type && vm.search.activeFilters[filterIndex].type.secondary);
    }

    function getSecondaryFilter(filterIndex) {
        if (hasSecondaryFilter(filterIndex)) {
            return vm.search.activeFilters[filterIndex].type.secondary;
        }
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
        //window.console.log(user);

        if (user !== vm.detailsUser) {
            //jscs:disable
            var position = $('.user-list li[user-id=' + user.id + ']').position() || {}; //jshint ignore:line
            $('.user-details-view').offset({top: position.top, right: 0}); //jshint ignore:line
            //window.console.log(position);
			//jscs:enable
            vm.detailsUser = user;
            vm.detailsOpen = true;
            vm.getDataGroupsForUser(user);
            vm.detailsUserUserType = userTypesService.getUserType(user);
            userActions.getActionsForUser(user).then(function (actions) {
                vm.detailsUserActions = actions;
            });

        } else {
            closeDetails();
        }
    }

    function closeDetails() {
        vm.detailsUser = undefined;
        vm.detailsOpen = false;
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

    function updatePlaceholder($index) {
        var newVal = vm.search.filterType[$index];
        var phText = 'Search for ';
        var outputStr = '';

        if (newVal.name === 'E-Mail' || newVal.name === 'Roles') {
            outputStr = phText + 'user ';
        } else {
            outputStr = phText;
        }

        window.console.log(vm.search.placeHolderText[$index]);
        vm.search.placeHolderText[$index] = outputStr + newVal.name;

    }

    //TODO: Move the search stuff to the filter service
    function doSearch() {
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

        userListService.resetFilters();

        vm.search.activeFilters.forEach(function (filterDefinition) {
            var filter;

            //Only use valid filters
            if (!isValidFilter(filterDefinition)) { return; }

            filter = [
                fieldNames[filterDefinition.type.name.toLowerCase()],
                filterDefinition.comparator,
                angular.isString(filterDefinition.value) ? filterDefinition.value : filterDefinition.value.name
            ];

            userListService.setFilter(filter.join(':'));
        });

        loadList();
    }

    function isValidFilter(filterDefinition) {
        return filterDefinition &&
            filterDefinition.type &&
            filterDefinition.type.name &&
            filterDefinition.comparator &&
            filterDefinition.value;
    }

    function removeFilter($index) {
        vm.search.activeFilters.splice($index, 1);
        userListService.removeFilter($index);
        doSearch();
    }

    function addFilter() {
        if (vm.search.activeFilters.length < 5) {
            vm.search.activeFilters.push({
                id: new Date().toString(),
                type: undefined,
                value: undefined,
                comparator: 'like'
            });
        }
    }

    function resetFilters() {
        vm.search.activeFilters = [];
        userListService.resetFilters();
        doSearch();
    }

    function editUser(user) {
        if (user && user.id && user.userCredentials && user.userCredentials.code) {
            $state.go('edit', {userId: user.id, username: user.userCredentials.code});
        }
    }

    function getFilters() {
        vm.search.filters = userListService.getFilters();
    }

    //TODO: Refactor to factory if CSV functionality is needed elsewhere
    function checkDownload() {
        return !window.externalHost && 'download' in document.createElement('a'); //jshint ignore:line
    }

    function resetFileDownload() {
        vm.search.fileCreated = false;
    }

    function buildCSV() {
        var header = 'Name, Email, Last Login, Access Level, Groups\r\n';
        var localUsers = vm.users;
        var finalCSV = [];

        if (!vm.checkDownload()) {
            return;
        }

        try {
            for (var i = 0, len = localUsers.length; i < len; i = i + 1) {
                finalCSV.push(buildRow(localUsers[i]));
            }

            vm.search.fileDownload.url = 'data:text/csv;charset=utf-8,' + window.escape(
                header + finalCSV.join('\r\n')
            );

        } catch (e) {
            window.console.error(e);
            return;
        }

        vm.search.fileDownload.download = getFileName();
        vm.search.fileCreated = true;

    }

    function buildRow(row) {
        var tempObj = [];

        tempObj.push(row.name);
        tempObj.push(row.email || '');
        tempObj.push(buildList(row.userCredentials.userRoles) || '');
        tempObj.push(row.userCredentials.userRoles[0].lastUpdated || '');
        tempObj.push(buildList(row.userGroups) || '');
        tempObj.push(buildList(row.organisationUnits) || '');

        return tempObj.join(',');
    }

    function getFileName() {
        var res = new Date().toISOString();
        var fileName = [];

        fileName.push(res.substring(0, 16).replace(/:/g, ''));
        fileName.push(currentUser.name);

        window.console.log(res.substring(0, 16));

        return fileName.join('-') + '.csv';
    }

    function buildList(listArr) {
        var arr = [];

        for (var i = 0, len = listArr.length; i < len; i = i + 1) {
            arr.push(listArr[i].name);
        }

        return '"' + arr.join(',') + '"';
    }
}
