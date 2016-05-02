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
        .state('globalEdit', {
            url: '/global/edit/{userId}/{username}',
            templateUrl: 'globaluseredit/globaluser-edit.html',
            controller: 'globalUserEditController as globalUserCtrl',
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
                },
                userToEdit: function ($stateParams, userService, userTypesService, notify) {
                    return userService.getUser($stateParams.userId)
                        .then(function (userToEdit) {
                            if (userTypesService.getUserType(userToEdit) === 'Global') {
                                return userToEdit;
                            }
                            notify.warning('Given user id does not seem to correspond with a Global user');
                            throw new Error('Not a global user');
                        });
                },
                userLocale: function ($stateParams, userService) {
                    return userService.getUserLocale($stateParams.username);
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

    if (process.env.NODE_ENV !== 'production') {
        Restangular.setBaseUrl('http://localhost:8080/dhis/api');
    } else {
        Restangular.setBaseUrl(baseUrl);
    }

});

//==================================================================================
// Bootstrap the app manually
//
function basePathResolver(url, injectables) {
    if (process.env.NODE_ENV !== 'production') {
        return ['http://localhost:8080/dhis', url].join('/');
    }

    return [injectables.webappManifest.activities.dhis.href, url].join('/');
}

window.getBootstrapper('PEPFAR.usermanagement', document)
    .setBasePathResolver(basePathResolver)
    .addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp')
    .execute(function (injectables) {
        window.dhis2 = window.dhis2 || {};
        window.dhis2.settings = window.dhis2.settings || {};

        if (process.env.NODE_ENV !== 'production') {
            window.dhis2.settings.baseUrl = 'http://localhost:8080/dhis';
        } else {
            window.dhis2.settings.baseUrl = injectables.webappManifest.activities.dhis.href.replace(window.location.origin, '').replace(/^\//, '');
        }

        console.log(window.dhis2.settings.baseUrl);
    })
    .loadStylesheet('/dhis-web-commons/css/menu.css')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.translate.js')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.menu.js')
    .loadModule('/dhis-web-commons/javascripts/dhis2/dhis2.menu.ui.js', 'd2HeaderBar')
    .bootstrap();
