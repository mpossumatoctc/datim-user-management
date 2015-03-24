describe('Data entry directive', function () {
    var element;
    var scope;
    var userActionsServiceMock;
    var currentUserMock;
    var controller;

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
        $provide.factory('userUtils', function () {
            return {
                getDataEntryStreamNamesForUserType: jasmine.createSpy('getDataEntryStreamNamesForUserType').and.returnValue(['SIMS', 'SIMS Key Pops'])
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
            userType: undefined
        };

        $compile(element)(scope);
        $rootScope.$digest();

        controller = element.controller('umDataEntry');

        scope.user.userType = {
            name: 'Agency'
        };
        scope.$apply();
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
        it('should display the two sims data entry boxes', function () {
            expect(element.find('li').length).toEqual(2);

            expect(element.find('li label')[0].textContent.trim()).toBe('Data Entry SIMS');
            expect(element.find('li label')[1].textContent.trim()).toBe('Data Entry SIMS Key Pops');
        });
    });

    describe('interaction', function () {
        it('should call the updateDataEntry function when a checkbox is clicked', function () {
            spyOn(controller, 'updateDataEntry');

            element.find('li input').first().click();
            scope.$apply();

            expect(controller.updateDataEntry).toHaveBeenCalled();
        });
    });
});
