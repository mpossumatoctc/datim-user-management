angular.module('PEPFAR.usermanagement').controller('userTypeController', userTypeController);

function userTypeController($scope, _) {
    var vm = this;

    vm.userTypes = $scope.userTypes;
    vm.currentUserType = '';
    vm.isAgency = isAgency;
    vm.isPartner = isPartner;
    vm.setUserType = setUserType;
    vm.setUserEntity = setUserEntity;

    function isAgency() {
        return isUserType('Agency');
    }

    function isPartner() {
        return isUserType('Partner');
    }

    function isUserType(userType) {
        if (!angular.isString(userType)) { return false; }

        if (vm.currentUserType === userType) {
            return true;
        }
        return false;
    }

    function setUserType(userType) {
        if (_.find(vm.userTypes, {name: userType})) {
            vm.currentUserType = userType;
        }
    }

    function setUserEntity() {

    }
}
