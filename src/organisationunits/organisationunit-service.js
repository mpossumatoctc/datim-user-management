angular.module('PEPFAR.usermanagement').factory('organisationUnitService', organisationUnitService);

function organisationUnitService(Restangular) {
    return {
        getOrganisationUnitsForLevel: getOrganisationUnitsForLevel
    };

    function getOrganisationUnitsForLevel(level) {
        return Restangular
            .one('organisationUnits').withHttpConfig({cache: true})
            .get({
                level: level || 1
            })
            .then(function (response) {
                return response.organisationUnits || [];
            });
    }
}
