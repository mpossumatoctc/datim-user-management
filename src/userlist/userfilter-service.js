angular.module('PEPFAR.usermanagement').service('userFilterService', userFilterService);

function userFilterService($q, userTypesService, organisationUnitService) {
    var deferred = $q.defer();
    var userFilter = [
        {name: 'Name'},
        {name: 'Username'},
        {name: 'E-Mail'},
        {name: 'Roles'},
        {name: 'User Groups'}
    ];

    deferred.resolve(userFilter);

    initialise();
    return {
        getUserFilter: getUserFilter
    };

    function initialise() {
        organisationUnitService.getOrganisationUnitsForLevel(3)
            .then(function (organisationUnits) {
                userFilter.push({name: 'Organisation Unit', secondary: organisationUnits});
            });

        userTypesService.getUserTypes()
            .then(function (userTypes) {
                userFilter.push({name: 'Types', secondary: userTypes});
            });
    }

    function getUserFilter() {
        return deferred.promise;
    }
}
