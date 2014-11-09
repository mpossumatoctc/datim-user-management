describe('Restangular config', function () {
    var Restangular;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        Restangular = $injector.get('Restangular');
    }));

    it('should have set base url to the manifest url appended with /api', function () {
        expect(Restangular.configuration.baseUrl).toBe('http://localhost:8080/dhis/api');
    });
});
