angular.module('PEPFAR.usermanagement').directive('selectUsertype', userTypeSelectDirective);

function userTypeSelectDirective(agenciesService, schemaService, errorHandler) {
    var directive = {
        restrict: 'E',
        replace: true,
        scope: {
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

        //TODO: Should not use parent $scope hack..
        loadValues(scope.$parent && scope.$parent.userOrgUnit && scope.$parent.userOrgUnit.current);

        scope.$on('ORGUNITCHANGED', function (event, data) {
            errorHandler.debug('Reloading types for ', data.name); //jshint ignore:line
            loadValues(data);
            scope.selectbox.selected = undefined;
            scope.user.userType = undefined;
        });

        function loadValues(orgUnit) {
            scope.selectbox.items = [];

            schemaService.store.get('Interagency Groups', orgUnit).then(function (interAgency) {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Inter-Agency' &&
                        (interAgency.userUserGroup || interAgency.userUserGroup)) {
                        scope.selectbox.items.push(item);
                    }
                });
            });

            // TODO: This looks like a bug?  getAgencies but do nothing with them?
            agenciesService.getAgencies(orgUnit).then(function () {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Agency') {
                        scope.selectbox.items.push(item);
                    }
                });
            });

            // TODO: This looks like a bug?  getPartners but do nothing with them?
            schemaService.store.get('Partners in Organisation', orgUnit).then(function () {
                scope.userTypes.forEach(function (item) {
                    if (item.name === 'Partner') {
                        scope.selectbox.items.push(item);
                    }
                });
            });
        }
    }
}
