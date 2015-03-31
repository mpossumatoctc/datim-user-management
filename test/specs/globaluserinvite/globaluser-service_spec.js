describe('Global user service', function () {
    var fixtures = window.fixtures;
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('globalUserService');
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

            userGroupRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Global+Users&paging=false')
                .respond(200, fixtures.get('globalUserGroups'));
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Global+User+Administrators&paging=false')
                .respond(200, fixtures.get('globalAdminUserGroups'));
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Global+all+mechanisms&paging=false')
                .respond(200, fixtures.get('globalAdminMechGroups'));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return the correct usergroups', function () {
            var userGroups;
            var expectedUserGroups = {
                userUserGroup: {
                    id: 'gh9tn4QBbKZ',
                    name: 'Global Users'
                },
                userAdminUserGroup: {
                    id: 'ghYxzrKHldx',
                    name: 'Global User Administrators'
                },
                mechUserGroup: {
                    id: 'TOOIJWRzJ3g',
                    name: 'Global all mechanisms'
                }
            };

            service.getUserGroups({name: 'Rwanda'}).then(function (response) {
                userGroups = response;
            });
            $httpBackend.flush();

            expect(userGroups).toEqual(expectedUserGroups);
        });

        it('should log an error when one of the requests fail', function () {
            var catchFunction = jasmine.createSpy();

            userGroupRequest.respond(404);

            service.getUserGroups({name: 'Rwanda'}).catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should have called the error log', function () {
            var catchFunction = jasmine.createSpy();

            userGroupRequest.respond(404);

            service.getUserGroups({name: 'Rwanda'}).catch(catchFunction);
            $httpBackend.flush();

            expect(errorHandler.errorFn).toHaveBeenCalled();
        });

        it('should filter the userGroup with the correct name', function () {
            var expectedUserGroup = {name: 'Global Users'};
            var actualUserGroups;

            userGroupRequest.respond(200, {userGroups: [
                {name: 'OU Kenya Country team'},
                {name: 'OU Rwanda Country team'},
                {name: 'Some Group'},
                {name: 'Global Users'}
            ]});

            service.getUserGroups().then(function (userGroups) {
                actualUserGroups = userGroups;
            });
            $httpBackend.flush();

            expect(actualUserGroups.userUserGroup).toEqual(expectedUserGroup);
        });
    });
});
