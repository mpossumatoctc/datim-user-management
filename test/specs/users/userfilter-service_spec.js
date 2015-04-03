describe('UserFilter service', function () {
    var service;
    var userTypesService;
    var currentUserMock;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('userTypesService', function ($q) {
            var success = $q.when([{name: 'Inter-Agency'}, {name: 'Agency'}, {name: 'Partner'}]);
            return {
                getUserTypes: jasmine.createSpy().and.returnValue(success)
            };
        });
        $provide.factory('organisationUnitService', function ($q) {
            var success = $q.when([
                {name: 'Rwanda'}
            ]);
            return {
                getOrganisationUnitsForLevel: jasmine.createSpy().and.returnValue(success)
            };
        });

        currentUserMock = {
            userCredentials: {
                userRoles: [{name: 'Data Entry SI'}]
            },
            userGroups: [{name: 'Data SI access'}]
        };

        $provide.factory('currentUserService', function ($q) {
            return {
                getCurrentUser: jasmine.createSpy()
                    .and.returnValue($q.when(currentUserMock))
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
                {name: 'Types', secondary: [{name: 'Inter-Agency'}, {name: 'Agency'}, {name: 'Partner'}]},
                {name: 'Organisation Unit', secondary: [{name: 'Rwanda'}]},
                {name: 'User Role', secondary: [{name: 'Data Entry SI'}]},
                {name: 'User Group', secondary: [{name: 'Data SI access'}]}
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

        it('should not return the user role filter if the user does not have any roles', function () {
            var filters;
            var expectedFiltersWithoutUserRole;

            currentUserMock.userCredentials.userRoles = [];

            service.getUserFilter().then(function (response) {
                filters = response;
            });
            $rootScope.$apply();

            expectedFiltersWithoutUserRole = expectedFilters.slice(0, 5)
                .concat([expectedFilters.reverse()[0]]);

            expect(filters).toEqual(expectedFiltersWithoutUserRole);
        });

        it('should not return the user group filter if the user does not have any groups', function () {
            var filters;
            var expectedFiltersWithoutUserGroup;

            currentUserMock.userGroups = [];

            service.getUserFilter().then(function (response) {
                filters = response;
            });
            $rootScope.$apply();

            expectedFiltersWithoutUserGroup = expectedFilters.slice(0, 6);

            expect(filters).toEqual(expectedFiltersWithoutUserGroup);
        });
    });
});
