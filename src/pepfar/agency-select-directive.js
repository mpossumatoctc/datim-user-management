function agencySelectDirective(agenciesService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'pepfar/agencypartner-select.html',
        link: function (scope) {
            scope.selectbox = {
                items: [],
                placeholder: 'Select agency'
            };

            agenciesService.getAgencies().then(function (agencies) {
                scope.selectbox.items = agencies;
            });
        }
    };
}

angular.module('PEPFAR.usermanagement').directive('agencySelect', agencySelectDirective);
