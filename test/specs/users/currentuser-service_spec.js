describe('Current user', function () {
    var fixtures = window.fixtures;
    var service;
    var $httpBackend;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('currentUserService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('api calls', function () {
        var userResponse;
        var authorizationResponse;
        var currentUser;
        var expectedUser;

        beforeEach(inject(function ($injector) {
            expectedUser = fixtures.get('currentUser');

            $httpBackend = $injector.get('$httpBackend');
            userResponse = $httpBackend.expectGET('http://localhost:8080/dhis/api/me')
                .respond(200, fixtures.get('currentUser'));
            authorizationResponse = $httpBackend.expectGET('http://localhost:8080/dhis/api/me/authorization')
                .respond(200, fixtures.get('currentUserAuthorities'));

            service.getCurrentUser().then(function (currentUserResponse) {
                currentUser = currentUserResponse;
            });
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should call the api for the currentUser data', function () {
            $httpBackend.flush();
        });

        it('should return the correct userdata', function () {
            $httpBackend.flush();

            expect(currentUser.name).toEqual(expectedUser.name);
        });

        describe('method hasAllAuthority', function () {
            it('should be defined on the currentUser', function () {
                $httpBackend.flush();

                expect(currentUser.hasAllAuthority).toBeAFunction();
            });

            it('should return false when user does not have the ALL authority', function () {
                $httpBackend.flush();
                expect(currentUser.hasAllAuthority()).toBe(false);
            });

            it('should return true when user has the ALL authority', function () {
                authorizationResponse.respond(200, ['ALL']);
                $httpBackend.flush();
                expect(currentUser.hasAllAuthority()).toBe(true);
            });
        });

        describe('method hasUserRole', function () {
            it('should be defined on the currentUser', function () {
                $httpBackend.flush();
                expect(currentUser.hasUserRole).toBeAFunction();
            });

            it('should return true when the user has the given role', function () {
                $httpBackend.flush();
                expect(currentUser.hasUserRole('Read Only')).toBe(true);
            });

            it('should return false when the user does not have the given role', function () {
                $httpBackend.flush();
                expect(currentUser.hasUserRole('Data Entry SIMS')).toBe(false);
            });

            it('should return false when a user does not have any roles', function () {
                var userResponseWithoutGroups = fixtures.get('currentUser');
                userResponseWithoutGroups.userCredentials.userRoles = undefined;
                userResponse.respond(200, userResponseWithoutGroups);

                $httpBackend.flush();

                expect(currentUser.hasUserRole('Read Only')).toBe(false);
            });
        });

        describe('isUserAdministrator', function () {
            beforeEach(function () {
                $httpBackend.flush();
                spyOn(currentUser, 'hasUserRole');
            });

            it('should call hasUserRole with the user admin role', function () {
                currentUser.isUserAdministrator();

                expect(currentUser.hasUserRole).toHaveBeenCalledWith('User Administrator');
            });
        });

        describe('error handling', function () {
            var errorHandler;

            beforeEach(inject(function ($injector) {
                errorHandler = $injector.get('errorHandler');

                spyOn(errorHandler, 'error');
            }));

            it('should call the error method on the error handler when the request fails', function () {
                userResponse.respond(404);
                $httpBackend.flush();

                expect(errorHandler.error).toHaveBeenCalled();
                expect(errorHandler.error).toHaveBeenCalledWith('Failed to load the current user data');
            });
        });
    });

    describe('getCurrentUser', function () {
        it('should be a method', function () {
            expect(service.getCurrentUser).toBeAFunction();
        });

        it('should return a promise', function () {
            expect(service.getCurrentUser()).toBeAPromiseLikeObject();
        });
    });
});
