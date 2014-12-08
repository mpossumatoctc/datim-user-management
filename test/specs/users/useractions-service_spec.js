describe('User actions', function () {
    var fixtures = window.fixtures;
    var userActionsService;
    var errorHandler;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('dataGroupsService', function ($q) {
            var success = $q.when(fixtures.get('dataStreamAccess'));
            return {
                getDataGroupsForUser: function () {
                    return success;
                },
                getDataGroups: jasmine.createSpy('getDataGroups').and.returnValue($q.when([
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
                ]))
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        errorHandler = $injector.get('errorHandler');
        spyOn(errorHandler, 'error');

        userActionsService = $injector.get('userActionsService');
    }));

    it('should be an object', function () {
        expect(userActionsService).toBeAnObject();
    });

    it('should have an array of user actions', function () {
        expect(userActionsService.actions).toBeAnArray();
    });

    it('should have the actions set in the action array', function () {
        expect(userActionsService.actions).toEqual(fixtures.get('actionsList'));
    });

    describe('getActionsForUserType', function () {
        it('should return the user actions available for agencies', function () {
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
                {name: 'Accept data', userRole: 'Data Accepter'},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsForUserType('agency')).toEqual(expectedActions);
        });

        it('should return the user actions available for inter-agency', function () {
            var expectedActions = [
                {name: 'Data Entry', userRole: 'Data Entry SI Country Team', dataStream: ['SI']},
                {name: 'Accept data', userRole: 'Data Accepter'},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsForUserType('inter-agency')).toEqual(expectedActions);
        });

        it('should return the user actions available for partners', function () {
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsForUserType('partner')).toEqual(expectedActions);
        });

        it('should return the read action as a default', function () {
            var expectedActions = [
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsForUserType()).toEqual(expectedActions);
        });

        it('should also return the correct data when called with uppercase value', function () {
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
                {name: 'Submit data', userRole: 'Data Submitter'},
                {name: 'Manage users', userRole: 'User Administrator'},
                {name: 'Read data', userRole: 'Read Only', default: true}
            ];

            expect(userActionsService.getActionsForUserType('Partner')).toEqual(expectedActions);
        });
    });

    describe('loading of the userroles', function () {
        var $httpBackend;
        var userRoleRequest;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            userRoleRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userRoles?' +
                    'fields=id,name&filter=name:eq:Data+Entry+SI+Country+Team&filter=name:eq:Data+Accepter' +
                    '&filter=name:eq:Data+Submitter&filter=name:eq:User+Administrator&filter=name:eq:Read+Only&paging=false')
                .respond(200, fixtures.get('userRolesForActions'));
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should load the userroles from the api to get the userrole IDs', function () {
            $httpBackend.flush();
        });

        it('should add the loaded userroles to the right actions', function () {
            $httpBackend.flush();

            expect(userActionsService.actions).toEqual(fixtures.get('actionsListWithRoles'));
        });

        it('should call the error function when the request fails', function () {
            userRoleRequest.respond(404);

            $httpBackend.flush();

            expect(errorHandler.error).toHaveBeenCalledWith('Failed to load user roles for actions');
            expect(errorHandler.error.calls.count()).toBe(1);
        });
    });

    describe('getActionsForUser', function () {
        var $httpBackend;
        var $rootScope;
        var userRoleRequest;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');

            userRoleRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/userRoles?' +
                    'fields=id,name&filter=name:eq:Data+Entry+SI+Country+Team&filter=name:eq:Data+Accepter' +
                    '&filter=name:eq:Data+Submitter&filter=name:eq:User+Administrator&filter=name:eq:Read+Only&paging=false')
                .respond(200, fixtures.get('userRolesForActions'));
            $httpBackend.flush();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            expect(userActionsService.getActionsForUser).toBeAFunction();
        });

        it('should get the actions with a hasAction property', function () {
            var user = window.fixtures.get('userGroupsRoles');
            var userActions;
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: false},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
                ];

            userActionsService.getActionsForUser(user).then(function (actions) {
                userActions = actions;
            });
            $rootScope.$apply();

            expect(userActions).toEqual(expectedActions);
        });

        it('should also give the user the submit action', function () {
            var user = window.fixtures.get('userGroupsRoles');
            var userActions;
            var expectedActions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: true},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
            ];
            user.userCredentials.userRoles.push(
                {id: 'n777lf1THwQ', name: 'Data Submitter', created: '2014-05-05T08:41:19.534+0000', lastUpdated: '2014-11-26T22:41:33.482+0000'}
            );

            userActionsService.getActionsForUser(user).then(function (actions) {
                userActions = actions;
            });
            $rootScope.$apply();

            expect(userActions).toEqual(expectedActions);
        });

        it('should not give the user any actions', function () {
            var user = window.fixtures.get('userGroupsRoles');
            var userActions;
            user.userGroups = [];
            user.userCredentials.userRoles = [];

            var expectedActions = [
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: false}
            ];

            userActionsService.getActionsForUser(user).then(function (actions) {
                userActions = actions;
            });
            $rootScope.$apply();

            expect(userActions).toEqual(expectedActions);
        });
    });

    describe('getUserRolesForUser', function () {
        var dataGroups = [
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
        var actions = [
            {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
            {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: true},
            {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
            {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
        ];

        it('should be a function', function () {
            expect(userActionsService.getUserRolesForUser).toBeAFunction();
        });

        it('should return an empty array', function () {
            expect(userActionsService.getUserRolesForUser()).toEqual([]);
        });

        it('should return the selected datagroup roles', function () {
            var user = {
                dataGroups: {SI: true},
                userActions: {'Capture data': true}
            };
            var expectedRoles = [
                { name: 'Data Entry SI', id: 'k7BWFXkG6zt' },
            ];

            expect(userActionsService.getUserRolesForUser(user, dataGroups, actions)).toEqual(expectedRoles);
        });

        it('should return the general user roles', function () {
            var user = {
                dataGroups: {SI: true},
                userActions: {'Capture data': true, 'Submit data': true}
            };
            var expectedRoles = [
                { name: 'Data Submitter', id: 'n777lf1THwQ' },
                { name: 'Data Entry SI', id: 'k7BWFXkG6zt' }
            ];

            expect(userActionsService.getUserRolesForUser(user, dataGroups, actions)).toEqual(expectedRoles);
        });
    });

    describe('combineSelectedUserRolesWithExisting', function () {
        var dataGroups;
        var user;
        var actions;

        beforeEach(function () {
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
            user = {
                dataGroups: {SI: true},
                userActions: {'Capture data': true, 'Submit data': true}
            };
            actions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, hasAction: true},
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', hasAction: true},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', hasAction: false},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true, hasAction: true}
            ];
        });

        it('should be a function', function () {
            expect(userActionsService.combineSelectedUserRolesWithExisting).toBeAFunction();
        });

        it('should return a list of actions', function () {
            var existingUserObject = {
                userCredentials: {
                    userRoles: [
                        {name: 'Some role this user has', id: 'ndnf3ddss'}
                    ]
                }
            };
            var userGroupsAndActions = {
                dataGroups: {SI: true},
                userActions: {'Capture data': true, 'Submit data': true}
            };
            var expectedActions = [
                {name: 'Some role this user has', id: 'ndnf3ddss'},
                {name: 'Data Submitter', id: 'n777lf1THwQ'},
                {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
            ];

            var returnedUserRoles = userActionsService.combineSelectedUserRolesWithExisting(
                existingUserObject,
                userGroupsAndActions,
                dataGroups,
                actions
            );

            expect(returnedUserRoles).toEqual(expectedActions);
        });

        it('should remove roles that are no longer selected', function () {
            var existingUserObject = fixtures.get('userGroupsRoles');
            var userGroupsAndActions = {
                dataGroups: {SI: false},
                userActions: {'Capture data': false, 'Submit data': true}
            };

            var returnedUserRoles = userActionsService.combineSelectedUserRolesWithExisting(
                existingUserObject,
                userGroupsAndActions,
                dataGroups,
                actions
            );

            var expectedActions = [
                {name: 'Data Submitter', id: 'n777lf1THwQ'}
            ];

            expect(returnedUserRoles).toEqual(expectedActions);
        });
    });
});
