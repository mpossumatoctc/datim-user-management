describe('UserStatus Service', function () {
    var service;
    var $httpBackend;
    var $rootScope;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('userStatusService');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a disable method', function () {
        expect(service.disable).toBeAFunction();
    });

    it('should have an enable method', function () {
        expect(service.enable).toBeAFunction();
    });

    describe('disable', function () {
        var saveRequest;
        var expectedPut;
        beforeEach(function () {
            //Restangular removes the href from the object so we have to adjust the fixture
            expectedPut = window.fixtures.get('userObjectDisabled');
            delete expectedPut.href;

            saveRequest = $httpBackend.whenPUT('http://localhost:8080/dhis/api/users/Qjr59ESpRy5')
                .respond(200);
            $httpBackend.expectGET('http://localhost:8080/dhis/api/users/Qjr59ESpRy5?fields=:owner,userCredentials%5B:owner%5D')
                .respond(200, window.fixtures.get('userObjectEnabled'));
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should call for the user object', function () {
            service.disable('Qjr59ESpRy5');
            $httpBackend.flush();
        });

        it('should not call if the id does not exist', function () {
            $httpBackend.resetExpectations();
            service.disable();
        });

        it('should set the disabled flag to true and save the user object', function () {
            $httpBackend.expectPUT('http://localhost:8080/dhis/api/users/Qjr59ESpRy5', expectedPut)
                .respond(window.fixtures.get('userPutSuccess'));

            service.disable('Qjr59ESpRy5');

            $httpBackend.flush();
        });

        it('should reject the promise on a fail and log an error', function () {
            var catchFunction = jasmine.createSpy();
            saveRequest.respond(500, 'Save failed');

            service.disable('Qjr59ESpRy5')
                .catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should reject the promise when the userid is not a string', function () {
            var catchFunction = jasmine.createSpy();
            $httpBackend.resetExpectations();

            service.disable().catch(catchFunction);
            $rootScope.$apply();

            expect(catchFunction).toHaveBeenCalled();
        });
    });

    describe('enable', function () {
        var saveRequest;
        var expectedPut;
        beforeEach(function () {
            //Restangular removes the href from the object so we have to adjust the fixture
            expectedPut = window.fixtures.get('userObjectEnabled');
            delete expectedPut.href;

            saveRequest = $httpBackend.whenPUT('http://localhost:8080/dhis/api/users/Qjr59ESpRy5')
                .respond(200);
            $httpBackend.expectGET('http://localhost:8080/dhis/api/users/Qjr59ESpRy5?fields=:owner,userCredentials%5B:owner%5D')
                .respond(200, window.fixtures.get('userObjectDisabled'));
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should call for the user object', function () {
            service.enable('Qjr59ESpRy5');
            $httpBackend.flush();
        });

        it('should set the disabled flag to false and save the user object', function () {
            $httpBackend.expectPUT('http://localhost:8080/dhis/api/users/Qjr59ESpRy5', expectedPut)
                .respond(window.fixtures.get('userPutSuccess'));

            service.enable('Qjr59ESpRy5');

            $httpBackend.flush();
        });

        it('should reject the promise on a fail and log an error', function () {
            var catchFunction = jasmine.createSpy();
            saveRequest.respond(500, 'Save failed');

            service.disable('Qjr59ESpRy5')
                .catch(catchFunction);
            $httpBackend.flush();

            expect(catchFunction).toHaveBeenCalled();
        });

        it('should reject the promise when the userid is not a string', function () {
            var catchFunction = jasmine.createSpy();
            $httpBackend.resetExpectations();

            service.enable().catch(catchFunction);
            $rootScope.$apply();

            expect(catchFunction).toHaveBeenCalled();
        });
    });
});
