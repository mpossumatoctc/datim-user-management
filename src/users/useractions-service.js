angular.module('PEPFAR.usermanagement').factory('userActionsService', userActionsService);

function userActionsService(Restangular, $q, userTypesService, dataGroupsService, errorHandler) {
    var availableAgencyActions = [
        'Accept data', 'Submit data', 'Manage users'
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

    initialise();
    return {
        actions: actions,
        getActionsForUserType: getActionsForUserType,
        getActionsForUser: getActionsForUser
    };

    function initialise() {
        Restangular.one('userRoles').withHttpConfig({cache: true}).get({
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

    function pick(property) {
        return function (object) {
            return object[property];
        };
    }
}
