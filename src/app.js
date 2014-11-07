function translateConfig($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
}

function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');

    $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'userlist/list.html',
            controller: 'userListController as userList'
        })
        .state('add', {
            url: '/add',
            templateUrl: 'adduser/add.html',
            controller: 'addUserController as addUser'
        });
}

angular.module('PEPFAR.usermanagement', [
    'ui.router',
    'restangular',
    'pascalprecht.translate',
    'ui.select',
    'ui.bootstrap'
]);

angular.module('PEPFAR.usermanagement').config(translateConfig);
angular.module('PEPFAR.usermanagement').config(routerConfig);

window.getBootstrapper('PEPFAR.usermanagement', document)
    .addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp')
    .bootstrap();
