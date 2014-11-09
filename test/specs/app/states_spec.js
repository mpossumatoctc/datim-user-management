describe('Application states', function () {
    var injector;
    var $rootScope;
    var $state;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('userTypesService', {
            getUserTypes: function () {
                return [];
            }
        });
        $provide.value('dataGroupsService', {
            getDataGroups: function () {
                return [];
            }
        });
    }));
    beforeEach(inject(function ($templateCache, $injector) {
        injector = $injector;
        $state = $injector.get('$state');
        $rootScope = $injector.get('$rootScope');
        $templateCache.put('adduser/add.html', '');
        $templateCache.put('userlist/list.html', '');
    }));

    it('should set the default state to list', function () {
        var expectedState = {
            name: 'list',
            url: '/list',
            templateUrl: 'userlist/list.html',
            controller: 'userListController as userList'
        };

        $rootScope.$apply();

        expect($state.current.name).toEqual(expectedState.name);
        expect($state.current.url).toEqual(expectedState.url);
        expect($state.current.templateUrl).toEqual(expectedState.templateUrl);
        expect($state.current.controller).toEqual(expectedState.controller);
    });

    it('should change the state to add user', function () {
        var expectedState = {
            name: 'add',
            url: '/add',
            templateUrl: 'adduser/add.html',
            controller: 'addUserController as addUser'
        };

        $state.go('add');
        $rootScope.$apply();

        expect($state.current.name).toEqual(expectedState.name);
        expect($state.current.url).toEqual(expectedState.url);
        expect($state.current.templateUrl).toEqual(expectedState.templateUrl);
        expect($state.current.controller).toEqual(expectedState.controller);
    });

    it('should correctly resolve the add user userTypes', function () {
        $state.go('add');
        $rootScope.$apply();

        expect(injector.invoke($state.current.resolve.userTypes)).toEqual([]);
    });

    it('should correctly resolve the add user dataGroups', function () {
        $state.go('add');
        $rootScope.$apply();

        expect(injector.invoke($state.current.resolve.dataGroups)).toEqual([]);
    });
});
