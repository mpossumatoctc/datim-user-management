angular.module('PEPFAR.usermanagement').directive('partnerSelect', partnerSelectDirective);

function partnerSelectDirective(partnersService, $translate, errorHandler) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'pepfar/agencypartner-select.html',
        link: function (scope) {
            scope.selectbox = {
                items: [],
                placeholder: $translate.instant('Select a partner')
            };

            errorHandler.debug('Loading partners for: ', scope.activeOrgUnit && scope.activeOrgUnit.name);
            partnersService.getPartners(scope.activeOrgUnit || {}).then(function (partners) {
                scope.selectbox.items = partners;
            });
        }
    };
}
