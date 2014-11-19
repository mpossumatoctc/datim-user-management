describe('User service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('userService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('getUserObject', function () {
        it('should be a function', function () {
            expect(service.getUserObject).toBeAFunction();
        });

        it('should return an empty user object', function () {
            var expectedUserObject = {
                userType: undefined,
                userEntity: undefined,
                email: undefined,
                locale: {name: 'en'},
                userActions: {},
                userGroups: [],
                userRoles: [],
                dataGroups: {}
            };

            expect(service.getUserObject()).toEqual(expectedUserObject);
        });
    });

    describe('createUserGroups', function () {
        it('should return the MER data access group name', function () {
            expect();
        });
    });

    describe('createUserInvite', function () {
        it('should be a function', function () {
            expect(service.createUserInvite).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(service.createUserInvite()).toBeAPromiseLikeObject();
        });
    });
});
