angular.module('PEPFAR.usermanagement').factory('agenciesService', agenciesService);

function agenciesService($q, currentUserService, Restangular, errorHandler) {

    return {
        getAgencies: getAgencies
    };

    function getAgencies() {
        return currentUserService.getCurrentUser().then(function (user) {
            var organisationUnitName;

            if (!(user.organisationUnits && user.organisationUnits[0] && user.organisationUnits[0].name)) {
                return [];
            }
            organisationUnitName = user.organisationUnits[0].name;

            return $q.all([getAgencyObjects(), getUserGroups(organisationUnitName)])
                .then(function (responses) {
                    var agencyDimensionResponse = Array.isArray(responses[0]) ? responses[0] : [];
                    var userGroups = Array.isArray(responses[1]) ? responses[1] : [];

                    var agencies = matchAgenciesWithUserGroups(agencyDimensionResponse, userGroups, organisationUnitName);
                    if (!agencies || agencies.length === 0) {
                        return $q.reject([
                            'No agencies found matching available usergroups to',
                            organisationUnitName,
                            'all mechanisms'].join(' '));
                    }
                    return agencies;
                });
        }).catch(errorHandler.error);
    }

    function getAgencyObjects() {
        var queryParams = {
            paging: 'false'
        };

        return Restangular.all('dimensions')
            .all('bw8KHXzxd9i')
            .get('items', queryParams)
            .then(function (response) {
                //Extract the items from the response
                return response.items;
            });
    }

    function getUserGroups(organisationUnitName) {
        var queryParams;

        queryParams = {
            fields: 'id,name',
            filter: [
                ['name', 'like', organisationUnitName.trim()].join(':'),
                ['name', 'like', 'mechanisms'].join(':')
            ],
            paging: false
        };

        return Restangular.one('userGroups')
            .get(queryParams)
            .then(function (userGroups) {
                return userGroups.userGroups;
            });
    }

    function matchAgenciesWithUserGroups(agencies, userGroups, organisationUnitName) {
        return agencies.map(addUserGroups(userGroups, organisationUnitName))
            .filter(function (agency) {
                return angular.isObject(agency.userGroup) && agency.userGroup !== null;
            });
    }

    function addUserGroups(userGroups, organisationUnitName) {
        var userGroupRegex;
        return function (agency) {
            userGroups.reduce(function (current, userGroup) {
                userGroupRegex = new RegExp(['OU', organisationUnitName, 'Agency', agency.name, 'all mechanisms'].join(' '));
                if (userGroupRegex.test(userGroup.name)) {
                    agency.userGroup = userGroup;
                }
                return agency;
            }, agency);

            return agency;
        };
    }
}
