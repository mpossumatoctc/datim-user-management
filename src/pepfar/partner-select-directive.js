function partnerSelectDirective(partnersService, $translate) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'pepfar/agencypartner-select.html',
        link: function (scope) {
            scope.selectbox = {};
            scope.selectbox.placeholder = $translate.instant('Select a partner');
            scope.selectbox.items = [];

            partnersService.getPartners().then(function (partners) {
                scope.selectbox.items = partners;
            });
        }
    };
}

angular.module('PEPFAR.usermanagement').directive('partnerSelect', partnerSelectDirective);
