angular.module('PEPFAR.usermanagement').factory('agenciesService', agenciesService);

function agenciesService(schemaService, $q, Restangular, errorHandler, _) {

    return {
        getAgencies: getAgenciesForOrganisationUnit
    };

    function getAgenciesForOrganisationUnit(organisationUnit) {
        if (!(organisationUnit && organisationUnit.name)) {
            return $q.reject('No organisation unit found');
        }

        return matchUserGroupsWithAgencies(organisationUnit).catch(errorHandler.debug);
    }

    function matchUserGroupsWithAgencies(organisationUnit) {
        var organisationUnitName = organisationUnit.name;

        return $q.all([
                schemaService.store.get('Agencies'),
                schemaService.store.get('Agency User Groups', organisationUnit)
            ])
            .then(function (responses) {
                var agencyDimensionResponse = Array.isArray(responses[0]) ? responses[0] : [];
                var userGroups = Array.isArray(responses[1]) ? responses[1] : [];
                var agencies = matchAgenciesWithUserGroups(agencyDimensionResponse, userGroups, organisationUnitName);

                if (agencies && agencies.length > 0) {
                    errorHandler.debug(
                        errorHandler.message(['Found', agencies.length, 'agencies for which you can also access the required user groups.']),
                        agencies
                    );

                    return agencies;
                }

                return $q.reject(['No agencies found in', organisationUnitName, 'that you can access all mechanisms for'].join(' '));
            });
    }

    function matchAgenciesWithUserGroups(agencies, userGroups, organisationUnitName) {
        return agencies.map(addUserGroups(userGroups, organisationUnitName))
            .filter(agencyWithMechanismsAndUserUserGroups);
    }

    function agencyWithMechanismsAndUserUserGroups(agency) {
        return angular.isObject(agency.mechUserGroup) && agency.mechUserGroup !== null &&
            angular.isObject(agency.userUserGroup) && agency.userUserGroup;
    }

    function addUserGroups(userGroups, organisationUnitName) {
        var mechUserGroupRegex;
        var userUserGroupRegex;
        var userAdminUserGroupRegex;

        return function (agency) {
            mechUserGroupRegex = userGroupRegExp(organisationUnitName, agency, 'all mechanisms');
            userUserGroupRegex = userGroupRegExp(organisationUnitName, agency, 'users');
            userAdminUserGroupRegex = userGroupRegExp(organisationUnitName, agency, 'user administrators');

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

    function userGroupRegExp(organisationUnitName, agency, suffix) {
        return new RegExp(['^OU', organisationUnitName, underscoreToSpace(agency.code), [suffix, '$'].join('')].join(' '));
    }

    function underscoreToSpace(code) {
        var agencyCodeRegExp = new RegExp('^Agency_', '');

        return (code || '').replace(agencyCodeRegExp, 'Agency ');
    }
}
