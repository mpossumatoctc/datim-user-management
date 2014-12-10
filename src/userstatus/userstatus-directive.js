angular.module('PEPFAR.usermanagement').directive('userStatus', userStatusDirective);

function userStatusDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            user: '='
        },
        templateUrl: 'userstatus/userstatus.html',
        link: linkFn
    };

    function linkFn() {

    }
}
