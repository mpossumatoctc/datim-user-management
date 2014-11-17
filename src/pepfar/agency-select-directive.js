angular.module('PEPFAR.usermanagement').directive('agencySelect', agencySelectDirective);

function agencySelectDirective(agenciesService, $translate) {
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

            agenciesService.getAgencies().then(function (agencies) {
                scope.selectbox.items = agencies;
            });
        }
    };
}
