describe('NoAccess controller', function () {
    var controller;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($controller) {
        controller = $controller('noAccessController', {
            $stateParams: {
                message: 'MyErrorMessage'
            }
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should set the stateparam.message as the message', function () {
        expect(controller.message).toBe('MyErrorMessage');
    });

    it('should display the default no access when no message has been provided', inject(function ($controller) {
        controller = $controller('noAccessController', {
            $stateParams: {}
        });

        expect(controller.message).toBe('Your user account does not seem to have the right permissions to access this functionality.');
    }));
});
