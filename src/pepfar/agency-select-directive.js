angular.module('PEPFAR.usermanagement').directive('agencySelect', agencySelectDirective);

function agencySelectDirective(agenciesService, $translate, errorHandler) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'pepfar/agencypartner-select.html',
        link: function (scope) {
            scope.selectbox = {
                items: [],
                placeholder: $translate.instant('Select an agency')
            };

            loadValues(scope.userOrgUnit && scope.userOrgUnit.current);

            scope.$on('ORGUNITCHANGED', function (event, data) {
                console.log('Reloading types for ', data.name); //jshint ignore:line
                loadValues(data);
            });

            function loadValues(orgUnit) {
                orgUnit = orgUnit || {};

                errorHandler.debug('Loading agencies for: ', orgUnit.name);
                agenciesService.getAgencies(orgUnit).then(function (agencies) {
                    scope.selectbox.items = agencies;
                });
            }
        }
    };
}
