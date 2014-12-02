describe('Userlist service', function () {
    var service;
    var userTypesService;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('userTypesService', function ($q) {
            var success = $q.when([{name: 'Inter-Agency'}, {name: 'Agency'}, {name: 'Partner'}]);
            return {
                getUserTypes: jasmine.createSpy().and.returnValue(success)
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        userTypesService = $injector.get('userTypesService');
        service = $injector.get('userFilterService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a getUserFilter method', function () {
        expect(service.getUserFilter).toBeAFunction();
    });

    describe('getUserFilter', function () {
        var $rootScope;
        var expectedFilters;

        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            service = $injector.get('userFilterService');

            expectedFilters = [
                {name: 'Name'},
                {name: 'Username'},
                {name: 'E-Mail'},
                {name: 'Roles'},
                {name: 'User Groups'},
                {name: 'Organisation Unit'},
                {name: 'Types', secondary: [{name: 'Inter-Agency'}, {name: 'Agency'}, {name: 'Partner'}]}
            ];
        }));

        it('should return the user filters', function () {
            var filters;

            service.getUserFilter().then(function (response) {
                filters = response;
            });
            $rootScope.$apply();

            expect(userTypesService.getUserTypes).toHaveBeenCalled();
            expect(filters).toEqual(expectedFilters);
        });
    });
});
