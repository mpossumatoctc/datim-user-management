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
        $provide.factory('userActionsService', function ($q) {
            var success = $q.when([
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: false},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
            ]);

            return {
                getActionsForUser: jasmine.createSpy('getActionsForUser').and.returnValue(success),
                combineSelectedUserRolesWithExisting: jasmine.createSpy('combineSelectedUserRolesWithExisting')
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
        $provide.factory('userToEdit', function ($q) {
            return {
                userCredentials: {},
                save: jasmine.createSpy('Restangular save').and.returnValue($q.when(true)),
                SETTOFAIL: function () {
                    this.save = jasmine.createSpy('Restangular save').and.returnValue($q.reject(true));
                }
            };
        });
        $provide.factory('notify', function () {
            return {
                success: jasmine.createSpy('success')
            };
        });
        $provide.factory('errorHandler', function () {
            var errorFunction = jasmine.createSpy('errorFn');
            return {
                errorFn: function () {
                    return errorFunction;
                }
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
        expect(controller.user.locale).toEqual({name:'fr', code: 'fr'});
    });

    it('should ask for the datagroups for a user', function () {
        expect(dataGroupsService.getDataGroupsForUser).toHaveBeenCalled();
    });

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
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
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

            expect(scope.user.dataGroups.EA).toBe(true);
        });

        it('should resolve the userActions promise', function () {
            $rootScope.$apply();

            expect(controller.actions).toEqual(expectedActions);
            expect(controller.user.userActions['Capture data']).toBe(true);
            expect(controller.user.userActions['Read data']).toBe(true);
        });
    });

    describe('editUser', function () {
        var userActionsService;
        var notify;
        var errorHandler;

        beforeEach(inject(function ($injector) {
            userActionsService = $injector.get('userActionsService');
            notify = $injector.get('notify');
            errorHandler = $injector.get('errorHandler');

            controller.user = {
                userActions: {}
            };
            controller.dataGroups = {};
            controller.actions = {};

            errorHandler.errorFn().calls.reset();
        }));

        it('should call combineSelectedUserRolesWithExisting', function () {
            controller.editUser();

            expect(userActionsService.combineSelectedUserRolesWithExisting).toHaveBeenCalled();
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

        it('should call errorFunction on failure', inject(function (userToEdit) {
            userToEdit.SETTOFAIL();

            controller.editUser();
            $rootScope.$apply();

            expect(errorHandler.errorFn()).toHaveBeenCalled();
            expect(notify.success).not.toHaveBeenCalled();
        }));
    });
});
