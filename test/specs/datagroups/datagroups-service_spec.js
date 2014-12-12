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

            it('should not error when userroles request is empty', function () {
                userRoleRequest.respond(200, {});

                dataGroupsService.getDataGroups();
                $httpBackend.flush();
            });

            it('should not error when usergroups request is empty', function () {
                userGroupRequest.respond(200, {});

                dataGroupsService.getDataGroups();
                $httpBackend.flush();
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

    describe('getDataGroupsForUser', function () {
        it('should be a function', function () {
            expect(dataGroupsService.getDataGroupsForUser).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(dataGroupsService.getDataGroupsForUser()).toBeAPromiseLikeObject();
        });

        describe('responses', function () {
            var $httpBackend;
            var userGroupRequest;
            var userRoleRequest;
            var currentUserRequest;
            var currentUserAuthoritiesRequest;
            var expectedDataStreams = window.fixtures.get('dataStreamAccess');

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

            it('should reject the promise if no user was given', function () {
                var catchFunction = jasmine.createSpy();

                dataGroupsService.getDataGroupsForUser().catch(catchFunction);
                $rootScope.$apply();

                expect(catchFunction).toHaveBeenCalled();
            });

            it('should return all usergroups with values', function () {
                var dataGroups;
                dataGroupsService.getDataGroupsForUser(window.fixtures.get('userGroupsRoles')).then(function (response) {
                    dataGroups = response;
                });
                $httpBackend.flush();

                expect(dataGroups).toEqual(expectedDataStreams);
            });
        });

        describe('getUserGroups', function () {
            var userToEdit;
            var dataGroups;
            var expectedUserGroups;

            beforeEach(function () {
                userToEdit = window.fixtures.get('userGroupsRoles');
                dataGroups = [
                    {
                        name: 'SI',
                        access: true,
                        entry: true,
                        userGroups: [
                            {name: 'Data SI access', id: 'c6hGi8GEZot'}
                        ],
                        userRoles: [
                            {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
                        ]
                    }, {
                        name: 'EA',
                        access: false,
                        entry: true,
                        userGroups: [
                            {name: 'Data EA access', id: 'YbkldVOJMUl'}
                        ],
                        userRoles: [
                            {name: 'Data Entry EA', id: 'OKKx4bf4ueV'}
                        ]
                    }, {
                        name: 'SIMS',
                        access: false,
                        entry: true,
                        userGroups: [
                            {name: 'Data SIMS access', id: 'iuD8wUFz95X'}
                        ],
                        userRoles: [
                            {name: 'Data Entry SIMS', id: 'iXkZzRKD0i4'}
                        ]
                    }
                ];

                expectedUserGroups = [
                    {
                        id: 'iSC0IMnwa4n',
                        name: 'OU Rwanda Mechanism 10193 - TRAC Cooperative Agreement',
                        created: '2014-09-29T12:56:50.366+0000',
                        lastUpdated: '2014-11-20T11:22:00.781+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/iSC0IMnwa4n'
                    }, {
                        id: 'Xxel2E26U9j',
                        name: 'OU Rwanda Partner 618 users - Treatment and Research AIDS Center',
                        created: '2014-09-29T12:56:50.674+0000',
                        lastUpdated: '2014-11-17T20:07:12.583+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/Xxel2E26U9j'
                    }, {
                        name: 'Data SI access',
                        id: 'c6hGi8GEZot'
                    }
                ];
            });

            it('should be a function', function () {
                expect(dataGroupsService.getUserGroups).toBeAFunction();
            });

            it('should return the selected groups', function () {
                var returnedUserGroups = dataGroupsService.getUserGroups(userToEdit, dataGroups, {SI: {access: true}});

                expect(returnedUserGroups).toEqual(expectedUserGroups);
            });

            it('should only return the selected streamgroups', function () {
                var userStreams = {
                    SI: {
                        access: true,
                        entry: false
                    },
                    EA: {
                        access: false,
                        entry: false
                    },
                    SIMS: {
                        access: false,
                        entry: false
                    }
                };

                dataGroups[1].access = true; //EA
                dataGroups[2].access = true; //SIMS

                var returnedUserGroups = dataGroupsService.getUserGroups(userToEdit, dataGroups, userStreams);

                expect(returnedUserGroups).toEqual(expectedUserGroups);
            });

            it('should not return any data groups when no streams are selected', function () {
                expectedUserGroups = [
                    {
                        id: 'iSC0IMnwa4n',
                        name: 'OU Rwanda Mechanism 10193 - TRAC Cooperative Agreement',
                        created: '2014-09-29T12:56:50.366+0000',
                        lastUpdated: '2014-11-20T11:22:00.781+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/iSC0IMnwa4n'
                    }, {
                        id: 'Xxel2E26U9j',
                        name: 'OU Rwanda Partner 618 users - Treatment and Research AIDS Center',
                        created: '2014-09-29T12:56:50.674+0000',
                        lastUpdated: '2014-11-17T20:07:12.583+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/Xxel2E26U9j'
                    }
                ];

                var userStreams = {
                    SI: {
                        access: false,
                        entry: false
                    },
                    EA: {
                        access: false,
                        entry: false
                    },
                    SIMS: {
                        access: false,
                        entry: false
                    }
                };

                var returnedUserGroups = dataGroupsService.getUserGroups(userToEdit, dataGroups, userStreams);

                expect(returnedUserGroups).toEqual(expectedUserGroups);
            });

            it('should return the default groups when no stream object is provided', function () {
                expectedUserGroups = [
                    {
                        id: 'iSC0IMnwa4n',
                        name: 'OU Rwanda Mechanism 10193 - TRAC Cooperative Agreement',
                        created: '2014-09-29T12:56:50.366+0000',
                        lastUpdated: '2014-11-20T11:22:00.781+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/iSC0IMnwa4n'
                    }, {
                        id: 'Xxel2E26U9j',
                        name: 'OU Rwanda Partner 618 users - Treatment and Research AIDS Center',
                        created: '2014-09-29T12:56:50.674+0000',
                        lastUpdated: '2014-11-17T20:07:12.583+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/Xxel2E26U9j'
                    }
                ];

                dataGroups[1].access = true; //EA
                dataGroups[2].access = true; //SIMS

                var returnedUserGroups = dataGroupsService.getUserGroups(userToEdit, dataGroups);

                expect(returnedUserGroups).toEqual(expectedUserGroups);
            });

            it('should set stream access to true on the dataGroups', function () {
                expectedUserGroups = [
                    {
                        id: 'iSC0IMnwa4n',
                        name: 'OU Rwanda Mechanism 10193 - TRAC Cooperative Agreement',
                        created: '2014-09-29T12:56:50.366+0000',
                        lastUpdated: '2014-11-20T11:22:00.781+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/iSC0IMnwa4n'
                    }, {
                        id: 'Xxel2E26U9j',
                        name: 'OU Rwanda Partner 618 users - Treatment and Research AIDS Center',
                        created: '2014-09-29T12:56:50.674+0000',
                        lastUpdated: '2014-11-17T20:07:12.583+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/Xxel2E26U9j'
                    },
                    {id: 'YbkldVOJMUl', name: 'Data EA access'}
                ];

                var userStreams = {
                    SI: {
                        access: false,
                        entry: false
                    },
                    EA: {
                        access: true,
                        entry: false
                    },
                    SIMS: {
                        access: false,
                        entry: false
                    }
                };

                var returnedUserGroups = dataGroupsService.getUserGroups(userToEdit, dataGroups, userStreams);

                expect(returnedUserGroups).toEqual(expectedUserGroups);
            });
        });
    });
});
