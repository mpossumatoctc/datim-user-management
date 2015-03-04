/* globals has, pick, flatten */
angular.module('PEPFAR.usermanagement').factory('userActionsService', userActionsService);

function userActionsService(Restangular, $q, userTypesService, userService,
                            currentUserService, errorHandler) {
    var availableAgencyActions = [
        'Accept data', 'Submit data'
    ];
    var availableInterAgencyActions = [
        'Accept data', 'Submit data'
    ];
    var availablePartnerActions =  [
        'Submit data'
    ];

    /**
     * The actions will be parsed when the userRoles are loaded from the api and a userRoleId property will be added/filled with the uid for that userRole
     */
    var actions = [
        {name: 'Accept data', userRole: 'Data Accepter', userRoleId: undefined},
        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: undefined},
        {name: 'Manage users', userRole: 'User Administrator', userRoleId: undefined, userGroupRestriction: true},
        {name: 'Read data', userRole: 'Read Only', userRoleId: undefined, default: true}
    ];

    /**
     * The dataEntryRestrictions will be parsed when the userRoles are loaded from the api and a userRoleId property will be added/filled with the uid for that userRole
     */
    var dataEntryRestrictions = {
        'Inter-Agency': {
            SI: [
                {userRole: 'Data Entry SI Country Team', userRoleId: undefined},
                {userRole: 'Tracker', userRoleId: undefined},
                {userRole: 'Data Deduplication', userRoleId: undefined}
            ]/*,
            EVAL: [{
                    userRole: 'Data Entry EVAL'
                }]*/
        },
        Agency: {
            SIMS: [
                {userRole: 'Data Entry SIMS', userRoleId: undefined},
                {userRole: 'Data Entry SIMS Key Pops', userRoleId: undefined}
            ]
        },
        Partner: {
            SI: [
                {userRole: 'Data Entry SI', userRoleId: undefined}
            ],
            EA: [
                {userRole: 'Data Entry EA', userRoleId: undefined}
            ]
        }
    };

    /**
     * The dataEntryRestrictionsUserManager structure will be parsed when the userRoles are loaded from the api and a userRoleId property will be added/filled with the uid for that userRole
     */
    var dataEntryRestrictionsUserManager = {
        'Inter-Agency': {
            SI: [
                {userRole: 'Data Entry SI Country Team', userRoleId: undefined},
                {userRole: 'Tracker', userRoleId: undefined},
                {userRole: 'Data Deduplication', userRoleId: undefined},
                {userRole: 'Data Entry SI', userRoleId: undefined}
            ],
            SIMS: [
                {userRole: 'Data Entry SIMS', userRoleId: undefined},
                {userRole: 'Data Entry SIMS Key Pops', userRoleId: undefined}
            ],
            EA: [
                {userRole: 'Data Entry EA', userRoleId: undefined}
            ]/*,
             EVAL: [{
             userRole: 'Data Entry EVAL'
             }]*/
        },
        Agency: {
            SI: [
                {userRole: 'Data Entry SI', userRoleId: undefined}
            ],
            SIMS: [
                {userRole: 'Data Entry SIMS', userRoleId: undefined},
                {userRole: 'Data Entry SIMS Key Pops', userRoleId: undefined}
            ],
            EA: [
                {userRole: 'Data Entry EA', userRoleId: undefined}
            ]
        },
        Partner: {
            SI: [
                {userRole: 'Data Entry SI', userRoleId: undefined}
            ],
            EA: [
                {userRole: 'Data Entry EA', userRoleId: undefined}
            ]
        }
    };

    var actionRolesLoaded;

    var currentUser;
    var currentUserUserRoles;

    initialise();
    return {
        getActions: getActions
    };

    function initialise() {
        actionRolesLoaded = Restangular.one('userRoles').withHttpConfig({cache: true}).get({
            fields: 'id,name',
            paging: false
        }).then(function (response) {
            var userRoles = response.userRoles;

            actions.forEach(function (action) {
                action.userRoleId = userRoles.reduce(function (current, value) {
                    if (value.name === action.userRole) {
                        return value.id;
                    }
                    return current;
                }, action.userRoleId);
            });

            addUserRolesForDataEntry(userRoles);

        }, errorHandler.errorFn('Failed to load user roles for actions'));
    }

    function getActions() {
        return $q.all([actionRolesLoaded, currentUserService.getCurrentUser()])
            .then(function (responses) {
                currentUser = responses[1];
                currentUserUserRoles = (currentUser && currentUser.userCredentials.userRoles) || [];
                actions = actions;

                return {
                    actions: actions,
                    dataEntryRestrictions: dataEntryRestrictions,
                    dataEntryRestrictionsUserManager: dataEntryRestrictionsUserManager,
                    getDataEntryRestrictionDataGroups: getDataEntryRestrictionDataGroups,
                    getActionsForUserType: getActionsForUserType,
                    getActionsForUser: getActionsForUser,
                    getUserRolesForUser: getUserRolesForUser,
                    combineSelectedUserRolesWithExisting: combineSelectedUserRolesWithExisting,
                    filterActionsForCurrentUser: filterActionsForCurrentUser
                };
            });
    }

    function filterActionsForCurrentUser(actions) {
        if (currentUser.hasAllAuthority()) {
            return actions;
        }

        return _.filter(actions, function (action) {
            return _.filter(currentUserUserRoles, function (userRole) {
                return action.userRoleId === userRole.id;
            }).length;
        });
    }

    function addUserRolesForDataEntry(userRoles) {
        Object.keys(dataEntryRestrictions).forEach(function (userType) {
            Object.keys(dataEntryRestrictions[userType]).forEach(matchUserRolesWithDataGroups(userRoles, userType, dataEntryRestrictions));
        });

        Object.keys(dataEntryRestrictionsUserManager).forEach(function (userType) {
            Object.keys(dataEntryRestrictionsUserManager[userType]).forEach(matchUserRolesWithDataGroups(userRoles, userType, dataEntryRestrictionsUserManager));
        });

        function matchUserRolesWithDataGroups(userRoles, userType, dataEntryRestrictions) {
            return function (dataStream) {
                userRoles.forEach(function (userRole) {
                    var dataStreamRoleList = dataEntryRestrictions[userType][dataStream];

                    dataStreamRoleList.forEach(function (dataStreamRole) {
                        if (userRole && userRole.name === dataStreamRole.userRole) {
                            dataStreamRole.userRoleId = userRole.id;
                        }
                    });
                });
            };
        }
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
            return action.userRoleId && ((availableActions.indexOf(action.name) >= 0) || action.default);
        });
    }

    function getActionsForUser(user) {
        var actions = getActionsForUserType(userTypesService.getUserType(user));
        var userRoles = (user && user.userCredentials && user.userCredentials.userRoles) || [];
        var userRoleIds = userRoles.map(pick('id'));

        return actionRolesLoaded.then(function () {
            actions.forEach(function (action) {
                action.hasAction = hasUserRoleFor(userRoleIds, action);
            });
            return $q.when(actions);
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

        dataGroupsWithEntry = userService.getSelectedDataGroups(user, dataGroups)
            .filter(function (dataGroup) {
                return user.dataGroups && user.dataGroups[dataGroup.name] && user.dataGroups[dataGroup.name].entry === true;
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

    function getDataEntryRestrictionDataGroups(userType) {
        var userTypeToCheck = getPreferredNameFormat(userType);
        if (!userTypeToCheck || !dataEntryRestrictions[userTypeToCheck]) { return []; }

        return Object.keys(dataEntryRestrictions[userTypeToCheck]);
    }

    function getPreferredNameFormat(userType) {
        if (!angular.isString(userType)) { return ''; }

        return userType.split('-').map(function (namePart) {
            return namePart.charAt(0).toUpperCase() + namePart.substr(1).toLowerCase();
        }).join('-');
    }
}
