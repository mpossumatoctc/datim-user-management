angular.module('PEPFAR.usermanagement').directive('partnerSelect', partnerSelectDirective);

function partnerSelectDirective(partnersService, $translate, errorHandler) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            orgUnit: '='
        },
        templateUrl: 'pepfar/agencypartner-select.html',
        link: function (scope) {
            scope.selectbox = {};
            scope.selectbox.placeholder = $translate.instant('Select a partner');
            scope.selectbox.items = [];

            errorHandler.debug('Loading partners for: ', scope.orgUnit && scope.orgUnit.name);
            partnersService.getPartners(scope.orgUnit || {}).then(function (partners) {
                scope.selectbox.items = partners;
            });
        }
    };
}
