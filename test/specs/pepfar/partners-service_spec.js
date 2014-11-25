describe('Partners service', function () {
    var errorHandler;
    var partnersService;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('$window', {alert: function () {}});
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        errorHandler.isDebugOn = true;
        spyOn(errorHandler, 'debug').and.callThrough();
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
        var userGroupsRequest;

        function withFakeUserGroups(expectedAgencies) {
            return {
                items: expectedAgencies.items.map(function (partner) {
                    partner.mechUserGroup = {id: 'fakeId'};
                    partner.userUserGroup = {id: 'fakeUserId'};
                    return partner;
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
            userGroupsRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&paging=false')
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
            partnersRequest.respond(200, fixtures.get('rwandaUserGroup'));

            partnersService.getPartners();
            $httpBackend.flush();
        });

        it('should add the usergroups to the partner objects', function () {
            var partners;
            var expectedPartner = {
                name: 'Banana',
                created: '2014-05-28T19:50:31.398+0000',
                lastUpdated: '2014-10-05T13:07:56.182+0000',
                id: 'pBimh5znu2H',
                mechUserGroup: {
                    id: 'tICoPGZAWNk',
                    name: 'OU Kenya Partner 10001 all mechanisms - Banana'
                },
                userUserGroup: {
                    id: 'pGh2wzc7bMY',
                    name: 'OU Kenya Partner 10001 users - Banana'
                },
                userAdminUserGroup: {
                    id: 'UCnkwxHKAAm',
                    name: 'OU Kenya Partner 10001 user administrators - Banana'
                }
            };

            userGroupsRequest.respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners().then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners[0]).toEqual(expectedPartner);
        });

        it('should only load the partners that have a mechusergroup and userusergroup', function () {
            var partners;

            userGroupsRequest.respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners().then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners.length).toEqual(2);
            expect(partners[0].mechUserGroup.id).toBe('tICoPGZAWNk');
            expect(partners[1].mechUserGroup.id).toBe('f8t4yjDIfiY');
            expect(partners[0].userUserGroup.id).toBe('pGh2wzc7bMY');
            expect(partners[1].userUserGroup.id).toBe('eUXnF1aIa1Y');
        });

        it('should reject promise when there are no partners', function () {
            var catchFunction = jasmine.createSpy();

            partnersRequest.respond(200, []);

            partnersService.getPartners().catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
            expect(errorHandler.debug).toHaveBeenCalledWith('No partners found in Kenya that you can access all mechanisms for');
        });
    });
});
