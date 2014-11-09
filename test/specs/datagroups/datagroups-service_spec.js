describe('DataGroupService', function () {
    var $rootScope;
    var dataGroupsService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        dataGroupsService = $injector.get('dataGroupsService');
    }));

    it('should be an object', function () {
        expect(dataGroupsService).toBeAnObject();
    });

    describe('getDataGroups', function () {
        it('should be a function', function () {
            expect(dataGroupsService.getDataGroups).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(dataGroupsService.getDataGroups()).toBeAPromiseLikeObject();
        });

        it('its promise should resolve into an array', function () {
            var dataGroups;
            var expectedDataGroups = [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];

            dataGroupsService.getDataGroups().then(function (data) {
                dataGroups = data;
            });
            $rootScope.$apply();

            expect(dataGroups).toEqual(expectedDataGroups);
        });
    });
});
