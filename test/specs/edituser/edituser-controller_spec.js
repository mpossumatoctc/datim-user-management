describe('Edit user controller', function () {
    var controller;
    var dataGroupsService;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('userToEdit', {});
        $provide.value('userLocale', {
            name: 'fr',
            code: 'fr'
        });
        $provide.factory('dataGroups', function () {
            return [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];
        });
        $provide.factory('dataGroupsService', function ($q) {
            var success = $q.when(true);

            return {
                getDataGroupsForUser: jasmine.createSpy('getDataGroupsForUser').and.returnValue(success)
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        var $rootScope = $injector.get('$rootScope');

        dataGroupsService = $injector.get('dataGroupsService');

        controller = $controller('editUserController', {
            $scope: $rootScope.$new()
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should set injected userToEdit onto the controller', function () {
        expect(controller.userToEdit).toBeDefined();
    });

    it('should set injected userLocale onto the controller', function () {
        expect(controller.user.locale).toEqual({name:'fr', code: 'fr'});
    });

    it('should ask for the datagroups for a user', function () {
        expect(dataGroupsService.getDataGroupsForUser).toHaveBeenCalled();
    });
});
