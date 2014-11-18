describe('Usertype controller', function () {
    var controller;
    var scope;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        var $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();
        scope.userTypes = [
            {name: 'Agency'}
        ];
        scope.user = {};

        controller = $controller('userTypeController', {
            $scope: scope
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should have a userTypes property', function () {
        expect(controller.userTypes).toBeDefined();
    });

    it('should link usertypes to scope.userTypes', function () {
        expect(controller.userTypes).toBe(scope.userTypes);
    });

    it('should update userTypes when the scope.userTypes updates', function () {
        scope.userTypes.push({
            name: 'Partner'
        });

        expect(controller.userTypes.length).toBe(2);
        expect(controller.userTypes).toBe(scope.userTypes);
    });

    describe('isAgency', function () {
        it('should be a method', function () {
            expect(controller.isAgency).toBeAFunction();
        });

        it('should return false when the usertype is partner', function () {
            scope.user.userType = {name: 'Partner'};

            expect(controller.isAgency()).toBe(false);
        });

        it('should return when usertype is agency', function () {
            scope.user.userType = {name: 'Agency'};

            expect(controller.isAgency()).toBe(true);
        });
    });

    describe('isPartner', function () {
        it('should be a method', function () {
            expect(controller.isPartner).toBeAFunction();
        });

        it('should return false when the usertype is agency', function () {
            scope.user.userType = {name: 'Agency'};

            expect(controller.isPartner()).toBe(false);
        });

        it('should return true when the usertype is partner', function () {
            scope.user.userType = {name: 'Partner'};

            expect(controller.isPartner()).toBe(true);
        });

        it('should return false on an empty string', function () {
            scope.user.userType = '';

            expect(controller.isPartner()).toBe(false);
        });
    });

    describe('userType watch', function () {
        it('should reset userEntity to undefined when userType is interAgency', function () {
            scope.user.userEntity = 'Abt';

            scope.user.userType = 'Inter-Agency';
            scope.$apply();

            expect(scope.user.userEntity).not.toBeDefined();
        });
    });
});
