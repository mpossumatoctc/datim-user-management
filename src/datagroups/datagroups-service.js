/* globals hasAll */
angular.module('PEPFAR.usermanagement').factory('dataGroupsService', dataGroupsService);

function dataGroupsService($q, Restangular, currentUserService, _, errorHandler) {
    var deferred;
    var dataGroups = [
        {name: 'SI'},
        {name: 'EA'},
        {name: 'SIMS'}
    ];
    var userGroupNameConfig = {prefix: 'Data', suffix: 'access'};
    var userRoleNameConfig = {prefix: 'Data Entry'};

    initialise();
    return {
        getDataGroups: getDataGroups,
        getDataGroupsForUser: getDataGroupsForUser,
        getUserGroups: getUserGroups
    };

    function initialise() {
        deferred = $q.all([loadUserGroups(), loadUserRoles(), currentUserService.getCurrentUser()]).then(function (responses) {
            var currentUser = responses[2];
            var currentUserGroups = currentUser.userGroups || [];
            var currentUserGroupIds = currentUserGroups.map(function (userGroup) {
                return userGroup.id;
            });
            var resultingDataStreams;

            resultingDataStreams = dataGroups.filter(function (dataGroup) {
                var userGroups = dataGroup.userGroups || [];
                return currentUser.hasAllAuthority() || userGroups.some(function (userGroup) {
                    return currentUserGroupIds.indexOf(userGroup.id) >= 0;
                });
            });

            errorHandler.debug(
                'Based on the userGroups', responses[0],
                'and user Roles', responses[1],
                'you should have access to', resultingDataStreams
            );

            return resultingDataStreams;
        });
    }

    function loadUserGroups() {
        return Restangular.one('userGroups').withHttpConfig({cache: true}).get({
            fields: ['id', 'name'].join(','),
            filter: 'name:like:Data',
            paging: false
        }).then(function (response) {
            var userGroups = response.userGroups;

            dataGroups.forEach(function (dataGroup) {
                dataGroup.userGroups = getValuesFilteredByName(userGroups,
                    getNameFromConfig(dataGroup.name, userGroupNameConfig));
            });

            return userGroups;
        }, errorHandler.errorFn('Failed to load the usergroups'));
    }

    function loadUserRoles() {
        return Restangular.one('userRoles').withHttpConfig({cache: true}).get({
            fields: ['id', 'name'].join(','),
            filter: getRoleFilters(),
            paging: false
        }).then(function (response) {
            var userRoles = response.userRoles;

            dataGroups.forEach(function (dataGroup) {
                dataGroup.userRoles = getValuesFilteredByName(userRoles,
                    getNameFromConfig(dataGroup.name, userRoleNameConfig));
            });

            return userRoles;
        }, errorHandler.errorFn('Failed to load the userroles'));
    }

    function getValuesFilteredByName(valueArray, filterOn) {
        if (!angular.isArray(valueArray)) {
            return [];
        }

        return valueArray.filter(function (userGroup) {
            return filterOn === userGroup.name;
        });
    }

    function getRoleFilters() {
        return dataGroups.filter(function (dataGroup) {
            return dataGroup && dataGroup.name && typeof dataGroup.name === 'string';
        }).map(function (dataGroup) {
            if (dataGroup.name) {
                return getNameEqualsFilterFor(
                    getNameFromConfig(dataGroup.name, userRoleNameConfig));
            }
        });
    }

    function getNameEqualsFilterFor(name) {
        return [
            'name',
            'eq',
            name
        ].join(':');
    }

    function getNameFromConfig(name, config) {
        return [config.prefix, name, config.suffix].join(' ').trim();
    }

    function getDataGroups() {
        return deferred;
    }

    function getDataGroupsForUser(user) {
        var userGroupIds;
        var userRoleIds;
        if (!(user && user.userGroups && user.userCredentials)) {
            return $q.reject('Invalid user object provided');
        }
        userGroupIds = (user.userGroups || []).map(function (userGroup) {
            return userGroup.id;
        });
        userRoleIds = ((user.userCredentials && user.userCredentials.userRoles) || []).map(function (userRole) {
            return userRole.id;
        });

        return $q.all([loadUserGroups(), loadUserRoles()])
            .then(determineDataAccessByUserGroups(userGroupIds))
            .then(determineDataEntryByUserRoles(userRoleIds));
    }

    function determineDataAccessByUserGroups(userGroupIds) {
        return function () {
            return dataGroups.map(function (dataGroup) {
                if (hasAll(dataGroup.userGroups, userGroupIds)) {
                    dataGroup.access = true;
                } else {
                    dataGroup.access = false;
                }
                return dataGroup;
            });
        };
    }

    function determineDataEntryByUserRoles(userRoleIds) {
        return function () {
            return dataGroups.map(function (dataGroup) {
                //FIXME: Currently checks all roles to determine data entry but this could change
                //if more streams specific roles are added.
                if (hasAll(dataGroup.userRoles, userRoleIds)) {
                    dataGroup.entry = true;
                } else {
                    dataGroup.entry = false;
                }
                return dataGroup;
            });
        };
    }

    function getUserGroups(userToEdit, dataGroups, userStreams) {
        var userGroupIds = _.values(_.pluck(_.flatten(_.pluck(dataGroups, 'userGroups')), 'id'));
        var baseGroups = _.filter(userToEdit.userGroups, function (userGroup) {
            return userGroupIds.indexOf(userGroup.id) === -1;
        });

        dataGroups = dataGroups.map(function (dataGroup) {
            if (userStreams && userStreams[dataGroup.name] && userStreams[dataGroup.name].access) {
                dataGroup.access = true;
            }
            return dataGroup;
        });

        dataGroups = _.filter(dataGroups, function (dataGroup) {
            return (userStreams && dataGroup && userStreams[dataGroup.name] && userStreams[dataGroup.name].access === true);
        });

        var dataUserGroups = _.flatten(_.pluck(_.filter(dataGroups, function (dataGroup) {
            return dataGroup.access === true;
        }), 'userGroups'));

        return [].concat(baseGroups).concat(dataUserGroups);
    }
}
