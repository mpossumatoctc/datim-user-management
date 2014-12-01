angular.module('PEPFAR.usermanagement').factory('agenciesService', agenciesService);

function agenciesService($q, currentUserService, Restangular, errorHandler) {

    return {
        getAgencies: getAgencies
    };

    function getAgencies() {
        return currentUserService.getCurrentUser().then(function (user) {
            var organisationUnitName;

            if (!(user.organisationUnits && user.organisationUnits[0] && user.organisationUnits[0].name)) {
                return $q.reject('No organisation unit found on the current user');
            }
            organisationUnitName = user.organisationUnits[0].name;

            return $q.all([getAgencyObjects(), getUserGroups(organisationUnitName)])
                .then(function (responses) {
                    var agencyDimensionResponse = Array.isArray(responses[0]) ? responses[0] : [];
                    var userGroups = Array.isArray(responses[1]) ? responses[1] : [];

                    var agencies = matchAgenciesWithUserGroups(agencyDimensionResponse, userGroups, organisationUnitName);
                    if (!agencies || agencies.length === 0) {

                        return $q.reject(['No agencies found in', organisationUnitName, 'that you can access all mechanisms for'].join(' '));
                    }

                    errorHandler.debug(
                        errorHandler.message(['Found', agencies.length, 'agencies for which you can also access the required user groups.']),
                        agencies
                    );

                    return agencies;
                });
        }).catch(errorHandler.debug);
    }

    function getAgencyObjects() {
        var queryParams = {
            paging: 'false'
        };

        //categoryOptionGroupSets.json?fields=id&filter=name:eq:Funding%20Agency&paging=false
        return Restangular
            .one('categoryOptionGroupSets').withHttpConfig({cache: true})
            .get({
                fields: 'id',
                filter: 'name:eq:Funding Agency',
                paging: false
            })
            .then(function (response) {
                var categoryOptionGroupSets = response.categoryOptionGroupSets || [];

                if (categoryOptionGroupSets.length !== 1) {
                    return $q.reject('None or more than one categoryOptionGroupSets found that match "Funding Agency"');
                }

                return Restangular
                    .all('dimensions').withHttpConfig({cache: true})
                    .all(categoryOptionGroupSets[0].id)
                    .get('items', queryParams)
                    .then(function (response) {
                        errorHandler.debug(errorHandler.message(['Found', (response.items && response.items.length) || 0, 'agencies that you can access']));

                        return response.items;
                    });
            });
    }

    function getUserGroups(organisationUnitName) {
        var queryParams;

        queryParams = {
            fields: 'id,name',
            filter: [
                ['name', 'like', [organisationUnitName.trim(), 'Agency'].join(' ')].join(':')
            ],
            paging: false
        };

        return Restangular.one('userGroups').withHttpConfig({cache: true})
            .get(queryParams)
            .then(function (userGroups) {

                errorHandler.debug(
                    errorHandler.message(['Found ', userGroups.userGroups.length, 'usergroups whos name contains', '"', [organisationUnitName.trim(), 'Agency'].join(' '), '"']),
                    userGroups.userGroups
                );

                return userGroups.userGroups;
            });
    }

    function matchAgenciesWithUserGroups(agencies, userGroups, organisationUnitName) {
        return agencies.map(addUserGroups(userGroups, organisationUnitName))
            .filter(function (agency) {
                return angular.isObject(agency.mechUserGroup) && agency.mechUserGroup !== null &&
                    angular.isObject(agency.userUserGroup) && agency.userUserGroup;
            });
    }

    function addUserGroups(userGroups, organisationUnitName) {
        var mechUserGroupRegex;
        var userUserGroupRegex;
        var userAdminUserGroupRegex;

        return function (agency) {
            mechUserGroupRegex = new RegExp(['^OU', organisationUnitName, 'Agency', agency.name, 'all mechanisms$'].join(' '));
            userUserGroupRegex = new RegExp(['^OU', organisationUnitName, 'Agency', agency.name, 'users$'].join(' '));
            userAdminUserGroupRegex = new RegExp(['^OU', organisationUnitName, 'Agency', agency.name, 'user administrators$'].join(' '));

            userGroups.reduce(function (current, userGroup) {
                if (mechUserGroupRegex.test(userGroup.name)) {
                    agency.mechUserGroup = userGroup;
                    return agency;
                }
                if (userUserGroupRegex.test(userGroup.name)) {
                    agency.userUserGroup = userGroup;
                    return agency;
                }
                if (userAdminUserGroupRegex.test(userGroup.name)) {
                    agency.userAdminUserGroup =  userGroup;
                    return agency;
                }
                return agency;
            }, agency);

            return agency;
        };
    }
}
