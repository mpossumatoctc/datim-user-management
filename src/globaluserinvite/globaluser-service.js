angular.module('PEPFAR.usermanagement').factory('globalUserService', globalUserService);

function globalUserService($q, Restangular, errorHandler) {
    var userGroupEndPoint = Restangular.one('userGroups').withHttpConfig({cache: true});

    return {
        getUserGroups: getUserGroups
    };

    function getUserGroups() {
        return $q.all([
            getUserUserGroup(),
            getAdminUserGroup(),
            getMechUserGroup()
        ]).then(function (responses) {

            errorHandler.debug(
                'The following global user groups were found:',
                'for users:', responses[0],
                'for usermanagement:', responses[1],
                'for mechanisms:', responses[2]
            );

            return {
                userUserGroup: responses[0],
                userAdminUserGroup: responses[1],
                mechUserGroup: responses[2]
            };
        }, errorHandler.errorFn('Unable to load all the global user groups'));
    }

    function getUserUserGroup() {
        var filter = ['name', 'like', 'Global Users'].join(':');
        var filterRegEx = new RegExp(['Global Users'].join(' '), 'i');

        return requestUserGroups(filter)
            .then(function (userGroups) {
                return filterGroupsOnName(userGroups, filterRegEx);
            });
    }

    function getAdminUserGroup() {
        var filter = ['name', 'like', 'Global User Administrators'].join(':');
        var filterRegEx = new RegExp(['Global User Administrators'].join(' '), 'i');

        return requestUserGroups(filter)
            .then(function (userGroups) {
                return filterGroupsOnName(userGroups, filterRegEx);
            });
    }

    function getMechUserGroup() {
        var filter = ['name', 'like', 'Global all mechanisms'].join(':');
        var filterRegEx = new RegExp(['Global all mechanisms'].join(' '), 'i');

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
