describe('Userlist controller', function () { //jshint ignore:line
    var controller;
    var userStatusServiceMockFactory;
    var userStatusService;
    var errorHandler;
    var $rootScope;
    var dataGroupsService;
    var userListService;
    var userActions;
    var userTypesServiceMock;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        userStatusServiceMockFactory = function ($q) {
            var success = $q.when(window.fixtures.get('userPutSuccess'));
            var failure = $q.reject('Failed');

            return {
                enable: jasmine.createSpy().and.returnValue(success),
                disable: jasmine.createSpy().and.returnValue(success),
                SETTOFAIL: function () {
                    this.enable = jasmine.createSpy().and.returnValue(failure);
                    this.disable = jasmine.createSpy().and.returnValue(failure);
                }
            };
        };

        userTypesServiceMock = {
            getUserType: jasmine.createSpy('userTypesService.getUserType')
                .and.returnValue('Partner')
        };

        $provide.value('userFilter', [
            {name: 'Name'},
            {name: 'Username'},
            {name: 'E-Mail'},
            {name: 'Roles'},
            {name: 'User Groups'},
            {name: 'Organisation Unit'},
            {name: 'Types', secondary: [
                {name: 'Inter-Agency'},
                {name: 'Agency'},
                {name: 'Partner'}
            ]}
        ]);
        $provide.factory('dataGroupsService', function ($q) {
            var success = $q.when(window.fixtures.get('dataStreamAccess'));
            var failure = $q.reject('Failed');
            return {
                getDataGroupsForUser: jasmine.createSpy().and.returnValue(success),
                SETTOFAIL: function () {
                    this.getDataGroupsForUser = jasmine.createSpy().and.returnValue(failure);
                }
            };

        });
        $provide.factory('userListService', function (paginationService, $q) {
            var success = $q.when(window.fixtures.get('usersPage1').users);
            var failure = $q.reject('Failed to load userlist');

            return {
                getList: jasmine.createSpy().and.returnValue(success),
                pagination: paginationService,
                SETTOFAIL: function () {
                    this.getList = jasmine.createSpy().and.returnValue(failure);
                },
                removeFilter: jasmine.createSpy('removeFilter'),
                resetFilters: jasmine.createSpy('resetFilters'),
                getFilters: jasmine.createSpy('getFilters').and.returnValue([]),
                getCSVUrl: jasmine.createSpy('getCSVUrl').and.returnValue('')
            };
        });
        $provide.factory('userActions', function ($q) {
            return {
                actions: [
                    {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
                    {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                    {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
                    {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
                ],
                getActionsForUserType: jasmine.createSpy('getActionsForUserType').and.returnValue(
                    [{name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}]
                ),
                getActionsForUser: jasmine.createSpy('getActionsForUser')
                    .and.returnValue($q.when([
                        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                        {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
                        {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
                    ])),
                getUserRolesForUser: jasmine.createSpy('getUserRolesForUser'),
                combineSelectedUserRolesWithExisting: jasmine.createSpy('combineSelectedUserRolesWithExisting'),
                getDataEntryRestrictionDataGroups: jasmine.createSpy('getDataEntryRestrictionDataGroups')
                    .and.returnValue(['SI', 'EA'])
            };
        });
        $provide.factory('userStatusService', userStatusServiceMockFactory);
        $provide.factory('errorHandler', function () {
            return {
                error: jasmine.createSpy(),
                warning: jasmine.createSpy(),
                errorFn: jasmine.createSpy(),
                debug: jasmine.createSpy()
            };
        });

        $provide.factory('$state', function () {
            return {
                go: jasmine.createSpy()
            };
        });

        $provide.factory('currentUser', function () {
            return {
                id: 'd234fsdfss',
                hasAllAuthority: jasmine.createSpy('hasAllAuthority').and.returnValue(false),
                isUserAdministrator: jasmine.createSpy('isUserAdministrator').and.returnValue(true)
            };
        });

        $provide.value('dataGroups', {});
        $provide.value('userToEdit', {});
        $provide.value('userLocale', {});

        $provide.factory('userTypesService', function () {
            return userTypesServiceMock;
        });
    }));

    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');

        userStatusService = $injector.get('userStatusService');
        dataGroupsService = $injector.get('dataGroupsService');
        userListService = $injector.get('userListService');
        userActions = $injector.get('userActions');
        errorHandler = $injector.get('errorHandler');
        $rootScope = $injector.get('$rootScope');

        controller = $controller('userListController', {
            $scope: $rootScope.$new()
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should have a property for the userList', function () {
        expect(controller.users).toBeDefined();
    });

    it('should call getlist on the userservice', function () {
        expect(userListService.getList).toHaveBeenCalled();
    });

    it('should set the initial userlist onto the controller', function () {
        $rootScope.$apply();
        expect(controller.users).toBeAnArray();
        expect(controller.users.length).toBe(50);
    });

    it('should set list loading to false when the userlist fails', function () {
        userListService.SETTOFAIL();
        $rootScope.$apply();

        expect(controller.listIsLoading).toBe(false);
    });

    it('should have a pagination object', function () {
        expect(controller.pagination).toBeAnObject();
    });

    it('should have a currentPage property', function () {
        expect(controller.currentPage).toBe(1);
    });

    it('should have a pageChanged function', function () {
        expect(controller.pageChanged).toBeAFunction();
    });

    it('should have a processing property', function () {
        expect(controller.processing).toBeAnObject();
    });

    it('should have a showDetails method', function () {
        expect(controller.showDetails).toBeAFunction();
    });

    it('should have a detailsOpen property', function () {
        expect(controller.detailsOpen).toBe(false);
    });

    it('should have a detailsUserDataGroups property', function () {
        expect(controller.detailsUserDataGroups).toBeDefined();
    });

    it('should have a property detailsUserUserType', function () {
        expect(controller.detailsUserUserType).toBeDefined();
    });

    it('should have a property detailsUserAction', function () {
        expect(controller.detailsUserActions).toBeDefined();
    });

    it('should redirect on no access', inject(function ($rootScope, $controller, currentUser, $state) {
        currentUser.isUserAdministrator.and.returnValue(false);

        $controller('editUserController', {
            $scope: $rootScope.$new()
        });

        expect($state.go).toHaveBeenCalledWith('noaccess', {message: 'Your user account does not seem to have the authorities to access this functionality.'});
    }));

    describe('deactivateUser', function () {
        it('should be a method', function () {
            expect(controller.deactivateUser).toBeAFunction();
        });

        it('should add the user id to processing and set it to true', function () {
            controller.deactivateUser({id: 'njG5yURaHwX'});

            expect(controller.processing.njG5yURaHwX).toBe(true);
        });

        it('should call disable on the userstatus service', function () {
            controller.deactivateUser({id: 'njG5yURaHwX'});

            expect(userStatusService.disable).toHaveBeenCalledWith('njG5yURaHwX');
        });

        it('should set the user to disabled', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            controller.deactivateUser(user);
            $rootScope.$apply();

            expect(user.userCredentials.disabled).toBe(true);
        });

        it('should set processing to false when request is completed', function () {
            controller.deactivateUser({id: 'njG5yURaHwX', userCredentials: {}});
            $rootScope.$apply();

            expect(controller.processing.njG5yURaHwX).toBe(false);
        });

        it('should set processing to false when the request fails', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            var expectedUser = angular.copy(user);
            userStatusService.SETTOFAIL(true);

            controller.deactivateUser(user);
            $rootScope.$apply();

            expect(user).toEqual(expectedUser);
            expect(controller.processing.njG5yURaHwX).toBe(false);
        });

        it('should call notify when user disable failed', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            userStatusService.SETTOFAIL(true);

            controller.deactivateUser(user);
            $rootScope.$apply();

            expect(errorHandler.error).toHaveBeenCalled();
        });
    });

    describe('activateUser', function () {
        it('should be a method', function () {
            expect(controller.activateUser).toBeAFunction();
        });

        it('should add the user id to processing and set it to true', function () {
            controller.activateUser({id: 'njG5yURaHwX'});

            expect(controller.processing.njG5yURaHwX).toBe(true);
        });

        it('should call enable on the userstatus service', function () {
            controller.activateUser({id: 'njG5yURaHwX'});

            expect(userStatusService.enable).toHaveBeenCalledWith('njG5yURaHwX');
        });

        it('should set the user to enabled', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            controller.activateUser(user);
            $rootScope.$apply();

            expect(user.userCredentials.disabled).toBe(false);
        });

        it('should set processing to false when request is completed', function () {
            controller.activateUser({id: 'njG5yURaHwX', userCredentials: {}});
            $rootScope.$apply();

            expect(controller.processing.njG5yURaHwX).toBe(false);
        });

        it('should set processing to false when the request fails', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            var expectedUser = angular.copy(user);
            userStatusService.SETTOFAIL(true);

            controller.activateUser(user);
            $rootScope.$apply();

            expect(user).toEqual(expectedUser);
            expect(controller.processing.njG5yURaHwX).toBe(false);
        });

        it('should call notify when user enable failed', function () {
            var user = {id: 'njG5yURaHwX', userCredentials: {}};
            userStatusService.SETTOFAIL(true);

            controller.activateUser(user);
            $rootScope.$apply();

            expect(errorHandler.error).toHaveBeenCalled();
        });
    });

    describe('showDetails', function () {
        var user;

        beforeEach(function () {
            user = window.fixtures.get('usersPage1').users[0];
        });

        it('should set the user to be used for details into the detailsUser', function () {
            controller.showDetails(user);

            expect(controller.detailsUser).toBe(user);
        });

        it('should set detailsOpen to true', function () {
            controller.showDetails(user);

            expect(controller.detailsOpen).toBe(true);
        });

        it('should set detailsOpen to false when the user is the same', function () {
            controller.showDetails(user);
            controller.showDetails(user);

            expect(controller.detailsOpen).toBe(false);
        });

        it('should not set detailsOpen to false if the user is different', function () {
            controller.showDetails(user);
            controller.showDetails({});

            expect(controller.detailsOpen).toBe(true);
        });

        it('should set detailsUser to undefined if the user is the same', function () {
            controller.showDetails(user);
            controller.showDetails(user);

            expect(controller.detailsUser).not.toBeDefined();
        });

        it('should call getDataStreamsForUser', function () {
            spyOn(controller, 'getDataGroupsForUser');

            controller.showDetails(user);

            expect(controller.getDataGroupsForUser).toHaveBeenCalled();
        });

        it('should set the detailsUserUserType', function () {
            controller.showDetails(window.fixtures.get('userGroupsRoles'));

            expect(controller.detailsUserUserType).toBe('Partner');
        });

        it('should call the service for the userActions', function () {
            controller.showDetails(window.fixtures.get('userGroupsRoles'));

            expect(userActions.getActionsForUser).toHaveBeenCalledWith(window.fixtures.get('userGroupsRoles'));
        });

        it('should set the detailsUserActions', function () {
            controller.showDetails(window.fixtures.get('userGroupsRoles'));
            $rootScope.$apply();

            expect(controller.detailsUserActions.length).toBe(3);
        });
    });

    describe('getDataGroupsForUser', function () {
        var user;
        var expectedDataStreams;

        beforeEach(function () {
            user = window.fixtures.get('usersPage1').users[0];
            expectedDataStreams = window.fixtures.get('dataStreamAccess');
        });

        it('should call getDataGroupsForUser', function () {
            controller.showDetails(user);

            expect(dataGroupsService.getDataGroupsForUser).toHaveBeenCalled();
        });

        it('should set the detailsUserDataGroups', function () {
            controller.showDetails(user);
            $rootScope.$apply();

            expect(controller.detailsUserDataGroups).toEqual(expectedDataStreams);
        });

        it('should call warning when fails', function () {
            dataGroupsService.SETTOFAIL();

            controller.showDetails(user);
            $rootScope.$apply();

            expect(errorHandler.warning).toHaveBeenCalled();
        });
    });

    describe('isDetailsUser', function () {
        var user;

        beforeEach(function () {
            user = window.fixtures.get('usersPage1').users[0];
            controller.showDetails(user);
        });

        it('should return true if the passed user is the details user', function () {
            expect(controller.isDetailsUser(user)).toBe(true);
        });

        it('should return false if the passed user is not the details user', function () {
            var user = window.fixtures.get('usersPage1').users[1];

            expect(controller.isDetailsUser(user)).toBe(false);
        });

        it('should return false if the detailsUser is undefined', function () {
            controller.showDetails(user);

            expect(controller.isDetailsUser(user)).toBe(false);
        });
    });

    describe('search', function () {
        it('should be defined', function () {
            expect(controller.search).toBeDefined();
        });

        it('should have search options', function () {
            expect(controller.search.options).toEqual([
                {name: 'Name'},
                {name: 'Username'},
                {name: 'E-Mail'},
                {name: 'Roles'},
                {name: 'User Groups'},
                {name: 'Organisation Unit'},
                {name: 'Types', secondary: [
                    {name: 'Inter-Agency'},
                    {name: 'Agency'},
                    {name: 'Partner'}
                ]}
            ]);
        });

        it('should have a search method', function () {
            expect(controller.search.doSearch).toBeAFunction();
        });
    });

    describe('pageChanged', function () {
        it('should reload the list when the page has changed', function () {
            controller.pageChanged();

            expect(userListService.getList).toHaveBeenCalled();
        });

        it('should call setCurrentPage on the pagination service', function () {
            spyOn(userListService.pagination, 'setCurrentPage');

            controller.currentPage = 4;
            controller.pageChanged();

            expect(userListService.pagination.setCurrentPage).toHaveBeenCalledWith(4);
        });
    });

    describe('isProcessing', function () {
        it('should return false when an id is not processing', function () {
            expect(controller.isProcessing('ab1234')).toBe(false);
        });

        it('should return true when an id is processing', function () {
            controller.processing.ab1234 = true;

            expect(controller.isProcessing('ab1234')).toBe(true);
        });

        it('should return false when the id is present in the processing list but false', function () {
            controller.processing.ab1234 = false;

            expect(controller.isProcessing('ab1234')).toBe(false);
        });
    });

    describe('editUser', function () {
        var $state;

        beforeEach(inject(function ($injector) {
            $state = $injector.get('$state');
        }));

        it('should be a function', function () {
            expect(controller.editUser).toBeAFunction();
        });

        it('should call $state.go', function () {
            controller.editUser({id: 'stuff', userCredentials: {username: 'markpo'}});

            expect($state.go).toHaveBeenCalled();
        });
    });

    describe('addFilter', function () {

        it('should add a filter to the activeFilters', function () {
            controller.search.activeFilters = [];

            controller.addFilter();

            expect(controller.search.activeFilters.length).toBe(1);
        });

        it('should add a filter with empty properties to the filter list', function () {
            var addedFilter;
            controller.search.activeFilters = [];

            controller.addFilter();
            addedFilter = controller.search.activeFilters[0];

            expect(addedFilter.id).toBeDefined();
            expect(addedFilter.type).not.toBeDefined();
            expect(addedFilter.value).not.toBeDefined();
            expect(addedFilter.comparator).toEqual('like');
        });
    });

    describe('resetFilters', function () {

        it('should reset  the filter list', function () {
            controller.search.activeFilters = [];

            controller.addFilter();
            controller.addFilter();
            controller.addFilter();

            controller.resetFilters();
            expect(controller.search.activeFilters.length).toBe(1);
        });

        it('should add a default filter back to the list', function () {
            controller.search.activeFilters = [];

            controller.resetFilters();

            expect(controller.search.activeFilters.length).toBe(1);
        });
    });

    describe('removeFilter', function () {

        beforeEach(function () {
            controller.search.activeFilters = [];

            controller.addFilter();
            controller.addFilter();
            controller.addFilter();

            controller.search.activeFilters[0].type = 'name';
            controller.search.activeFilters[1].type = 'roles';
            controller.search.activeFilters[2].type = 'email';

            spyOn(controller, 'doSearch');
        });

        it('should remove a filter from the list', function () {
            controller.removeFilter();

            expect(controller.search.activeFilters.length).toBe(2);
        });

        it('should remove the correct filter from the list', function () {
            controller.removeFilter(1);

            expect(controller.search.activeFilters[0].type).toEqual('name');
            expect(controller.search.activeFilters[1].type).toEqual('email');
        });
    });

    describe('default filter', function () {
        it('should be set', function () {
            expect(controller.search.activeFilters.length).toBe(1);
        });

        it('should be a name filter', function () {
            expect(controller.search.activeFilters[0].type).toEqual({name: 'Name'});
        });
    });

    describe('canEditUser', function () {
        it('should return true for any user not the current user', function () {
            expect(controller.canEditUser({id: 'df33fssss'})).toBe(true);
        });

        it('should return false when the user is the currentuser', function () {
            expect(controller.canEditUser({id: 'd234fsdfss'})).toBe(false);
        });

        it('should not be able to edit when no id is passed', function () {
            expect(controller.canEditUser({})).toBe(false);
        });

        it('should return false when the user is of type Unknown Type', function () {
            userTypesServiceMock.getUserType.and.returnValue('Unknown type');

            expect(controller.canEditUser({id: 'df33fssss'})).toBe(false);
        });
    });

    describe('getCSVUrl', function () {
        it('should call the userListService for the csv url', function () {
            controller.getCSVUrl();

            expect(userListService.getCSVUrl).toHaveBeenCalled();
        });
    });
});
