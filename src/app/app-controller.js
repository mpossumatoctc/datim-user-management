angular.module('PEPFAR.usermanagement').controller('appController', appController);

function appController($scope, Restangular, webappManifest, errorHandler) {
    var vm = this;

    vm.title = 'User management';
    vm.subTitle = '';
    vm.isLoading = false;
    vm.headerBar = {
        title: '',
        logo: '',
        link: ''
    };

    vm.subTitles = {
        add: 'Invite user',
        list: 'Manage users',
        edit: 'Edit user'
    };

    initialise();

    $scope.$on('$stateChangeStart', function () {
        vm.isLoading = true;
    });
    $scope.$on('$stateChangeSuccess', function (event, toState) {
        vm.isLoading = false;
        vm.currentState = toState.name;
        vm.subTitle = vm.subTitles[toState.name] || '';
    });
    $scope.$on('$stateChangeError', function (event, toState) {
        errorHandler.debug(['Failed to switch to ', toState].join(' '));
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
