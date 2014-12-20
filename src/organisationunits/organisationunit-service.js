angular.module('PEPFAR.usermanagement').factory('organisationUnitService', organisationUnitService);

function organisationUnitService(Restangular, _) {
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
            })
            .then(function (organisationUnits) {
                return _.sortBy(organisationUnits, 'name');
            });
    }
}
