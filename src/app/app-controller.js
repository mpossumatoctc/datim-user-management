function appController() {
    this.title = 'User management';
}

function translateConfig($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
}

angular.module('PEPFAR.usermanagement', [
    'ng',
    'ui.router',
    'restangular',
    'pascalprecht.translate',
    'ui.select',
    'ui.bootstrap'
]);

angular.module('PEPFAR.usermanagement').controller('appController', appController);
angular.module('PEPFAR.usermanagement').config(translateConfig);
