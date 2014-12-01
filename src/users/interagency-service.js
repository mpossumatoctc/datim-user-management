angular.module('PEPFAR.usermanagement').factory('interAgencyService', interAgencyService);

function interAgencyService($q, Restangular, currentUserService, errorHandler) {
    var userGroupEndPoint = Restangular.one('userGroups').withHttpConfig({cache: true});

    return {
        getUserGroups: getUserGroups
    };

    function getUserGroups() {
        return currentUserService.getCurrentUser()
            .then(function (user) {
                var organisationUnitName;
                if (!(user.organisationUnits && user.organisationUnits[0] && user.organisationUnits[0].name)) {
                    return $q.reject('No organisation unit found on the current user');
                }
                organisationUnitName = user.organisationUnits[0].name;

                return $q.all([
                    getUserUserGroup(organisationUnitName),
                    getAdminUserGroup(organisationUnitName),
                    getMechUserGroup(organisationUnitName)
                ]).then(function (responses) {

                    errorHandler.debug(
                        'The following inter-agency user groups were found:',
                        'for users:', responses[0],
                        'for usermanagement:', responses[1],
                        'for mechanisms:', responses[2]
                    );

                    return {
                        userUserGroup: responses[0],
                        userAdminUserGroup: responses[1],
                        mechUserGroup: responses[2]
                    };
                }, errorHandler.errorFn('Unable to load all the inter agency user groups'));
            });

    }

    function getUserUserGroup(organisationUnitName) {
        var filter = ['name', 'like', ['OU', organisationUnitName, 'Country', 'team'].join(' ')].join(':');
        var filterRegEx = new RegExp(['OU', '.+?', 'Country', 'team'].join(' '), 'i');

        return requestUserGroups(filter)
            .then(function (userGroups) {
                return filterGroupsOnName(userGroups, filterRegEx);
            });
    }

    function getAdminUserGroup(organisationUnitName) {
        var filter = ['name', 'like', ['OU', organisationUnitName, 'user', 'administrators'].join(' ')].join(':');
        var filterRegEx = new RegExp(['OU', '.+?', 'user', 'administrators'].join(' '), 'i');

        return requestUserGroups(filter)
            .then(function (userGroups) {
                return filterGroupsOnName(userGroups, filterRegEx);
            });
    }

    function getMechUserGroup(organisationUnitName) {
        var filter = ['name', 'like', ['OU', organisationUnitName, 'all', 'mechanisms'].join(' ')].join(':');
        var filterRegEx = new RegExp(['OU', '.+?', 'all', 'mechanisms'].join(' '), 'i');

        return requestUserGroups(filter)
            .then(function (userGroups) {
                return filterGroupsOnName(userGroups, filterRegEx);
            });
    }

    function requestUserGroups(filter) {
        return userGroupEndPoint
            .get({
                fields: 'id,name',
                filter: filter,
                paging: false
            });
    }

    function filterGroupsOnName(userGroups, filterRegEx) {
        userGroups = userGroups.userGroups || [];

        return userGroups.reduce(function (current, userGroup) {
            if (filterRegEx.test(userGroup.name)) {
                return userGroup;
            }
            return current;
        }, undefined);
    }
}
