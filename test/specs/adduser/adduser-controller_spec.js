describe('Add user controller', function () {
    var scope;

    beforeEach(module('PEPFAR.usermanagement'));

    describe('basic structure', function () {
        var controller;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: undefined
            });
        }));

        it('should be an object', function () {
            expect(controller).toBeAnObject();
        });

        it('should have the correct title', function () {
            expect(controller.title).toBe('Add or delete user');
        });

        it('should have an array for user types', function () {
            expect(scope.userTypes).toEqual([]);
        });

        it('should have an array for "data streams"', function () {
            expect(controller.dataGroups).toEqual([]);
        });

        it('should have an array for actions', function () {
            expect(controller.actions).toEqual([]);
        });

        it('should have an array for languages', function () {
            expect(controller.languages).toEqual([]);
        });
    });

    describe('load data into the controller through injectables', function () {
        var controller;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [
                    {name: 'Inter-Agency'},
                    {name: 'Agency'},
                    {name: 'Partner'}
                ],
                dataGroups: [
                    {name: 'MER'},
                    {name: 'EA'},
                    {name: 'SIMS'}
                ]
            });
        }));

        it('should add the loaded usertypes', function () {
            var expectedUsertypes = [
                {name: 'Inter-Agency'},
                {name: 'Agency'},
                {name: 'Partner'}
            ];

            expect(scope.userTypes).toEqual(expectedUsertypes);
        });

        it('should add the loaded datagroups', function () {
            var expectedDataGroups = [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];

            expect(controller.dataGroups).toEqual(expectedDataGroups);
        });
    });
});
