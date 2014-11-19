angular.module('PEPFAR.usermanagement').factory('dataGroupsService', dataGroupsService);

function dataGroupsService($q, Restangular, errorHandler) {
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
        getDataGroups: getDataGroups
    };

    function initialise() {
        deferred = $q.all([loadUserGroups(), loadUserRoles()]).then(function () {
            return dataGroups;
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
}
