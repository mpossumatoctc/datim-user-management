angular.module('PEPFAR.usermanagement').controller('noAccessController', noAccessController);

function noAccessController($stateParams) {
    var vm = this;
    vm.message = $stateParams.message || 'Your user account does not seem to have the right permissions to access this functionality.';
}
