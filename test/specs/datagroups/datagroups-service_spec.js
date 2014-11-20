describe('DataGroupService', function () {
    var fixtures = window.fixtures;
    var $rootScope;
    var dataGroupsService;
    var errorHandler;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');

        errorHandler = $injector.get('errorHandler');
        spyOn(errorHandler, 'error');

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

        describe('responses', function () {
            var $httpBackend;
            var userGroupRequest;
            var userRoleRequest;
            var currentUserRequest;
            var currentUserAuthoritiesRequest;

            beforeEach(inject(function ($injector) {
                var currentUserResponse = fixtures.get('currentUser');
                currentUserResponse.groups = [
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ];

                $httpBackend = $injector.get('$httpBackend');

                userGroupRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userGroups?fields=id,name&filter=name:like:Data&paging=false')
                    .respond(200, fixtures.get('userGroups'));
                userRoleRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userRoles?' +
                        'fields=id,name&filter=name:eq:Data+Entry+SI&filter=name:eq:Data+Entry+EA&filter=name:eq:Data+Entry+SIMS&paging=false')
                    .respond(200, fixtures.get('userRoles'));

                currentUserRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/me')
                    .respond(200, currentUserResponse);
                currentUserAuthoritiesRequest = $httpBackend.whenGET('http://localhost:8080/dhis/api/me/authorization')
                    .respond(200, fixtures.get('currentUserAuthorities'));
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('its promise should resolve into an array', function () {
                var dataGroups;

                dataGroupsService.getDataGroups().then(function (data) {
                    dataGroups = data;
                });
                $httpBackend.flush();

                expect(dataGroups).toBeAnArray();
            });

            it('its promise should resolve into an array', function () {
                var dataGroups;
                var expectedDataGroups = [
                    {
                        name: 'SI',
                        userGroups: [
                            {name: 'Data SI access', id: 'c6hGi8GEZot'}
                        ],
                        userRoles: [
                            {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
                        ]
                    }, {
                        name: 'EA',
                        userGroups: [
                            {name: 'Data EA access', id: 'YbkldVOJMUl'}
                        ],
                        userRoles: [
                            {name: 'Data Entry EA', id: 'OKKx4bf4ueV'}
                        ]
                    }, {
                        name: 'SIMS',
                        userGroups: [
                            {name: 'Data SIMS access', id: 'iuD8wUFz95X'}
                        ],
                        userRoles: [
                            {name: 'Data Entry SIMS', id: 'iXkZzRKD0i4'}
                        ]
                    }
                ];

                dataGroupsService.getDataGroups().then(function (data) {
                    dataGroups = data;
                });
                $httpBackend.flush();

                expect(dataGroups).toEqual(expectedDataGroups);
            });

            it('should call the error function when the request fails', function () {
                userGroupRequest.respond(404);
                userRoleRequest.respond(404);

                dataGroupsService.getDataGroups();
                $httpBackend.flush();

                expect(errorHandler.error).toHaveBeenCalledWith('Failed to load the usergroups');
                expect(errorHandler.error).toHaveBeenCalledWith('Failed to load the userroles');
                expect(errorHandler.error.calls.count()).toBe(2);
            });

            describe('filtered responses', function () {
                var dataGroups;

                it('should filter the groups based on the users groups', function () {
                    var expectedDataGroups;
                    var currentUserResponse = fixtures.get('currentUser');

                    currentUserResponse.groups = [
                        {id: 'c6hGi8GEZot', name: 'Data SI access'}
                    ];
                    currentUserRequest.respond(200, currentUserResponse);

                    expectedDataGroups = [
                        {
                            name: 'SI',
                            userGroups: [
                                {name: 'Data SI access', id: 'c6hGi8GEZot'}
                            ],
                            userRoles: [
                                {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
                            ]
                        }
                    ];

                    dataGroupsService.getDataGroups().then(function (data) {
                        dataGroups = data;
                    });
                    $httpBackend.flush();

                    expect(dataGroups).toEqual(expectedDataGroups);
                });

                it('should return all the options if the user has the all authority', function () {
                    var expectedDataGroups;
                    var currentUserResponse = fixtures.get('currentUser');

                    currentUserResponse.groups = [];
                    currentUserRequest.respond(200, currentUserResponse);
                    currentUserAuthoritiesRequest
                        .respond(200, fixtures.get('currentUserAuthorities').concat(['ALL']));

                    expectedDataGroups = [
                        {
                            name: 'SI',
                            userGroups: [
                                {name: 'Data SI access', id: 'c6hGi8GEZot'}
                            ],
                            userRoles: [
                                {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
                            ]
                        }, {
                            name: 'EA',
                            userGroups: [
                                {name: 'Data EA access', id: 'YbkldVOJMUl'}
                            ],
                            userRoles: [
                                {name: 'Data Entry EA', id: 'OKKx4bf4ueV'}
                            ]
                        }, {
                            name: 'SIMS',
                            userGroups: [
                                {name: 'Data SIMS access', id: 'iuD8wUFz95X'}
                            ],
                            userRoles: [
                                {name: 'Data Entry SIMS', id: 'iXkZzRKD0i4'}
                            ]
                        }
                    ];

                    dataGroupsService.getDataGroups().then(function (data) {
                        dataGroups = data;
                    });
                    $httpBackend.flush();

                    expect(dataGroups).toEqual(expectedDataGroups);
                });
            });
        });
    });
});
