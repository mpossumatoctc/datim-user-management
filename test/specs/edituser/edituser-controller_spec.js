describe('Edit user controller', function () {
    var controller;

    beforeEach(module('PEPFAR.usermanagement', function (/*$provide*/) {

    }));
    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');

        controller = $controller('editUserController', {});
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });
});
