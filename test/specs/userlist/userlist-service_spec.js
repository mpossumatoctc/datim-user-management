describe('Userlist service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('userListService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a getList method', function () {
        expect(service.getList).toBeAFunction();
    });

    it('should have a pagination object', function () {
        expect(service.pagination).toBeDefined();
    });

    describe('getList', function () {
        var $httpBackend;
        var userListRequest;
        var errorHandler;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            errorHandler = $injector.get('errorHandler');

            spyOn(errorHandler, 'errorFn');

            userListRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/users?' +
                    'fields=id,name,email,organisationUnits,userCredentials%5Bcode,disabled,userRoles%5D,userGroups' +
                    '&manage=true&page=1&pageSize=25')
                .respond(200, window.fixtures.get('usersPage1'));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should return a promise like object', function () {
            expect(service.getList()).toBeAPromiseLikeObject();
            $httpBackend.flush();
        });

        it('should set the pagination object', function () {
            service.getList();
            $httpBackend.flush();

            expect(service.pagination.getCurrentPage()).toBe(1);
        });

        it('should return a list of users from the promise', function () {
            var users;

            service.getList().then(function (response) {
                users = response;
            });
            $httpBackend.flush();

            expect(users.length).toBe(50);
        });

        it('should return an empty list if no users are available', function () {
            var users;
            userListRequest.respond(200, {});

            service.getList().then(function (response) {
                users = response;
            });
            $httpBackend.flush();

            expect(users.length).toBe(0);
        });

        it('should log an error when the request fails', function () {
            userListRequest.respond(404);

            service.getList();

            expect(errorHandler.errorFn).toHaveBeenCalledWith('Unable to get the list of users from the server');
        });

        it('should add a filter to the query', function () {
            $httpBackend.resetExpectations();
            userListRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/users?' +
                    'fields=id,name,email,organisationUnits,userCredentials%5Bcode,disabled,userRoles%5D,userGroups&filter=name:like:Mark' +
                    '&manage=true&page=1&pageSize=25')
                .respond(200, window.fixtures.get('usersPage1'));

            service.setFilter('name:like:Mark');
            service.getList();

            $httpBackend.flush();
        });
    });
});
