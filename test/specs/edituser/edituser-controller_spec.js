describe('Edit user controller', function () {
    var controller;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('userToEdit', {});
        $provide.value('userLocale', {
            name: 'fr',
            code: 'fr'
        });
    }));

    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        var $rootScope = $injector.get('$rootScope');

        controller = $controller('editUserController', {
            $scope: $rootScope.$new()
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
});
