describe('Partners service', function () {
    var partnersService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        partnersService = $injector.get('partnersService');
    }));

    it('should be an object', function () {
        expect(partnersService).toBeAnObject();
    });

    describe('getPartners', function () {
        var $httpBackend;
        var fixtures = window.fixtures;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            $httpBackend.expectGET('http://localhost:8080/dhis/api/dimensions/BOyWrF33hiR/items?paging=false')
                .respond(200, fixtures.partnerList);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            $httpBackend.resetExpectations();
            expect(partnersService.getPartners).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(partnersService.getPartners()).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('promise should return the correct partners', function () {
            var partnerList;
            var expectedPartnerList = fixtures.partnerList.items;

            partnersService.getPartners().then(function (data) {
                partnerList = data;
            });
            $httpBackend.flush();

            expect(partnerList).toEqual(expectedPartnerList);
        });
    });
});
