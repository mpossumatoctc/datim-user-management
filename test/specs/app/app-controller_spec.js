describe('App controller', function () {
    var controller;
    var $rootScope;
    var scope;

    beforeEach(module('ui.router'));
    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($controller, $injector) {
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();
        controller = $controller('appController', {
            $scope: scope
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should have the title set on the object', function () {
        expect(controller.title).toBe('User management');
    });

    it('should set scope.isLoading to false', function () {
        expect(controller.isLoading).toBe(false);
    });

    it('should set isLoading to true on $stateChangeStart', function () {
        $rootScope.$broadcast('$stateChangeStart');

        expect(controller.isLoading).toBe(true);
    });

    it('should set isLoading to false on $stateChangeSuccess', function () {
        controller.isLoading = true;
        $rootScope.$broadcast('$stateChangeSuccess');

        expect(controller.isLoading).toBe(false);
    });

    it('should set isLoading to false on $stateChangeError', function () {
        controller.isLoading = true;
        $rootScope.$broadcast('$stateChangeError');

        expect(controller.isLoading).toBe(false);

        expect(controller.isLoading).toBe(false);
    });
});
