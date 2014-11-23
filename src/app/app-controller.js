angular.module('PEPFAR.usermanagement').controller('appController', appController);

function appController($scope, Restangular, webappManifest) {
    var vm = this;

    vm.title = 'User management';
    vm.isLoading = false;
    vm.headerBar = {
        title: '',
        logo: '',
        link: ''
    };

    initialise();

    $scope.$on('$stateChangeStart', function () {
        vm.isLoading = true;
    });
    $scope.$on('$stateChangeSuccess', function () {
        vm.isLoading = false;
    });
    $scope.$on('$stateChangeError', function () {
        vm.isLoading = false;
    });

    function initialise() {
        Restangular.one('systemSettings')
            .get()
            .then(function (systemSettings) {
                var baseUrl = webappManifest.activities.dhis.href;

                if (systemSettings.keyCustomTopMenuLogo === true) {
                    vm.headerBar.logo = [
                        baseUrl,
                        '/external-static/logo_banner.png'
                    ].join('');
                }
                vm.headerBar.title = systemSettings.applicationTitle || '';
                vm.headerBar.link = [baseUrl, systemSettings.startModule, 'index.action'].join('/');
            });
    }
}
