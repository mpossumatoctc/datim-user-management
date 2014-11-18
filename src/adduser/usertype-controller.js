angular.module('PEPFAR.usermanagement').controller('userTypeController', userTypeController);

function userTypeController($scope) {
    var vm = this;

    //Scope inherited properties
    vm.userTypes = $scope.userTypes;
    vm.user = $scope.user;

    vm.isAgency = isAgency;
    vm.isPartner = isPartner;

    //Reset the userEntity when the userType is changed
    $scope.$watch(function () {
        return $scope.user.userType;
    }, function (newVal) {
        if (newVal) {
            $scope.user.userEntity = undefined;
        }
    });

    function isAgency() {
        return isUserType('Agency');
    }

    function isPartner() {
        return isUserType('Partner');
    }

    function isUserType(userType) {
        if (!angular.isString(userType)) { return false; }

        if ($scope.user && $scope.user.userType && $scope.user.userType.name === userType) {
            return true;
        }
        return false;
    }
}
