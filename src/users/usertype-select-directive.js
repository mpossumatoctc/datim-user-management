angular.module('PEPFAR.usermanagement').directive('selectUsertype', userTypeSelectDirective);

function userTypeSelectDirective(partnersService, agenciesService, interAgencyService) {
    var directive = {
        restrict: 'E',
        replace: true,
        scope: {
            orgUnit: '=',
            userTypes: '=',
            user: '='
        },
        templateUrl: 'users/selectusertype.html',
        link: linkFn
    };

    return directive;

    function linkFn(scope) {
        scope.selectbox = {
            placeholder: 'Select user type',
            items: [],
            selected: scope.userType
        };

        interAgencyService.getUserGroups().then(function (interAgency) {
            scope.userTypes.forEach(function (item) {
                if (item.name === 'Inter-Agency' &&
                    (interAgency.userUserGroup || interAgency.userUserGroup)) {
                    scope.selectbox.items.push(item);
                }
            });
        });

        agenciesService.getAgencies().then(function () {
            scope.userTypes.forEach(function (item) {
                if (item.name === 'Agency') {
                    scope.selectbox.items.push(item);
                }
            });
        });

        partnersService.getPartners(scope.orgUnit || {}).then(function () {
            scope.userTypes.forEach(function (item) {
                if (item.name === 'Partner') {
                    scope.selectbox.items.push(item);
                }
            });
        });
    }
}
