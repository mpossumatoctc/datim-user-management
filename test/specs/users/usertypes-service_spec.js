describe('userTypesService', function () {
    var $rootScope;
    var userTypesService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        userTypesService = $injector.get('userTypesService');
    }));

    it('should be an object', function () {
        expect(userTypesService).toBeAnObject();
    });

    describe('getUserTypes', function () {
        it('should be a function', function () {
            expect(userTypesService.getUserTypes).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(userTypesService.getUserTypes()).toBeAPromiseLikeObject();
        });

        it('should return an array when the promised is resolved', function () {
            var userTypes;
            var expectedUserTypes = [
                {name: 'Inter-Agency'},
                {name: 'Agency'},
                {name: 'Partner'}
            ];

            userTypesService.getUserTypes().then(function (data) {
                userTypes = data;
            });

            $rootScope.$apply();
            expect(userTypes).toEqual(expectedUserTypes);
        });
    });

    describe('getUserType', function () {
        it('should be a function', function () {
            expect(userTypesService.getUserType).toBeAFunction();
        });

        it('should return usertype partner', function () {
            var user = window.fixtures.get('userGroupsRoles');

            expect(userTypesService.getUserType(user)).toBe('Partner');
        });

        it('should return usertype Inter-Agency instead of country', function () {
            var user = window.fixtures.get('userObjectDisabled');

            expect(userTypesService.getUserType(user)).toBe('Inter-Agency');
        });

        it('should return Unknown type if the type cannot be determined', function () {
            expect(userTypesService.getUserType({})).toBe('Unknown type');
        });

        it('should return Unknown type if the type cannot be determined', function () {
            var otherUserType = {userGroups: [{name: 'OU Rwanda Admin users'}]};

            expect(userTypesService.getUserType(otherUserType)).toBe('Unknown type');
        });
    });
});
