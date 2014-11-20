describe('NoAccess controller', function () {
    var controller;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($controller) {
        controller = $controller('noAccessController', {});
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });
});
