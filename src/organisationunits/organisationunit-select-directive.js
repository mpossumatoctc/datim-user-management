angular.module('PEPFAR.usermanagement').directive('organisationUnitSelect', organisationUnitSelectDirective);

function organisationUnitSelectDirective(organisationUnitService, $translate, errorHandler) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'organisationunits/organisation-select.html',
        link: function (scope) {
            scope.selectbox = {
                items: [],
                placeholder: $translate.instant('Select an organisation unit')
            };

            errorHandler.debug('Loading organisation units for level: 3');
            organisationUnitService.getOrganisationUnitsForLevel(3)
                .then(function (organisationUnits) {
                    scope.selectbox.items = organisationUnits;
                });
        }
    };
}
