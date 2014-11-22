describe('Agencies service', function () {
    var errorHandler;
    var agenciesService;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('$window', {alert: function () {}});
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        spyOn(errorHandler, 'error').and.callThrough();
        agenciesService = $injector.get('agenciesService');
    }));

    it('should be an object', function () {
        expect(agenciesService).toBeAnObject();
    });

    it('should be a function', function () {
        expect(agenciesService.getAgencies).toBeAFunction();
    });

    describe('getAgencies', function () {
        var $httpBackend;
        var fixtures = window.fixtures;
        var agenciesRequest;
        var userRequest;
        var userGroupRequest;

        function withFakeUserGroups(expectedAgencies) {
            return {
                items: expectedAgencies.items.map(function (agency) {
                    agency.mechUserGroup = {};
                    agency.userUserGroup = {};
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
                            name: 'Rwanda'
                        }
                    ]
                });
            $httpBackend.whenGET('http://localhost:8080/dhis/api/me/authorization')
                .respond(200, []);

            agenciesRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/dimensions/bw8KHXzxd9i/items?paging=false')
                .respond(200, fixtures.get('agenciesList'));
            userGroupRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Rwanda+Agency&paging=false')
                .respond(200, {
                    userGroups: [
                    ]
                });
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return a promise like function', function () {
            expect(agenciesService.getAgencies()).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('promise should return an array with agencies', function () {
            var agencies;
            var expectedAgencies = withFakeUserGroups(fixtures.get('agenciesList')).items;
            agenciesRequest.respond(200, withFakeUserGroups(fixtures.get('agenciesList')));

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies).toEqual(expectedAgencies);
        });

        it('should request the userGroups for agencies', function () {
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroup'));

            agenciesService.getAgencies();
            $httpBackend.flush();
        });

        it('should add the usergroups to the agency objects', function () {
            var agencies;
            var expectedAgency = {
                name: 'HHS/CDC',
                created: '2014-05-09T23:23:06.953+0000',
                lastUpdated: '2014-10-05T13:07:55.940+0000',
                id: 'FPUgmtt8HRi',
                mechUserGroup: {
                    id: 'Stc8jiohyTg',
                    name: 'OU Rwanda Agency HHS/CDC all mechanisms'
                },
                userUserGroup: {
                    id: 'hjLU7Ug0vKG',
                    name: 'OU Rwanda Agency HHS/CDC users'
                },
                userAdminUserGroup: {
                    id: 'x47aP9pWYlu',
                    name: 'OU Rwanda Agency HHS/CDC user administrators'
                }

            };

            userGroupRequest.respond(200, fixtures.get('rwandaUserGroup'));

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies[0]).toEqual(expectedAgency);
        });

        it('should not return any agencies without userUserGroup groups', function () {
            var agencies;
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroupWithoutUSAIDUserGroup'));

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies.length).toBe(1);
            expect(agencies[0].userUserGroup.id).toBe('hjLU7Ug0vKG');
        });

        it('should not return any agencies without mechUserGroup groups', function () {
            var agencies;
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroup'));

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies.length).toBe(2);
            expect(agencies[0].mechUserGroup.id).toBe('Stc8jiohyTg');
            expect(agencies[1].mechUserGroup.id).toBe('FzwHJqJ81DO');
        });

        it('should be able to return agencies without userAdminUserGroup', function () {
            var agencies;
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroupWithoutUSAIDAdminUserGroup'));

            agenciesService.getAgencies().then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies.length).toBe(2);
            expect(agencies[0].userAdminUserGroup.id).toBe('x47aP9pWYlu');
            expect(agencies[1].userAdminUserGroup).not.toBeDefined();
        });

        it('should reject the promise with an error', function () {
            var catchFunction = jasmine.createSpy();
            agenciesRequest.respond(200, fixtures.get('agenciesList'));

            agenciesService.getAgencies().catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
            expect(errorHandler.error).toHaveBeenCalled();
        });

        it('should reject the promise with the correct message on no org unit', function () {
            var agenciesMessage;
            userRequest.respond(200, {});
            agenciesRequest.respond(200, fixtures.get('agenciesList'));

            agenciesService.getAgencies().catch(function (response) {
                agenciesMessage = response;
            });
            $httpBackend.resetExpectations();
            $httpBackend.flush();

            expect(agenciesMessage).toEqual('No organisation unit found on the current user');
        });
    });
});
