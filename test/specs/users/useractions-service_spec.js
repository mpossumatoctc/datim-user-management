describe('User actions', function () {
    var fixtures = window.fixtures;
    var userActionsService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
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

    it('should return the user actions available for agencies', function () {
        var expectedActions = [
            {name: 'Accept data', userGroup: 'Data accepter'},
            {name: 'Submit data', userGroup: 'Data submitter'},
            {name: 'Manage users', userGroup: 'User administrator'},
            {name: 'Read data', userGroup: 'Data reader', default: true}
        ];

        expect(userActionsService.getActionsFor('agency')).toEqual(expectedActions);
    });

    it('should return the user actions available for inter-agency', function () {
        var expectedActions = [
            {name: 'Capture inter-agency data', userGroup: '', typeDependent: true},
            {name: 'Accept data', userGroup: 'Data accepter'},
            {name: 'Submit data', userGroup: 'Data submitter'},
            {name: 'Manage users', userGroup: 'User administrator'},
            {name: 'Read data', userGroup: 'Data reader', default: true}
        ];

        expect(userActionsService.getActionsFor('inter-agency')).toEqual(expectedActions);
    });

    it('should return the user actions available for partners', function () {
        var expectedActions = [
            {name: 'Capture data', userGroup: '', typeDependent: true},
            {name: 'Submit data', userGroup: 'Data submitter'},
            {name: 'Manage users', userGroup: 'User administrator'},
            {name: 'Read data', userGroup: 'Data reader', default: true}
        ];

        expect(userActionsService.getActionsFor('partner')).toEqual(expectedActions);
    });

    it('should return the read action as a default', function () {
        var expectedActions = [
            {name: 'Read data', userGroup: 'Data reader', default: true}
        ];

        expect(userActionsService.getActionsFor()).toEqual(expectedActions);
    });

    it('should also return the correct data when called with uppercase value', function () {
        var expectedActions = [
            {name: 'Capture data', userGroup: '', typeDependent: true},
            {name: 'Submit data', userGroup: 'Data submitter'},
            {name: 'Manage users', userGroup: 'User administrator'},
            {name: 'Read data', userGroup: 'Data reader', default: true}
        ];

        expect(userActionsService.getActionsFor('Partner')).toEqual(expectedActions);
    });
});
