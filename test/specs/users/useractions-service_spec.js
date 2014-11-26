describe('User actions', function () {
    var fixtures = window.fixtures;
    var userActionsService;
    var errorHandler;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        spyOn(errorHandler, 'error');

        userActionsService = $injector.get('userActionsService');
    }));

    it('should be an object', function () {
        expect(userActionsService).toBeAnObject();
    });

    it('should have an array of user actions', function () {
        expect(userActionsService.actions).toBeAnArray();
    });

    it('should have the actions set in the action array', function () {
        expect(userActionsService.actions).toEqual(fixtures.get('actionsList'));
    });

    describe('getActionsFor', function () {
        it('should return the user actions available for agencies', function () {
            var expectedActions = [
                {name: 'Accept data', userRole: 'Data Accepter'},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsFor('agency')).toEqual(expectedActions);
        });

        it('should return the user actions available for inter-agency', function () {
            var expectedActions = [
                {name: 'Data Entry', userRole: '', typeDependent: true},
                {name: 'Accept data', userRole: 'Data Accepter'},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsFor('inter-agency')).toEqual(expectedActions);
        });

        it('should return the user actions available for partners', function () {
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsFor('partner')).toEqual(expectedActions);
        });

        it('should return the read action as a default', function () {
            var expectedActions = [
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsFor()).toEqual(expectedActions);
        });

        it('should also return the correct data when called with uppercase value', function () {
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsFor('Partner')).toEqual(expectedActions);
        });
    });

    describe('loading of the userroles', function () {
        var $httpBackend;
        var userRoleRequest;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            userRoleRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userRoles?' +
                    'fields=id,name&filter=name:eq:Data+Accepter&filter=name:eq:Data+Submitter&filter=name:eq:User+Administrator&filter=name:eq:Read+Only&paging=false')
                .respond(200, fixtures.get('userRolesForActions'));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should load the userroles from the api to get the userrole IDs', function () {
            $httpBackend.flush();
        });

        it('should add the loaded userroles to the right actions', function () {
            $httpBackend.flush();

            expect(userActionsService.actions).toEqual(fixtures.get('actionsListWithRoles'));
        });

        it('should call the error function when the request fails', function () {
            userRoleRequest.respond(404);

            $httpBackend.flush();

            expect(errorHandler.error).toHaveBeenCalledWith('Failed to load user roles for actions');
            expect(errorHandler.error.calls.count()).toBe(1);
        });
    });
});
