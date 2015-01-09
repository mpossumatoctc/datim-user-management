describe('Agencies service', function () {
    var errorHandler;
    var agenciesService;
    var organisationUnit;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('$window', {alert: function () {}});
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        errorHandler.isDebugOn = true;
        spyOn(errorHandler, 'debug').and.callThrough();
        agenciesService = $injector.get('agenciesService');

        organisationUnit = {
            name: 'Rwanda'
        };
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
        var userGroupRequest;
        var cogsRequest;

        function withFakeUserGroups(expectedAgencies) {
            return {
                categoryOptionGroups: expectedAgencies.categoryOptionGroups.map(function (agency) {
                    agency.mechUserGroup = {};
                    agency.userUserGroup = {};
                    return agency;
                })
            };
        }

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            cogsRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/categoryOptionGroupSets?fields=id&filter=name:eq:Funding+Agency&paging=false')
                .respond(200, {
                    categoryOptionGroupSets: [
                        {id: 'bw8KHXzxd9i'}
                    ]
                });

            agenciesRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/categoryOptionGroupSets/bw8KHXzxd9i?fields=categoryOptionGroups&paging=false')
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
            $httpBackend.resetExpectations();
            expect(agenciesService.getAgencies()).toBeAPromiseLikeObject();
        });

        it('promise should return an array with agencies', function () {
            var agencies;
            var expectedAgencies = withFakeUserGroups(fixtures.get('agenciesList')).categoryOptionGroups;
            agenciesRequest.respond(200, withFakeUserGroups(fixtures.get('agenciesList')));

            agenciesService.getAgencies(organisationUnit).then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies).toEqual(expectedAgencies);
        });

        it('should request the userGroups for agencies', function () {
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroup'));

            agenciesService.getAgencies(organisationUnit);
            $httpBackend.flush();
        });

        it('should add the usergroups to the agency objects', function () {
            var agencies;
            var expectedAgency = {
                id: 'FPUgmtt8HRi',
                code: 'Agency_HHS/CDC',
                name: 'HHS/CDC',
                created: '2014-05-09T23:23:06.953+0000',
                lastUpdated: '2014-10-05T13:07:55.940+0000',
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

            agenciesService.getAgencies(organisationUnit).then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies[0]).toEqual(expectedAgency);
        });

        it('should not return any agencies without userUserGroup groups', function () {
            var agencies;
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroupWithoutUSAIDUserGroup'));

            agenciesService.getAgencies(organisationUnit).then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies.length).toBe(1);
            expect(agencies[0].userUserGroup.id).toBe('hjLU7Ug0vKG');
        });

        it('should not return any agencies without mechUserGroup groups', function () {
            var agencies;
            userGroupRequest.respond(200, fixtures.get('rwandaUserGroup'));

            agenciesService.getAgencies(organisationUnit).then(function (data) {
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

            agenciesService.getAgencies(organisationUnit).then(function (data) {
                agencies = data;
            });
            $httpBackend.flush();

            expect(agencies.length).toBe(2);
            expect(agencies[0].userAdminUserGroup.id).toBe('x47aP9pWYlu');
            expect(agencies[1].userAdminUserGroup).not.toBeDefined();
        });

        it('should reject the promise with a debug warning', function () {
            var catchFunction = jasmine.createSpy();
            agenciesRequest.respond(200, fixtures.get('agenciesList'));

            agenciesService.getAgencies(organisationUnit).catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
            expect(errorHandler.debug).toHaveBeenCalledWith('No agencies found in Rwanda that you can access all mechanisms for');
        });

        it('should reject the promise with the correct message on no org unit', inject(function ($rootScope) {
            var agenciesMessage;
            $httpBackend.resetExpectations();

            agenciesService.getAgencies().catch(function (response) {
                agenciesMessage = response;
            });
            $rootScope.$apply();

            expect(agenciesMessage).toEqual('No organisation unit found');
        }));

        it('should reject the promise when the cogs can not be found', function () {
            var catchFunction = jasmine.createSpy();
            $httpBackend.resetExpectations();

            cogsRequest.respond(500);
            agenciesService.getAgencies(organisationUnit).catch(catchFunction);

            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should reject the promise when only one cogs is returned', inject(function ($q) {
            var catchFunction = jasmine.createSpy();
            spyOn($q, 'reject').and.callThrough();
            $httpBackend.resetExpectations();

            cogsRequest.respond(200, {categoryOptionGroupSets: []});
            agenciesService.getAgencies(organisationUnit).catch(catchFunction);

            $httpBackend.flush();

            expect($q.reject).toHaveBeenCalledWith('None or more than one categoryOptionGroupSets found that match "Funding Agency"');
        }));
    });
});
