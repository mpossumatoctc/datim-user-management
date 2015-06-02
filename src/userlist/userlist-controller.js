angular.module('PEPFAR.usermanagement').controller('userListController', userListController);

function userListController(userFilter, currentUser, userTypesService, dataGroupsService, userListService,  //jshint ignore:line
                            userStatusService, $state, errorHandler, userActions, userService, _) {
    var vm = this;
    var searchFieldNames = {
        name: 'name',
        username: 'userCredentials.username',
        'e-mail': 'email',
        roles: 'userCredentials.userRoles.name',
        'user role': 'userCredentials.userRoles.name',
        'user group': 'userGroups.name',
        'organisation unit': 'organisationUnits.name',
        types: 'userGroups.name'
    };

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
    vm.detailsUserEntity = {};
    vm.doSearch = doSearch;
    vm.editUser = editUser;
    vm.placeHolder = 'Search for user';
    vm.updatePlaceholder = updatePlaceholder;
    vm.closeDetails = closeDetails;
    vm.removeFilter = removeFilter;
    vm.addFilter = addFilter;
    vm.resetFilters = resetFilters;
    vm.canEditUser = canEditUser;
    vm.getCSVUrl = getCSVUrl;

    vm.search = {
        options: userFilter,
        filterType: undefined,
        searchWord: '',
        doSearch: _.debounce(vm.doSearch, 500),
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
        reloadFilters();
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

    //TODO: Move the jQuery stuff out of the controller as it's considered bad practice.
    //      Very nice solution provided by Paul but we should move it into a directive.
    //TODO: Perhaps it would also be nice to never have it be out of sight if it is available?
    var detailsBlock = jQuery('.user-details-view');
    function showDetails(user) {
        var detailsRow = jQuery('.user-list li[user-id=' + user.id + ']');
        var detailsWrap = detailsRow.parent();
        var parentHeight = detailsWrap.innerHeight();
        var position = detailsRow.position() || {};
        var detailsBlockHeight = detailsBlock.innerHeight() || 400; //TODO: Remove this static 400 in favour of some jQuery actual height calculation

        if (parentHeight > detailsBlockHeight && (detailsBlockHeight + position.top >= parentHeight)) {
            position.top = parentHeight - detailsBlockHeight;
        }

        if (!vm.detailsOpen) {
            detailsBlock.offset({top: position.top, right: 0}); //jshint ignore:line
        } else {
            detailsBlock.css('top', position.top); //jshint ignore:line
        }

        if (user !== vm.detailsUser) {
            vm.detailsUser = user;
            vm.detailsOpen = true;
            vm.getDataGroupsForUser(user);
            vm.detailsUserUserType = userTypesService.getUserType(user);
            userService.getUserEntity(user)
                .then(function (userEntity) {
                    vm.detailsUserEntity = userEntity;
                });
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
                dataGroups.forEach(function (dataGroup) {
                    var exactMatch = new RegExp('^Data Entry ' + dataGroup.name + '$', 'i');
                    var startMatch = new RegExp('^Data Entry ' + dataGroup.name + ' .+$', 'i');

                    var userRoles = (user.userCredentials && user.userCredentials.userRoles) || [];

                    var hasDataEntryForGroup = userRoles.some(function (userRole) {
                        return exactMatch.test(userRole.name) || startMatch.test(userRole.name);
                    });

                    dataGroup.entry = hasDataEntryForGroup;
                });

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

        vm.search.placeHolderText[$index] = outputStr + newVal.name;
    }

    //TODO: Move the search stuff to the filter service
    function doSearch() {
        var fieldNames = searchFieldNames;

        userListService.resetFilters();

        vm.search.activeFilters.forEach(function (filterDefinition) {
            var filter;

            //Only use valid filters
            if (!isValidFilter(filterDefinition)) { return; }

            var filtersThatRequireEquality = ['user role', 'user group'];
            var comparator = filterDefinition.comparator;
            if (filtersThatRequireEquality.indexOf(filterDefinition.type.name.toLowerCase()) >= 0) {
                comparator = 'eq';
            }

            filter = [
                fieldNames[filterDefinition.type.name.toLowerCase()],
                comparator,
                //Use the value if it is a string, otherwise check the value property and lastly use the name property
                angular.isString(filterDefinition.value) ? filterDefinition.value :
                    (filterDefinition.value.value ? filterDefinition.value.value : filterDefinition.value.name)
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

    function reloadFilters() {
        var fieldNames = _.invert(searchFieldNames);

        if (userListService.getFilters().length > 0) {
            userListService.getFilters().forEach(function (item) {
                var splitFilter = item.split(':');

                var temp = {
                    id: new Date().toString(),
                    type: undefined,
                    value: undefined,
                    comparator: 'like'
                };

                temp.type = userFilter.reduce(function (current, filter) {
                    if (filter.name.toLowerCase() === fieldNames[splitFilter[0]]) {
                        errorHandler.debug(splitFilter[0]);
                        errorHandler.debug(fieldNames[splitFilter[0]]);
                        errorHandler.debug(filter.name.toLowerCase());

                        current = filter;
                    }
                    return current;
                }, undefined);

                temp.value = splitFilter[2];

                if (isValidFilter(temp)) {
                    errorHandler.debug('Restoring filter', temp);
                    vm.search.activeFilters.push(temp);
                }
            });
        } else {
            addNameFilter();
        }
    }

    function resetFilters() {
        vm.search.activeFilters = [];
        userListService.resetFilters();
        doSearch();

        addNameFilter();
    }

    function addNameFilter() {
        addFilter();
        vm.search.activeFilters[0].type = {name: 'Name'};
    }

    function editUser(user) {
        if (user && user.id && user.userCredentials && user.userCredentials.username) {
            $state.go('edit', {userId: user.id, username: user.userCredentials.username});
        }
    }

    function canEditUser(user) {
        if (user && user.id && (user.id !== currentUser.id) && userTypesService.getUserType(user) !== 'Unknown type') {
            return true;
        }
        return false;
    }

    function getCSVUrl() {
        return userListService.getCSVUrl();
    }
}
