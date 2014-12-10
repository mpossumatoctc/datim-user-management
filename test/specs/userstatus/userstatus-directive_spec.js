describe('User status directive', function () {
    var $compile;
    var $rootScope;
    var scope;
    var element;

    beforeEach(module('userstatus/userstatus.html'));
    beforeEach(module('PEPFAR.usermanagement'));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        scope.user = {
            disabled: false
        };

        element = angular.element('<user-status user="user"></user-status>');
        $compile(element)(scope);
        $rootScope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('user-status');
    });

    it('should show the user is enabled', function () {
        expect(element.find('.user-status-text')[0].textContent).toBe('Enabled');
    });

    it('should give the user status the user-enabled class', function () {
        expect(element).toHaveClass('user-enabled');
    });

    it('should show the user is disabled', function () {
        scope.user.disabled = true;
        scope.$apply();

        expect(element.find('.user-status-text')[0].textContent).toBe('Disabled');
    });

    it('should give the user status the user-disabled class', function () {
        scope.user.disabled = true;
        scope.$apply();

        expect(element).toHaveClass('user-disabled');
    });
});
