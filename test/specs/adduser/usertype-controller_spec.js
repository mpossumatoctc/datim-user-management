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

    it('should have a currentUserType', function () {
        expect(controller.currentUserType).toBeDefined();
    });

    describe('isAgency', function () {
        it('should be a method', function () {
            expect(controller.isAgency).toBeAFunction();
        });

        it('should return false when the usertype is partner', function () {
            controller.currentUserType = 'Partner';

            expect(controller.isAgency()).toBe(false);
        });

        it('should return when usertype is agency', function () {
            controller.currentUserType = 'Agency';

            expect(controller.isAgency()).toBe(true);
        });
    });

    describe('isPartner', function () {
        it('should be a method', function () {
            expect(controller.isPartner).toBeAFunction();
        });

        it('should return false when the usertype is agency', function () {
            controller.currentUserType = 'Agency';

            expect(controller.isPartner()).toBe(false);
        });

        it('should return true when the usertype is partner', function () {
            controller.currentUserType = 'Partner';

            expect(controller.isPartner()).toBe(true);
        });

        it('should return false on an empty string', function () {
            controller.currentUserType = '';

            expect(controller.isPartner()).toBe(false);
        });
    });

    describe('setUserType', function () {
        it('should be a function', function () {
            expect(controller.setUserType).toBeAFunction();
        });

        it('should set the userType on the controller', function () {
            controller.setUserType('Agency');

            expect(controller.currentUserType).toBe('Agency');
        });

        it('should only set the userType if that usertype exists', function () {
            controller.setUserType('Agency2');

            expect(controller.currentUserType).toBe('');
        });
    });

    describe('setUserEntity', function () {
        it('should be a function', function () {
            expect(controller.setUserEntity).toBeAFunction();
        });
    });
});
