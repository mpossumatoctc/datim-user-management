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
});
