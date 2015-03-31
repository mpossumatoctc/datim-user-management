describe('App controller', function () {
    var controller;
    var $rootScope;
    var scope;
    var $httpBackend;
    var errorHandler;

    beforeEach(module('ui.router'));
    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($controller, $injector) {
        var $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        errorHandler = $injector.get('errorHandler');
        $httpBackend.whenGET('http://localhost:8080/dhis/api/systemSettings').respond(200, {});

        spyOn(errorHandler, 'debug');

        scope = $rootScope.$new();
        controller = $controller('appController', {
            $scope: scope,
            currentUserService: {
                getCurrentUser: jasmine.createSpy().and.returnValue($q.when({
                    isGlobalUser: jasmine.createSpy(),
                    isUserAdministrator: jasmine.createSpy(),
                    hasAllAuthority: jasmine.createSpy()
                }))
            }
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
        $rootScope.$broadcast('$stateChangeSuccess', [undefined, {name: ''}]);

        expect(controller.isLoading).toBe(false);
    });

    it('should set isLoading to false on $stateChangeError', function () {
        controller.isLoading = true;
        $rootScope.$broadcast('$stateChangeError');

        expect(controller.isLoading).toBe(false);
    });

    it('should call the errorhandler or errorstate', function () {
        $rootScope.$broadcast('$stateChangeError');

        expect(errorHandler.debug).toHaveBeenCalled();
    });

    describe('header bar settings', function () {
        var systemSettingsResponse;

        beforeEach(function () {
            systemSettingsResponse = $httpBackend.expectGET('http://localhost:8080/dhis/api/systemSettings')
                .respond(200, {
                    keyCustomTopMenuLogo: true,
                    applicationTitle: 'DATIM',
                    startModule: 'dhis-web-dashboard-integration'
                });
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should have a headerBar property', function () {
            $httpBackend.flush();
            expect(controller.headerBar).toBeDefined();
        });

        it('headerbar property should have the expected structure', function () {
            var expectedStructure = {
                title: '',
                logo: '',
                link: ''
            };

            expect(controller.headerBar).toEqual(expectedStructure);
            $httpBackend.flush();
        });

        it('should set the logo to /external-static/logo_banner.png if customlogo is set', function () {
            $httpBackend.flush();
            expect(controller.headerBar.logo).toEqual('http://localhost:8080/dhis/external-static/logo_banner.png');
        });

        it('should not set the logo if a custom logo has not been enabled', function () {
            systemSettingsResponse.respond(200, {
                keyCustomTopMenuLogo: false,
                applicationTitle: 'DATIM',
                startModule: 'dhis-web-dashboard-integration'
            });
            $httpBackend.flush();

            expect(controller.headerBar.logo).toEqual('');
        });

        it('should set the application title', function () {
            $httpBackend.flush();
            expect(controller.headerBar.title).toBe('DATIM');
        });

        it('should set the header link to the given startModule', function () {
            $httpBackend.flush();
            expect(controller.headerBar.link).toBe('http://localhost:8080/dhis/dhis-web-dashboard-integration/index.action');
        });
    });
});
