describe('Partners service', function () {
    var errorHandler;
    var partnersService;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('$window', {alert: function () {}});
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        spyOn(errorHandler, 'error').and.callThrough();
        partnersService = $injector.get('partnersService');
    }));

    it('should be an object', function () {
        expect(partnersService).toBeAnObject();
    });

    describe('getPartners', function () {
        var $httpBackend;
        var fixtures = window.fixtures;
        var userRequest;
        var partnersRequest;

        function withFakeUserGroups(expectedAgencies) {
            return {
                items: expectedAgencies.items.map(function (agency) {
                    agency.userGroup = {id: 'fakeId'};
                    return agency;
                })
            };
        }

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            userRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/me')
                .respond(200, {
                    organisationUnits: [
                        {
                            name: 'Kenya'
                        }
                    ]
                });
            $httpBackend.whenGET('http://localhost:8080/dhis/api/me/authorization')
                .respond(200, []);

            partnersRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/dimensions/BOyWrF33hiR/items?paging=false')
                .respond(200, fixtures.get('partnerList'));
            $httpBackend.whenGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&filter=name:like:mechanisms&paging=false')
                .respond(200, {
                    userGroups: [
                    ]
                });
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            $httpBackend.resetExpectations();
            $httpBackend.flush();
            expect(partnersService.getPartners).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(partnersService.getPartners()).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('promise should return the correct partners', function () {
            var partnerList;
            var expectedPartnerList = withFakeUserGroups(fixtures.get('partnerList')).items;
            partnersRequest.respond(200, withFakeUserGroups(fixtures.get('partnerList')));

            partnersService.getPartners().then(function (data) {
                partnerList = data;
            });
            $httpBackend.flush();

            expect(partnerList).toEqual(expectedPartnerList);
        });

        it('should request the userGroups for partners', function () {
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&filter=name:like:mechanisms&paging=false')
                .respond(200, fixtures.get('rwandaUserGroup'));

            partnersService.getPartners();
            $httpBackend.flush();
        });

        it('should add the usergroups to the partner objects', function () {
            var partners;
            var expectedAgency = {
                name: 'Abt Associates',
                created: '2014-05-09T23:23:08.834+0000',
                lastUpdated: '2014-10-05T13:07:56.049+0000',
                id: 'JkisvjF4ahe',
                userGroup: fixtures.get('kenyaPartnerAbtUserGroup')
            };

            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&filter=name:like:mechanisms&paging=false')
                .respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners().then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners[0]).toEqual(expectedAgency);
        });

        it('should only load the partners that have usergroups', function () {
            var partners;

            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&filter=name:like:mechanisms&paging=false')
                .respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners().then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners.length).toEqual(1);
            expect(partners[0].userGroup.id).toBe('hxgit9fvIVv');
        });

        it('should reject promise when there are no partners', function () {
            var catchFunction = jasmine.createSpy();

            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&filter=name:like:mechanisms&paging=false')
                .respond(200, []);

            partnersService.getPartners().catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
            expect(errorHandler.error).toHaveBeenCalledWith('No partners found in Kenya that you can access all mechanisms for');
        });
    });
});
