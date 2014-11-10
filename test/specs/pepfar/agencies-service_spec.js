describe('Agencies service', function () {
    var agenciesService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        agenciesService = $injector.get('agenciesService');
    }));

    it('should be an object', function () {
        expect(agenciesService).toBeAnObject();
    });

    describe('getAgencies', function () {
        var $httpBackend;
        var fixtures = window.fixtures;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            $httpBackend.expectGET('http://localhost:8080/dhis/api/dimensions/bw8KHXzxd9i/items?paging=false')
                .respond(200, fixtures.agenciesList);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            //Reset expectations as we are not actually doing a call
            $httpBackend.resetExpectations();

            expect(agenciesService.getAgencies).toBeAFunction();
        });

        it('should return a promise like function', function () {
            expect(agenciesService.getAgencies()).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('promise should return an array with agencies', function () {
            var agencies;
            var expectedAgencies = fixtures.agenciesList.items;

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies).toEqual(expectedAgencies);
        });
    });
});
