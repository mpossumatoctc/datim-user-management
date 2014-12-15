describe('Organisation unit service', function () {
    var $httpBackend;
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('organisationUnitService');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a function called getOrganisationUnitsForLevel', function () {
        expect(service.getOrganisationUnitsForLevel).toBeAFunction();
    });

    describe('getOrganisationUnitsForLevel', function () {
        var orgUnitResponse;

        beforeEach(function () {
            orgUnitResponse = $httpBackend.expectGET('http://localhost:8080/dhis/api/organisationUnits?level=3')
                .respond(window.fixtures.get('organisationUnits'));
        });

        it('should call the api for the 3rd level orgunits', function () {
            service.getOrganisationUnitsForLevel(3);
            $httpBackend.flush();
        });

        it('should return a promise like object', function () {
            var result = service.getOrganisationUnitsForLevel(3);
            $httpBackend.flush();

            expect(result).toBeAPromiseLikeObject();
        });

        it('should return a list with expected number of orgunits', function () {
            var organisationUnits;

            service.getOrganisationUnitsForLevel(3)
                .then(function (response) {
                    organisationUnits = response;
                });
            $httpBackend.flush();

            expect(organisationUnits.length).toBe(37);
        });

        it('should return a list with name and id', function () {
            var organisationUnit;

            service.getOrganisationUnitsForLevel(3)
                .then(function (response) {
                    organisationUnit = response[0];
                });
            $httpBackend.flush();

            expect(organisationUnit.name).toEqual('Indonesia');
            expect(organisationUnit.id).toEqual('W73PRZcjFIU');
        });

        it('should only do the api request once', function () {
            service.getOrganisationUnitsForLevel(3);
            service.getOrganisationUnitsForLevel(3);

            $httpBackend.flush();
        });
    });
});
