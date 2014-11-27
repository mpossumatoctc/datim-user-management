describe('Userlist controller', function () {
    var controller;
    var getListSpy;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        getListSpy = jasmine.createSpy().and.returnValue({
            then: function (callback) {
                callback(window.fixtures.get('usersPage1').users);
            }
        });

        $provide.value('userFilter', [
            {name: 'Name'},
            {name: 'Username'},
            {name: 'E-Mail'},
            {name: 'Roles'},
            {name: 'User Groups'},
            {name: 'Organisation Unit'},
            {name: 'Types'}
        ]);
        $provide.value('userTypes', {

        });
        $provide.value('dataGroups', {

        });
        $provide.factory('userListService', function (paginationService) {
            return {
                getList: getListSpy,
                pagination: paginationService
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        //var $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        controller = $controller('userListController', {});
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should have a property for the userList', function () {
        expect(controller.users).toBeDefined();
    });

    it('should call getlist on the userservice', function () {
        expect(getListSpy).toHaveBeenCalled();
    });

    it('should set the initial userlist onto the controller', function () {
        expect(controller.users).toBeAnArray();
        expect(controller.users.length).toBe(50);
    });

    it('should have a pagination object', function () {
        expect(controller.pagination).toBeAnObject();
    });

    it('should have a currentPage property', function () {
        expect(controller.currentPage).toBe(1);
    });

    it('should have a pageChanged function', function () {
        expect(controller.pageChanged).toBeAFunction();
    });

    it('should have a processing property', function () {
        expect(controller.processing).toBeAnObject();
    });

    describe('deactivateUser', function () {
        it('should be a method', function () {
            expect(controller.deactivateUser).toBeAFunction();
        });

        it('should add the user id to processing and set it to true', function () {
            controller.deactivateUser({id: 'njG5yURaHwX'});

            expect(controller.processing.njG5yURaHwX).toBe(true);
        });
    });

    describe('activateUser', function () {
        it('should be a method', function () {
            expect(controller.activateUser).toBeAFunction();
        });
    });
});
