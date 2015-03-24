describe('Data entry directive', function () {
    var element;
    var scope;
    var userActionsServiceMock;
    var currentUserMock;

    beforeEach(module('dataentry/dataentry.html'));
    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('userActionsService', function ($q) {
            return {
                getActions: jasmine.createSpy().and.returnValue($q.when({}))
            };
        });
        $provide.factory('currentUserService', function ($q) {
            return {
                getCurrentUser: jasmine.createSpy().and.returnValue($q.when({}))
            };
        });
        $provide.factory('dataEntryService', function () {
            return {
                dataEntryRoles: {},
                reset: jasmine.createSpy('dataEntryService.reset')
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        var $rootScope = $injector.get('$rootScope');
        userActionsServiceMock = $injector.get('userActionsService');
        currentUserMock = $injector.get('currentUserService');

        element = angular.element('<um-data-entry user="user"></um-data-entry>');
        scope = $rootScope.$new();
        scope.user = {
            userType: {
                name: 'Agency'
            }
        };

        $compile(element)(scope);
        $rootScope.$digest();
    }));

    it('should compile', function () {
        expect(element[0].classList.contains('checkbox-group')).toEqual(true);
    });

    describe('initialise', function () {
        it('should call the userActionsService for the actions', function () {
            expect(userActionsServiceMock.getActions).toHaveBeenCalled();
        });

        it('should call the currentUserService for the currentUser', function () {
            expect(currentUserMock.getCurrentUser).toHaveBeenCalled();
        });
    });

    describe('display of data entry', function () {
        it('', function () {

        });
    });
});
