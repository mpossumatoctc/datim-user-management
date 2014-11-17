describe('Locale service', function () {
    var fixtures = window.fixtures;
    var localeService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        localeService = $injector.get('localeService');
    }));

    it('should be an object', function () {
        expect(localeService).toBeAnObject();
    });

    describe('getUiLocales', function () {
        var $httpBackend;
        var $rootScope;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');

            $httpBackend.expectGET('http://localhost:8080/dhis/api/locales/ui')
                .respond(200, fixtures.get('locales'));

            $httpBackend.flush();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            expect(localeService.getUiLocales).toBeAFunction();
        });

        it('should return a promiseLikeObject', function () {
            expect(localeService.getUiLocales()).toBeAPromiseLikeObject();
        });

        it('should return a list of locales', function () {
            var locales;
            var expectedLocales = fixtures.get('locales');

            localeService.getUiLocales().then(function (response) {
                locales = response;
            });
            $rootScope.$apply();

            expect(locales).toEqual(expectedLocales);
        });
    });
});
