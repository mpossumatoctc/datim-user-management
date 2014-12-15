angular.module('PEPFAR.usermanagement').directive('selectUsertype', userTypeSelectDirective);

function userTypeSelectDirective(partnersService, agenciesService, interAgencyService) {
    var directive = {
        restrict: 'E',
        replace: true,
        scope: {
            activeOrgUnit: '=',
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

        loadValues(scope.activeOrgUnit);

        scope.$on('ORGUNITCHANGED', function (event, data) {
            console.log('Reloading types for ', data.name); //jshint ignore:line
            loadValues(data);
            scope.selectbox.selected = undefined;
            scope.user.userType = undefined;
        });

        function loadValues(orgUnit) {
            scope.selectbox.items = [];

            interAgencyService.getUserGroups().then(function (interAgency) {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Inter-Agency' &&
                        (interAgency.userUserGroup || interAgency.userUserGroup)) {
                        scope.selectbox.items.push(item);
                    }
                });
            });

            agenciesService.getAgencies(orgUnit).then(function () {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Agency') {
                        scope.selectbox.items.push(item);
                    }
                });
            });

            partnersService.getPartners(orgUnit).then(function () {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Partner') {
                        scope.selectbox.items.push(item);
                    }
                });
            });
        }
    }
}
