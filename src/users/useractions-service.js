angular.module('PEPFAR.usermanagement').factory('userActionsService', userActionsService);

function userActionsService(Restangular, $q, userTypesService, dataGroupsService, userService,
                            errorHandler) {
    var availableAgencyActions = [
        'Capture data', 'Accept data', 'Submit data', 'Manage users'
    ];
    var availableInterAgencyActions = [
        'Data Entry', 'Accept data', 'Submit data', 'Manage users'
    ];
    var availablePartnerActions =  [
        'Capture data', 'Submit data', 'Manage users'
    ];
    var actions = [
        {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
        {name: 'Data Entry', userRole: 'Data Entry SI Country Team', dataStream: ['SI']},
        {name: 'Accept data', userRole: 'Data Accepter'},
        {name: 'Submit data', userRole: 'Data Submitter'},
        {name: 'Manage users', userRole: 'User Administrator'},
        {name: 'Read data', userRole: 'Read Only', default: true}
    ];
    var actionRolesLoaded;

    initialise();
    return {
        actions: actions,
        getActionsForUserType: getActionsForUserType,
        getActionsForUser: getActionsForUser,
        getUserRolesForUser: getUserRolesForUser,
        combineSelectedUserRolesWithExisting: combineSelectedUserRolesWithExisting
    };

    function initialise() {
        actionRolesLoaded = Restangular.one('userRoles').withHttpConfig({cache: true}).get({
            fields: 'id,name',
            filter: getRoleFilters(),
            paging: false
        }).then(function (response) {
            var userRoles = response.userRoles;

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
        }, errorHandler.errorFn('Failed to load user roles for actions'));
    }

    function getRoleFilters() {
        return actions.filter(function (action) {
            return action.userRole && (!action.typeDependent || action.typeDependent !== true);
        }).map(function (action) {
            return [
                'name',
                'eq',
                action.userRole
            ].join(':');
        });
    }

    function getAvailableActionsForUserType(userType) {
        if (typeof userType === 'string') {
            userType = userType.toLowerCase();
        }

        switch (userType) {
            case 'agency':
                return availableAgencyActions;
            case 'partner':
                return availablePartnerActions;
            case 'inter-agency':
                return availableInterAgencyActions;
        }
        return [];
    }

    function getActionsForUserType(userType) {
        var availableActions = getAvailableActionsForUserType(userType);

        return actions.filter(function (action) {
            return (availableActions.indexOf(action.name) >= 0) || action.default;
        });
    }

    function getActionsForUser(user) {
        var actions = getActionsForUserType(userTypesService.getUserType(user));
        var userRoles = (user && user.userCredentials && user.userCredentials.userRoles) || [];
        var userRoleIds = userRoles.map(pick('id'));
        var promise;

        return actionRolesLoaded.then(function () {
            actions.forEach(function (action) {
                if (action.name === 'Capture data') {
                    promise = hasDataEntry(user).then(function (hasDataEntry) {
                        action.hasAction = hasDataEntry;
                    });
                } else {
                    action.hasAction = hasUserRoleFor(userRoleIds, action);
                }
            });

            return $q.when(promise).then(function () {
                return actions;
            });
        });
    }

    function hasDataEntry(user) {
        return dataGroupsService.getDataGroupsForUser(user)
            .then(function (dataGroups) {
                return dataGroups.reduce(function (hasEntry, dataGroup) {
                    return hasEntry || dataGroup.entry;
                }, false);
            });
    }

    function hasUserRoleFor(userRoleIds, action) {
        return (userRoleIds.indexOf(action.userRoleId) >= 0);
    }

    function getUserActionsForNames(selectedActions, actions) {
        var userActions;
        var selectedActionNames = Object.keys(selectedActions)
            .map(function (key) {
                if (selectedActions[key] === true) {
                    return key;
                }
                return undefined;
            }).filter(function (action) {
                return action && action !== '';
            });

        userActions = (actions || []).filter(function (action) {
            return selectedActionNames.indexOf(action.name) >= 0;
        });

        return userActions;
    }

    function getUserRolesForUser(user, dataGroups, actions) {
        var dataGroupsWithEntry;
        var userRoles;
        var dataEntryRoles;
        var userActions = (user && user.userActions) || [];

        dataGroupsWithEntry = userService.getSelectedDataGroups(user, dataGroups, actions)
            .map(function (dataGroup) {
                if (userActions['Capture data'] === true || userActions['Data Entry'] === true) {
                    dataGroup.entry = true;
                } else {
                    dataGroup.entry = false;
                }
                return dataGroup;
            });

        userRoles = getUserActionsForNames(userActions, actions)
            .map(pick('userRoleId', 'userRole'))
            .filter(has('userRoleId'))
            .map(function (item) {
                return {
                    name: item.userRole,
                    id: item.userRoleId
                };
            });

        dataEntryRoles = dataGroupsWithEntry
            .filter(has('entry'))
            .map(pick('userRoles'))
            .reduce(flatten(), []);

        return userRoles.concat(dataEntryRoles);
    }

    function getAvailableUserRoles(dataGroups, actions) {
        var dataGroupRoles = (dataGroups || [])
            .map(pick('userRoles'))
            .reduce(flatten(), []);

        var actionRoles = (actions || [])
            .filter(has('userRoleId'))
            .map(pick('userRole', 'userRoleId'))
            .map(function (item) {
                return {
                    name: item.userRole,
                    id: item.userRoleId
                };
            });

        return [].concat(dataGroupRoles).concat(actionRoles);
    }

    function combineSelectedUserRolesWithExisting(userToEdit, user, dataGroups, actions) {
        var selectedUserRoles = getUserRolesForUser(user, dataGroups, actions);
        var availableUserRoleIds = getAvailableUserRoles(dataGroups, actions).map(pick('id'));
        var currentUserRoles = (userToEdit.userCredentials && userToEdit.userCredentials.userRoles) || [];
        var userRoleBasis = currentUserRoles.filter(function (userRole) {
            return availableUserRoleIds.indexOf(userRole.id) === -1;
        });

        return [].concat(userRoleBasis).concat(selectedUserRoles);
    }

    /**********
     * Array functions
     */
    //TODO: Move this out to utils
    function has(property) {
        return function (item) {
            if (item && item[property]) {
                return true;
            }
            return false;
        };
    }

    function pick(property) {
        var properties = Array.prototype.filter.apply(arguments, [angular.isString]);

        if (properties.length === 1 && angular.isString(property)) {
            return function (item) {
                return item[property];
            };
        }

        return function (item) {
            var result = {};
            Object.keys(item).map(function (key) {
                if (properties.indexOf(key) >= 0) {
                    result[key] = item[key];
                }
            });
            return result;
        };
    }

    function flatten() {
        return function (current, items) {
            return (current || []).concat(items);
        };
    }

}
