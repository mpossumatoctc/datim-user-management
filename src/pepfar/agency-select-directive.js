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

            errorHandler.debug('Loading agencies for: ', scope.activeOrgUnit && scope.activeOrgUnit.name);
            agenciesService.getAgencies(scope.activeOrgUnit || {}).then(function (agencies) {
                scope.selectbox.items = agencies;
            });
        }
    };
}
