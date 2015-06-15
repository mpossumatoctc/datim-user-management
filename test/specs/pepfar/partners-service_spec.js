describe('Partners service', function () {
    var errorHandler;
    var partnersService;
    var organisationUnit;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('$window', {alert: function () {}});
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        errorHandler.isDebugOn = true;
        spyOn(errorHandler, 'debug').and.callThrough();
        partnersService = $injector.get('partnersService');

        organisationUnit = {
            id: 'ds0ADyc9UCU',
            name: 'Kenya'
        };
    }));

    it('should be an object', function () {
        expect(partnersService).toBeAnObject();
    });

    describe('getPartners', function () {
        var $httpBackend;
        var fixtures = window.fixtures;
        var partnersRequest;
        var userGroupsRequest;
        var cogsRequest;
        var dodOnlySqlViewRequest;

        function withFakeUserGroups(expectedAgencies) {
            return {
                items: expectedAgencies.categoryOptionGroups.map(function (partner) {
                    partner.mechUserGroup = {id: 'fakeId'};
                    partner.userUserGroup = {id: 'fakeUserId'};
                    return partner;
                })
            };
        }

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            cogsRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/categoryOptionGroupSets?fields=id&filter=name:eq:Implementing+Partner&paging=false')
                .respond(200, {
                    categoryOptionGroupSets: [
                        {id: 'BOyWrF33hiR'}
                    ]
                });

            partnersRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/categoryOptionGroupSets/BOyWrF33hiR?fields=categoryOptionGroups&paging=false')
                .respond(200, fixtures.get('partnerList'));
            userGroupsRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Kenya+partner&paging=false')
                .respond(200, {
                    userGroups: [
                    ]
                });

            $httpBackend.whenGET('http://localhost:8080/dhis/api/systemSettings/keyAPP_User_Management-dod_only_SqlView')
                .respond(200, '{"value": "gESI9gFkIkX"}');

            dodOnlySqlViewRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/sqlViews/gESI9gFkIkX/data.json')
                .respond(200, fixtures.get('dodOnlySqlView'));
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
            expect(partnersService.getPartners(organisationUnit)).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('promise should return the correct partners', function () {
            var partnerList;
            var expectedPartnerList = withFakeUserGroups(fixtures.get('partnerList')).categoryOptionGroups;
            partnersRequest.respond(200, withFakeUserGroups(fixtures.get('partnerList')));

            partnersService.getPartners(organisationUnit).then(function (data) {
                partnerList = data;
            });
            $httpBackend.flush();

            expect(partnerList).toEqual(expectedPartnerList);
        });

        it('should request the userGroups for partners', function () {
            partnersRequest.respond(200, fixtures.get('rwandaUserGroup'));

            partnersService.getPartners(organisationUnit);
            $httpBackend.flush();
        });

        it('should add the usergroups to the partner objects', function () {
            var partners;
            var expectedPartner = {
                id: 'pBimh5znu2H',
                code: 'Partner_10001',
                name: 'Banana',
                created: '2014-05-28T19:50:31.398+0000',
                lastUpdated: '2014-10-05T13:07:56.182+0000',
                dodEntry: false,
                normalEntry: true,
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

            partnersService.getPartners(organisationUnit).then(function (data) {
                partners = data;
            });
            $httpBackend.flush();
            expect(partners[0]).toEqual(expectedPartner);
        });

        it('should set the correct dataEntry flags for a dodOnly partner', function () {
            var partners;

            userGroupsRequest.respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners(organisationUnit).then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners[1].dodEntry).toEqual(true);
            expect(partners[1].normalEntry).toEqual(false);
        });

        it('should set the correct dataEntry flags for dod partner with nonDod entry too', function () {
            var partners;
            var dodOnlySqlView = fixtures.get('dodOnlySqlView');
            //Set the nonDod column of the fixture to 1 for nonDod entry
            dodOnlySqlView.rows[0][2] = '1';

            userGroupsRequest.respond(200, fixtures.get('kenyaPartnerUserGroups'));
            dodOnlySqlViewRequest.respond(200, dodOnlySqlView);

            partnersService.getPartners(organisationUnit).then(function (data) {
                partners = data;
            });
            $httpBackend.flush();

            expect(partners[1].dodEntry).toEqual(true);
            expect(partners[1].normalEntry).toEqual(true);
        });

        it('should only load the partners that have a mechusergroup and userusergroup', function () {
            var partners;

            userGroupsRequest.respond(200, fixtures.get('kenyaPartnerUserGroups'));

            partnersService.getPartners(organisationUnit).then(function (data) {
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

            partnersService.getPartners(organisationUnit).catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
            expect(errorHandler.debug).toHaveBeenCalledWith('No partners found in Kenya that you can access all mechanisms for');
        });

        it('should reject the promise with the correct message on no org unit', inject(function ($rootScope) {
            var partnersMessage;
            $httpBackend.resetExpectations();

            partnersService.getPartners({}).catch(function (response) {
                partnersMessage = response;
            });
            $rootScope.$apply();

            expect(partnersMessage).toEqual('No organisation unit found');
        }));

        it('should reject the promise when the cogs can not be found', function () {
            var catchFunction = jasmine.createSpy();
            $httpBackend.resetExpectations();

            cogsRequest.respond(500);
            partnersService.getPartners(organisationUnit).catch(catchFunction);

            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should reject the promise when only one cogs is returned', inject(function ($q) {
            var catchFunction = jasmine.createSpy();
            spyOn($q, 'reject').and.callThrough();
            $httpBackend.resetExpectations();

            cogsRequest.respond(200, {categoryOptionGroupSets: []});
            partnersService.getPartners(organisationUnit).catch(catchFunction);

            $httpBackend.flush();

            expect($q.reject).toHaveBeenCalledWith('None or more than one categoryOptionGroupSets found that match "Implementing Partner"');
        }));
    });
});
