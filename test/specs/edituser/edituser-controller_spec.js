describe('Edit user controller', function () {
    var controller;
    var dataGroupsService;
    var $rootScope;
    var scope;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('userToEdit', {});
        $provide.value('userLocale', {
            name: 'fr',
            code: 'fr'
        });
        $provide.factory('dataGroups', function () {
            return [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];
        });
        $provide.factory('dataGroupsService', function ($q) {
            var success = $q.when(window.fixtures.get('dataStreamAccess'));

            return {
                getDataGroupsForUser: jasmine.createSpy('getDataGroupsForUser').and.returnValue(success),
                getUserGroups: jasmine.createSpy('getUserGroups')
            };
        });
        $provide.factory('userActions', function ($q) {
            return {
                actions: [
                    {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
                    {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                    {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
                    {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
                ],
                getActionsForUserType: jasmine.createSpy('getActionsForUserType').and.returnValue(
                    [{name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}]
                ),
                getActionsForUser: jasmine.createSpy('getActionsForUser')
                    .and.returnValue($q.when([
                        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: false},
                        {
                            name: 'Manage users',
                            userRole: 'User Administrator',
                            userRoleId: 'KagqnetfxMr',
                            hasAction: false
                        },
                        {
                            name: 'Read data',
                            userRole: 'Read Only',
                            userRoleId: 'b2uHwX9YLhu',
                            default: true,
                            hasAction: true
                        }
                    ])),
                getUserRolesForUser: jasmine.createSpy('getUserRolesForUser'),
                combineSelectedUserRolesWithExisting: jasmine.createSpy('combineSelectedUserRolesWithExisting'),
                getDataEntryRestrictionDataGroups: jasmine.createSpy('getDataEntryRestrictionDataGroups')
                    .and.returnValue(['SI', 'EA']),
                filterActionsForCurrentUser: function (actions) {
                    return actions;
                }
            };
        });
        $provide.factory('userFormService', function () {
            var spyValidation = jasmine.createSpyObj('validations', ['dataGroupsInteractedWith', 'validateDataGroups', 'isRequiredDataStreamSelected']);
            return {
                getValidations: function () {
                    return spyValidation;
                }
            };
        });
        $provide.factory('userToEdit', function () {
            return {
                userCredentials: {
                    disabled: false
                },
                userGroups: window.fixtures.get('userGroupsRoles').userGroups,
                organisationUnits: [
                    {name: 'Rwanda'}
                ]
            };
        });
        $provide.factory('userService', function ($q) {
            var userEntity = {
                id: 'FPUgmtt8HRi',
                name: 'HHS/CDC',
                code: 'Agency_HHS/CDC',
                created: '2014-05-09T23:23:06.953+0000',
                lastUpdated: '2014-10-05T13:07:55.940+0000',
                href: 'http://localhost:8080/dhis/api/categoryOptionGroups/FPUgmtt8HRi',
                mechUserGroup: {
                    id: 'kX5ppDWUxOn',
                    name: 'OU Botswana Agency HHS/CDC all mechanisms'
                },
                userAdminUserGroup: {
                    id: 'zkxcQagTNx4',
                    name: 'OU Botswana Agency HHS/CDC user administrators'
                },
                userUserGroup: {
                    id: 'Eo2DzeGaK9j',
                    name: 'OU Botswana Agency HHS/CDC users'
                }
            };

            return {
                updateUser: jasmine.createSpy('updateUser').and.returnValue($q.when(true)),
                saveUserLocale: jasmine.createSpy('saveUserLocale').and.returnValue($q.when(true)),
                getUserEntity: jasmine.createSpy('getUserEntity').and.returnValue($q.when(userEntity)),
                SETTOFAIL: function () {
                    if (Array.prototype.indexOf.call(arguments, 'updateUser') >= 0) {
                        this.updateUser = jasmine.createSpy('updateUser').and.returnValue($q.reject(true));
                    }

                    if (Array.prototype.indexOf.call(arguments, 'saveUserLocale') >= 0) {
                        this.saveUserLocale = jasmine.createSpy('saveUserLocale').and.returnValue($q.reject(true));
                    }
                }
            };
        });
        $provide.factory('userTypeService', function () {
            return {
                getUserType: jasmine.createSpy('getUserType').and.returnValue('Partner')
            };
        });
        $provide.factory('notify', function () {
            return {
                success: jasmine.createSpy('success'),
                warning: jasmine.createSpy('warning')
            };
        });
        $provide.factory('errorHandler', function () {
            var errorFunction = jasmine.createSpy('errorFn');
            return {
                errorFn: function () {
                    return errorFunction;
                },
                debug: jasmine.createSpy('debug')
            };
        });
        $provide.factory('currentUser', function () {
            return {
                hasAllAuthority: jasmine.createSpy('hasAllAuthority').and.returnValue(false),
                isUserAdministrator: jasmine.createSpy('isUserAdministrator').and.returnValue(true)
            };
        });
        $provide.factory('$state', function () {
            return {
                go: jasmine.createSpy('go')
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');

        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        dataGroupsService = $injector.get('dataGroupsService');

        controller = $controller('editUserController', {
            $scope: scope
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should set injected userToEdit onto the controller', function () {
        expect(controller.userToEdit).toBeDefined();
    });

    it('should set injected userLocale onto the controller', function () {
        expect(controller.user.locale).toEqual({name: 'fr', code: 'fr'});
    });

    it('should ask for the datagroups for a user', function () {
        expect(dataGroupsService.getDataGroupsForUser).toHaveBeenCalled();
    });

    it('should have a isProcessingEditUser property', function () {
        expect(controller.isProcessingEditUser).toBe(false);
    });

    it('should return userType when calling getUserType', function () {
        expect(controller.getUserType()).toBe('Partner');
    });

    it('should have a userEntity', function () {
        expect(controller.userEntityName).toBe('');
    });

    it('should redirect on no access', inject(function ($controller, currentUser, $state) {
        currentUser.isUserAdministrator.and.returnValue(false);

        $controller('editUserController', {
            $scope: scope
        });

        expect($state.go).toHaveBeenCalled();
    }));

    it('should redirect when user attempts to edit him/herself', inject(function ($controller, currentUser, userToEdit, $state) {
        currentUser.id = 'dd234dshh2';
        userToEdit.id = 'dd234dshh2';

        $controller('editUserController', {
            $scope: scope
        });

        expect($state.go).toHaveBeenCalled();
    }));

    describe('validations', function () {
        var userFormService;

        beforeEach(inject(function ($injector) {
            userFormService = $injector.get('userFormService');
        }));

        it('should call validateDataGroups', function () {
            controller.validateDataGroups();

            expect(userFormService.getValidations().validateDataGroups).toHaveBeenCalled();
        });

        it('should call isRequiredDataStreamSelected', function () {
            controller.isRequiredDataStreamSelected();

            expect(userFormService.getValidations().isRequiredDataStreamSelected).toHaveBeenCalled();
        });
    });

    describe('initialise', function () {
        var expectedActions;

        beforeEach(function () {
            expectedActions = [
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: false},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
            ];
        });

        it('should resolve the dataGroups promise', function () {
            scope.user = {
                dataGroups: {}
            };

            $rootScope.$apply();

            expect(scope.user.dataGroups.EA.access).toBe(true);
        });

        it('should resolve the userActions promise', function () {
            $rootScope.$apply();

            expect(controller.actions).toEqual(expectedActions);
            expect(controller.user.userActions['Read data']).toBe(true);
        });
    });

    describe('editUser', function () {
        var userActions;
        var notify;
        var errorHandler;
        var userService;

        beforeEach(inject(function ($injector) {
            userActions = $injector.get('userActions');
            notify = $injector.get('notify');
            errorHandler = $injector.get('errorHandler');
            userService = $injector.get('userService');

            controller.user = {
                userActions: {}
            };
            controller.dataGroups = {};
            controller.actions = {};

            errorHandler.errorFn().calls.reset();
        }));

        it('should call combineSelectedUserRolesWithExisting', function () {
            controller.editUser();

            expect(userActions.combineSelectedUserRolesWithExisting).toHaveBeenCalled();
        });

        it('should call getUserGroups on dataGroupsService', function () {
            controller.editUser();

            expect(dataGroupsService.getUserGroups).toHaveBeenCalled();
        });

        it('should call notify on save', function () {
            controller.editUser();
            $rootScope.$apply();

            expect(notify.success).toHaveBeenCalled();
            expect(errorHandler.errorFn()).not.toHaveBeenCalled();
        });

        it('should call errorFunction on failure', function () {
            userService.SETTOFAIL('updateUser');

            controller.editUser();
            $rootScope.$apply();

            expect(errorHandler.errorFn()).toHaveBeenCalled();
            expect(notify.success).not.toHaveBeenCalled();
        });

        it('should call  saveUserLocale on the userService', function () {
            controller.editUser();
            $rootScope.$apply();

            expect(userService.saveUserLocale).toHaveBeenCalled();
        });

        it('should call notify with success when the user is updated successfully', function () {
            controller.editUser();
            $rootScope.$apply();

            expect(notify.success).toHaveBeenCalledWith('User updated');
        });

        it('should call notify warning when the user is updated but failed to save locale', function () {
            userService.SETTOFAIL('saveUserLocale');

            controller.editUser();
            $rootScope.$apply();

            expect(notify.warning).toHaveBeenCalledWith('Updated user but failed to save the ui locale');
            expect(errorHandler.errorFn()).not.toHaveBeenCalled();
        });

        it('should give success message when no locale was saved but user save was successful', function () {
            scope.user.locale = undefined;

            controller.editUser();
            $rootScope.$apply();

            expect(notify.success).toHaveBeenCalledWith('User updated');
            expect(userService.saveUserLocale).not.toHaveBeenCalled();
        });

        it('should set isProcessingEditUser to true', function () {
            controller.editUser();

            expect(controller.isProcessingEditUser).toBe(true);
        });

        it('should set isProcessingEditUser to false after processing is complete', function () {
            controller.editUser();
            $rootScope.$apply();

            expect(controller.isProcessingEditUser).toBe(false);
        });

        it('should set isProcessingEditUser to false after processing failed', function () {
            userService.SETTOFAIL('saveUserLocale');

            controller.editUser();
            $rootScope.$apply();

            expect(controller.isProcessingEditUser).toBe(false);
        });

        it('should set isProcessingEditUser to false after processing failed', function () {
            userService.SETTOFAIL('updateUser');

            controller.editUser();
            $rootScope.$apply();

            expect(controller.isProcessingEditUser).toBe(false);
        });
    });

    describe('debugLog', function () {
        var errorHandler;

        beforeEach(inject(function ($injector) {
            errorHandler = $injector.get('errorHandler');
            $rootScope.$apply();
        }));

        it('should log the locale', function () {
            scope.user.locale = {
                name: 'en',
                code: 'en'
            };
            $rootScope.$apply();

            expect(errorHandler.debug).toHaveBeenCalledWith(
                'Changed locale from:', {name: 'fr', code: 'fr'}, ' to ', {name: 'en', code: 'en'});
        });

        it('should log when a datagroup is added', function () {
            scope.user.dataGroups.LAR = {
                access: true
            };
            $rootScope.$apply();

            expect(errorHandler.debug).toHaveBeenCalledWith('LAR added.');
        });

        it('should log when a datagroup is removed', function () {
            scope.user.dataGroups.EA.access = false;
            $rootScope.$apply();

            expect(errorHandler.debug).toHaveBeenCalledWith('EA removed.');
        });

        it('should log when a action is added', function () {
            scope.user.userActions['Manage user'] = true;
            $rootScope.$apply();

            expect(errorHandler.debug).toHaveBeenCalledWith('Manage user added.');
        });

        it('should log when a action is removed', function () {
            scope.user.userActions['Manage user'] = false;
            $rootScope.$apply();

            expect(errorHandler.debug).toHaveBeenCalledWith('Manage user removed.');
        });
    });

    describe('changeUserStatus', function () {
        it('should be a function', function () {
            expect(controller.changeUserStatus).toBeAFunction();
        });

        it('should change the status to disabled', function () {
            controller.changeUserStatus();

            expect(controller.userToEdit.userCredentials.disabled).toBe(true);
        });

        it('should change the status to enabled', function () {
            controller.userToEdit.userCredentials.disabled = true;

            controller.changeUserStatus();

            expect(controller.userToEdit.userCredentials.disabled).toBe(false);
        });
    });

    describe('userEntityName', function () {
        var userService;
        var $q;
        var $controller;

        beforeEach(inject(function ($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');

            userService = $injector.get('userService');
            $q = $injector.get('$q');
        }));

        it('should set the user entity name', function () {
            controller = $controller('editUserController', {
                $scope: scope
            });
            $rootScope.$apply();

            expect(controller.userEntityName).toBe('HHS/CDC');
        });

        it('should set the userEntityName to the org userUserGroup minus the OU prefix', function () {
            var countryTeamEntity = {
                userUserGroup: {id: 'LqrnY1CgnCv', name: 'OU Rwanda Country team'},
                userAdminUserGroup: {id: 'sJSLgsi6KjY', name: 'OU Rwanda User administrators'},
                mechUserGroup: {id: 'OGAFubEVJK0', name: 'OU Rwanda All mechanisms'}
            };
            userService.getUserEntity = jasmine.createSpy('getUserEntity').and.returnValue($q.when(countryTeamEntity));

            controller = $controller('editUserController', {
                $scope: scope
            });
            $rootScope.$apply();

            expect(controller.userEntityName).toBe('Rwanda Country team');
        });

        it('should not set if the userEntity can not be found', function () {
            userService.getUserEntity = jasmine.createSpy('getUserEntity').and.returnValue($q.when(undefined));

            controller = $controller('editUserController', {
                $scope: scope
            });
            $rootScope.$apply();

            expect(controller.userEntityName).toBe('');
        });

        it('should not set if the usergroup does not have a name', function () {
            var countryTeamEntity = {
                userUserGroup: {id: 'LqrnY1CgnCv'},
                userAdminUserGroup: {id: 'sJSLgsi6KjY', name: 'OU Rwanda User administrators'},
                mechUserGroup: {id: 'OGAFubEVJK0', name: 'OU Rwanda All mechanisms'}
            };
            userService.getUserEntity = jasmine.createSpy('getUserEntity').and.returnValue($q.when(countryTeamEntity));

            controller = $controller('editUserController', {
                $scope: scope
            });
            $rootScope.$apply();

            expect(controller.userEntityName).toBe('');
        });
    });

    describe('getOrganisationUnitForUserToEdit', function () {
        it('should return Rwanda', function () {
            $rootScope.$apply();

            expect(controller.getOrganisationUnitForUserToEdit()).toBe('Rwanda');
        });

        it('should return unknown when there is no org unit', inject(function (userToEdit) {
            userToEdit.organisationUnits = [];
            $rootScope.$apply();

            expect(controller.getOrganisationUnitForUserToEdit()).toBe('Unknown');
        }));
    });
});
