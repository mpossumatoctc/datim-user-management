window.PEPFARUSERMANAGEMENT = {
    debug: true
};

//==================================================================================
// Config functions
//
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
            controller: 'userListController as userList',
            resolve: {
                userFilter: function (userFilterService) {
                    return userFilterService.getUserFilter();
                },
                currentUser: function (currentUserService) {
                    return currentUserService.getCurrentUser();
                },
                userActions: function (userActionsService) {
                    return userActionsService.getActions();
                },
                dataGroups: function (dataGroupsService) {
                    return dataGroupsService.getDataGroups();
                }
            }
        })
        .state('add', {
            url: '/add',
            templateUrl: 'adduser/add.html',
            controller: 'addUserController as addUser',
            resolve: {
                userTypes: function (userTypesService) {
                    return userTypesService.getUserTypes();
                },
                userActions: function (userActionsService) {
                    return userActionsService.getActions();
                },
                dataGroups: function (dataGroupsService) {
                    return dataGroupsService.getDataGroups();
                },
                currentUser: function (currentUserService) {
                    return currentUserService.getCurrentUser();
                },
                dimensionConstraint: function (categoriesService) {
                    return categoriesService.getDimensionConstraint();
                }
            }
        })
        .state('edit', {
            url: '/edit/{userId}/{username}',
            templateUrl: 'edituser/edit.html',
            controller: 'editUserController as editUser',
            resolve: {
                userTypes: function (userTypesService) {
                    return userTypesService.getUserTypes();
                },
                dataGroups: function (dataGroupsService) {
                    return dataGroupsService.getDataGroups();
                },
                userActions: function (userActionsService) {
                    return userActionsService.getActions();
                },
                currentUser: function (currentUserService) {
                    return currentUserService.getCurrentUser();
                },
                dimensionConstraint: function (categoriesService) {
                    return categoriesService.getDimensionConstraint();
                },
                userToEdit: function ($stateParams, userService) {
                    return userService.getUser($stateParams.userId);
                },
                userLocale: function ($stateParams, userService) {
                    return userService.getUserLocale($stateParams.username);
                },
                userEntity: function ($stateParams, userService) {
                    return userService.getUser($stateParams.userId)
                        .then(function (user) {
                            return userService.getUserEntity(user);
                        });
                }
            },
            params: {
                userId: '',
                username: ''
            }
        })
        .state('globalAdd', {
            url: '/global/add',
            templateUrl: 'globaluserinvite/globaluser-invite.html',
            controller: 'globalUserInviteController as globalUserCtrl',
            resolve: {
                dataGroups: function (dataGroupsService) {
                    return dataGroupsService.getDataGroups();
                },
                userActions: function (userActionsService) {
                    return userActionsService.getActions();
                },
                currentUser: function (currentUserService) {
                    return currentUserService.getCurrentUser();
                },
                userGroups: function (globalUserService) {
                    return globalUserService.getUserGroups();
                }
            }
        })
        .state('noaccess', {
            url: '/noaccess',
            templateUrl: 'noaccess/noaccess.html',
            controller: 'noAccessController as noAccess',
            params: {
                message: 'Your user account does not seem to have the right permissions to access this functionality.'
            }
        });
}

function angularUiSelectConfig(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
}

//==================================================================================
// Angular app module definition
//
angular.module('PEPFAR.usermanagement', [
    'ui.router',
    'restangular',
    'pascalprecht.translate',
    'ui.select',
    'ui.bootstrap',
    'ui.validate',
    'ngMessages',
    'd2HeaderBar',
    'ngAnimate'
]);

//==================================================================================
// Angular config blocks
//
angular.module('PEPFAR.usermanagement').config(translateConfig);
angular.module('PEPFAR.usermanagement').config(routerConfig);
angular.module('PEPFAR.usermanagement').config(angularUiSelectConfig);
angular.module('PEPFAR.usermanagement').value('SETTINGS', window.PEPFARUSERMANAGEMENT);
angular.module('PEPFAR.usermanagement').config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|data):/);
}]);

//==================================================================================
// Angular run blocks
//
angular.module('PEPFAR.usermanagement').run(function (Restangular, webappManifest) {
    var baseUrl = [webappManifest.activities.dhis.href, 'api'].join('/');
    Restangular.setBaseUrl(baseUrl);
});

//==================================================================================
// Bootstrap the app manually
//
function basePathResolver(url, injectables) {
    return [injectables.webappManifest.activities.dhis.href, url].join('/');
}

window.getBootstrapper('PEPFAR.usermanagement', document)
    .setBasePathResolver(basePathResolver)
    .addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp')
    .execute(function (injectables) {
        window.dhis2 = window.dhis2 || {};
        window.dhis2.settings = window.dhis2.settings || {};
        window.dhis2.settings.baseUrl = injectables.webappManifest.activities.dhis.href.replace(window.location.origin, '').replace(/^\//, '');
    })
    .loadStylesheet('/dhis-web-commons/css/menu.css')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.translate.js')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.menu.js')
    .loadModule('/dhis-web-commons/javascripts/dhis2/dhis2.menu.ui.js', 'd2HeaderBar')
    .bootstrap();
