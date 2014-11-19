angular.module('PEPFAR.usermanagement').controller('appController', appController);

function appController($scope) {
    var vm = this;

    vm.title = 'User management';
    vm.isLoading = false;

    $scope.$on('$stateChangeStart', function () {
        vm.isLoading = true;
    });
    $scope.$on('$stateChangeSuccess', function () {
        vm.isLoading = false;
    });
    $scope.$on('$stateChangeError', function () {
        vm.isLoading = false;
    });
}
