describe('Inter agency service', function () {
    var fixtures = window.fixtures;
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('interAgencyService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a method getUserGroups', function () {
        expect(service.getUserGroups).toBeDefined();
    });

    describe('getUserGroups', function () {
        var $httpBackend;
        var userGroupRequest;
        var errorHandler;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            errorHandler = $injector.get('errorHandler');
            spyOn(errorHandler, 'errorFn');

            $httpBackend.expectGET('http://localhost:8080/dhis/api/me')
                .respond(200, {
                    organisationUnits: [{name: 'Rwanda'}]
                });
            $httpBackend.expectGET('http://localhost:8080/dhis/api/me/authorization')
                .respond(200, {});

            userGroupRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:OU+Rwanda+Country+team&paging=false')
                .respond(200, fixtures.get('interAgencyGroupUsers'));
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:OU+Rwanda+user+administrators&paging=false')
                .respond(200, fixtures.get('interAgencyGroupAdmin'));
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:OU+Rwanda+all+mechanisms&paging=false')
                .respond(200, fixtures.get('interAgencyGroupMech'));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return the correct usergroups', function () {
            var userGroups;
            var expectedUserGroups = {
                userUserGroup: {
                    id: 'LqrnY1CgnCv',
                    name: 'OU Rwanda Country team'
                },
                userAdminUserGroup: {
                    id: 'sJSLgsi6KjY',
                    name: 'OU Rwanda User administrators'
                },
                mechUserGroup: {
                    id: 'OGAFubEVJK0',
                    name: 'OU Rwanda All mechanisms'
                }
            };

            service.getUserGroups().then(function (response) {
                userGroups = response;
            });
            $httpBackend.flush();

            expect(userGroups).toEqual(expectedUserGroups);
        });

        it('should log an error when one of the requests fail', function () {
            var catchFunction = jasmine.createSpy();

            userGroupRequest.respond(404);

            service.getUserGroups().catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should have called the error log', function () {
            var catchFunction = jasmine.createSpy();

            userGroupRequest.respond(404);

            service.getUserGroups().catch(catchFunction);
            $httpBackend.flush();

            expect(errorHandler.errorFn).toHaveBeenCalled();
        });
    });
});
