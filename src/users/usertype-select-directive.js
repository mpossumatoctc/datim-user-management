angular.module('PEPFAR.usermanagement').directive('selectUsertype', userTypeSelectDirective);

function userTypeSelectDirective() {
    var directive = {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            userTypes: '='
        },
        templateUrl: 'users/selectusertype.html',
        link: linkFn
    };

    return directive;

    function linkFn(scope, element, attrs, ngModel) {
        scope.selectbox = {
            placeholder: 'Select user type',
            items: scope.userTypes
        };

        scope.onChange = function ($item) {
            ngModel.$setViewValue($item.name);
        };
    }
}
