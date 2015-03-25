describe('Add user controller', function () {
    var scope;
    var currentUserMock;
    var userActions;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('interAgencyService', function ($q) {
            return {getUserGroups: jasmine.createSpy().and.returnValue($q.when({userGroup: 'interagency'}))};
        });

        $provide.factory('userActions', function () {
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
                getActionsForUser: jasmine.createSpy('getActionsForUser'),
                getUserRolesForUser: jasmine.createSpy('getUserRolesForUser'),
                combineSelectedUserRolesWithExisting: jasmine.createSpy('combineSelectedUserRolesWithExisting'),
                getDataEntryRestrictionDataGroups: jasmine.createSpy('getDataEntryRestrictionDataGroups')
                    .and.returnValue(['SI', 'EA']),
                filterActionsForCurrentUser: function (actions) {
                    return actions;
                },
                dataEntryRestrictions: {
                    'Inter-Agency': {
                        SI: [
                            {userRole: 'Data Entry SI Country Team', userRoleId: 'dataEntryCountryTeamID'},
                            {userRole: 'Data Deduplication', userRoleId: 'datadedupeid'},
                            {userRole: 'Tracker', userRoleId:  'trackerid'}
                        ]
                    },
                    Agency: {
                        SIMS: [
                            {userRole: 'Data Entry SIMS', userRoleId: 'iXkZzRKD0i4'},
                            {userRole: 'Data Entry SIMS Key Pops', userRoleId: 'simskeypopsid'}
                        ]
                    },
                    Partner: {
                        SI: [{userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'}],
                        EA: [{userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}]
                    }
                },
                dataEntryRestrictionsUserManager: {
                    'Inter-Agency': {
                        SI: [
                            {userRole: 'Data Entry SI Country Team', userRoleId: 'dataEntryCountryTeamID'},
                            {userRole: 'Tracker', userRoleId: 'trackerid'},
                            {userRole: 'Data Deduplication', userRoleId: 'datadedupeid'},
                            {userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'}
                        ],
                        SIMS: [
                            {userRole: 'Data Entry SIMS', userRoleId: 'iXkZzRKD0i4'},
                            {userRole: 'Data Entry SIMS Key Pops', userRoleId: 'simskeypopsid'}
                        ],
                        EA: [{userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}]
                    },
                    Agency: {
                        SI: [{userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'}],
                        SIMS: [{userRole: 'Data Entry SIMS', userRoleId: 'iXkZzRKD0i4'}, {userRole: 'Data Entry SIMS Key Pops', userRoleId: 'simskeypopsid'}],
                        EA: [{userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}]
                    },
                    Partner: {
                        SI: [{userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'}],
                        EA: [{userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}]
                    }
                }
            };
        });

        $provide.factory('currentUser', function () {
            return {
                hasAllAuthority: jasmine.createSpy('hasAllAuthority')
                    .and.returnValue(false),
                isUserAdministrator: jasmine.createSpy('isUserAdministrator')
                    .and.returnValue(true),
                userCredentials: {
                    userRoles: [
                        {id: 'dsfsdfsss', name: 'Data Entry EA'},
                        {id: 'dfdsfswww', name: 'Data Entry SI'},
                        {id: 'dfdssswww', name: 'Data Entry SIMS'}
                    ]
                }
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
        currentUserMock = function (options) {
            return {
                hasAllAuthority: function () {
                    if (options && options.allAuthority !== undefined) {
                        return options.allAuthority;
                    }
                    return true;
                },
                isUserAdministrator: function () {
                    if (options && options.userAdministrator) {
                        return true;
                    }
                    return false;
                }
            };
        };

        userActions = $injector.get('userActions');
    }));

    describe('basic structure', function () {
        var controller;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: [
                    {}
                ],
                dimensionConstraint: {},
                userActionsService: {
                    getActionsForUserType: function () {
                        return [];
                    }
                },
                currentUser: currentUserMock()
            });
        }));

        it('should be an object', function () {
            expect(controller).toBeAnObject();
        });

        it('should have the correct title', function () {
            expect(controller.title).toBe('Add or delete user');
        });

        it('should have an array for user types', function () {
            expect(scope.userTypes).toEqual([]);
        });

        it('should have an array for "data streams"', function () {
            expect(controller.dataGroups).toEqual([{}]);
        });

        it('should have an array for actions', function () {
            expect(controller.actions).toEqual([{name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}]);
        });

        it('should have an array for languages', function () {
            expect(controller.languages).toEqual([]);
        });

        it('should have a flag for if the form is processing', function () {
            expect(controller.isProcessingAddUser).toBe(false);
        });

        it('should have a dimensionConstraint', function () {
            expect(controller.dimensionConstraint).toEqual({});
        });
    });

    describe('load data into the controller through injectables', function () {
        var controller;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [
                    {name: 'Inter-Agency'},
                    {name: 'Agency'},
                    {name: 'Partner'}
                ],
                dataGroups: [
                    {name: 'MER'},
                    {name: 'EA'},
                    {name: 'SIMS'}
                ],
                dimensionConstraint: {},
                currentUser: currentUserMock()
            });
        }));

        it('should add the loaded usertypes', function () {
            var expectedUsertypes = [
                {name: 'Inter-Agency'},
                {name: 'Agency'},
                {name: 'Partner'}
            ];

            expect(scope.userTypes).toEqual(expectedUsertypes);
        });

        it('should add the loaded datagroups', function () {
            var expectedDataGroups = [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];

            expect(controller.dataGroups).toEqual(expectedDataGroups);
        });

        it('should set the user dataGroups', function () {
            var expectedUserDataGroups = {
                MER: {access: false, entry: false},
                EA: {access: false, entry: false},
                SIMS: {access: false, entry: false}
            };
            expect(scope.user.dataGroups).toEqual(expectedUserDataGroups);
        });
    });

    describe('addUser', function () {
        var controller;
        var scope;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: undefined,
                dimensionConstraint: {},
                currentUser: currentUserMock()
            });
        }));

        it('should be a function on the controller', function () {
            expect(controller.addUser).toBeAFunction();
        });

        it('should set the isProcessingAddUser to true', function () {
            controller.addUser();

            expect(controller.isProcessingAddUser).toBe(true);
        });
    });

    describe('userType watch', function () {
        var controller;
        var expectedActions;

        beforeEach(inject(function ($controller, $rootScope) {
            expectedActions = [
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
            ];

            scope = $rootScope.$new();
            scope.user = {
                userType: undefined
            };

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [
                    {name: 'Inter-Agency'},
                    {name: 'Agency'},
                    {name: 'Partner'}
                ],
                dataGroups: [
                    {name: 'SI'},
                    {name: 'EA'},
                    {name: 'SIMS'}
                ],
                dimensionConstraint: {},
                $state: {} //Fake the state to not load the default
            });
            scope.$apply();
        }));

        it('should ask for new actions when the userType changes', function () {
            scope.user.userType = {name: 'Partner'};
            scope.$apply();

            expect(userActions.getActionsForUserType).toHaveBeenCalledWith('Partner');
        });

        it('should store the available actions onto the controller', function () {
            userActions.getActionsForUserType.and.returnValue([
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
                {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
            ]);

            scope.user.userType = {name: 'Partner'};
            scope.$apply();

            expect(controller.actions).toEqual(expectedActions);
        });

        it('should reset the users actions', function () {
            scope.user.userActions = {'Submit data': true};

            scope.user.userType = {name: 'Partner'};
            scope.$apply();

            expect(scope.user.userActions).toEqual({});
        });

        it('should call the interagency service', inject(function (interAgencyService) {
            scope.user.userType = {name: 'Inter-Agency'};
            scope.$apply();

            expect(interAgencyService.getUserGroups).toHaveBeenCalled();
            expect(scope.user.userEntity).toEqual({userGroup: 'interagency'});
        }));

        describe('data entry reset', function () {
            var userActions;

            beforeEach(inject(function ($injector) {
                userActions = $injector.get('userActions');
            }));

            it('should remove SIMS as an data stream', function () {
                scope.user.userType = {name: 'Agency'};
                scope.$apply();

                scope.user.dataGroups.SIMS.entry = true;
                scope.user.userType = {name: 'Partner'};
                scope.$apply();

                expect(scope.user.dataGroups.SIMS).not.toBeDefined();
            });

            it('should reset data entry to false', function () {
                scope.user.userType = {name: 'Partner'};
                scope.$apply();

                userActions.getDataEntryRestrictionDataGroups
                    .and.returnValue(['SI']);

                scope.user.dataGroups.SI.entry = true;
                scope.user.userType = {name: 'Inter-Agency'};
                scope.$apply();

                expect(scope.user.dataGroups.SI.entry).toBe(false);
            });

            it('should reset data entry to false', function () {
                scope.user.userType = {name: 'Partner'};
                scope.$apply();

                userActions.getDataEntryRestrictionDataGroups
                    .and.returnValue(['SI']);

                scope.user.dataGroups.SI.entry = true;
                scope.user.dataGroups.EA.entry = true;

                scope.user.userType = {name: 'Inter-Agency'};
                scope.$apply();

                expect(scope.user.dataGroups.SI.entry).toBe(false);
                expect(scope.user.dataGroups.EA.entry).toBe(false);
            });

            it('should reset isUserManager to false when changing type', function () {
                scope.user.userType = {name: 'Partner'};
                scope.$apply();

                controller.isUserManager = true;

                scope.user.userType = {name: 'Inter-Agency'};
                scope.$apply();

                expect(controller.isUserManager).toBe(false);
            });

            it('should reset the data entry on the data entry service', inject(function (dataEntryService) {
                scope.user.userType = {name: 'Inter-Agency'};
                scope.$apply();

                expect(dataEntryService.reset).toHaveBeenCalled();
            }));
        });
    });

    describe('userOrgUnit.current watch', function () {
        var controller;
        var watcherSpy;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            scope.user = {
                userType: undefined
            };

            watcherSpy = jasmine.createSpy('watcherSpy');
            scope.$on('ORGUNITCHANGED', watcherSpy);

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: [{name: 'EA'}],
                dimensionConstraint: {},
                currentUser: currentUserMock(),
                $state: {} //Fake the state to not load the default
            });
            scope.$apply();
        }));

        it('should not broadcast the event on initial load', function () {
            expect(watcherSpy).not.toHaveBeenCalled();
        });

        it('should broadcast the ORGUNITCHANGED event', function () {
            scope.userOrgUnit.current = {
                name: 'NewOrgUnitName'
            };
            scope.$apply();
            expect(watcherSpy).toHaveBeenCalled();
        });
    });

    describe('validation for', function () {
        var controller;
        var scope;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [
                    {name: 'Inter-Agency'},
                    {name: 'Agency'},
                    {name: 'Partner'}
                ],
                dataGroups: [
                    {name: 'MER'},
                    {name: 'EA'},
                    {name: 'SIMS'}
                ],
                dimensionConstraint: {},
                currentUser: currentUserMock()
            });
        }));

        describe('datagroup', function () {
            it('should have a validation function', function () {
                expect(controller.validateDataGroups).toBeAFunction();
            });

            it('should return false when no datagroup is selected', function () {
                expect(controller.validateDataGroups()).toBe(false);
            });

            it('should return true when a datagroup is selected', function () {
                scope.user.dataGroups.MER = {
                    access: true,
                    entry: false
                };

                expect(controller.validateDataGroups()).toBe(true);
            });
        });

        describe('dataGroupsInteractedWith', function () {
            var simulatedForm;

            beforeEach(function () {
                simulatedForm = {
                    'dataStream[EA]': {
                        $dirty: false
                    },
                    'dataStream[SI]': {
                        $dirty: false
                    },
                    otherFormField: {
                        $dirty: false
                    }
                };
            });

            it('should not return true when the datastreams have not been interacted with', function () {
                expect(controller.dataGroupsInteractedWith(simulatedForm)).toBe(false);
            });

            it('should return true when the datastreams have been interacted with', function () {
                simulatedForm['dataStream[EA]'].$dirty = true;

                expect(controller.dataGroupsInteractedWith(simulatedForm)).toBe(true);
            });

            it('should not return true when other fields have been interacted with', function () {
                simulatedForm.otherFormField.$dirty = true;

                expect(controller.dataGroupsInteractedWith(simulatedForm)).toBe(false);
            });
        });
    });

    describe('permissions', function () {
        var $controller;
        var $state;
        var dataGroupValues = [{name: 'EA'}];

        function createController(allAuthority, userRole) {
            $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: dataGroupValues,
                dimensionConstraint: {},
                userActionsService: {
                    getActionsForUserType: function () {
                        return [];
                    }
                },
                currentUser: currentUserMock({
                    allAuthority: allAuthority || false,
                    userAdministrator: userRole || ''
                }),
                $state: $state
            });
        }

        beforeEach(inject(function ($injector, $rootScope) {
            $controller = $injector.get('$controller');
            scope = $rootScope.$new();
            $state = $injector.get('$state');
            spyOn($state, 'go');
        }));

        it('should switch states when the user does not have permissions', function () {
            createController();
            expect($state.go).toHaveBeenCalled();
        });

        it('should not switch states when the user has the all authority', function () {
            createController(true, false);
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should not switch states when the user has the user manager role', function () {
            createController(false, 'User Administrator');
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should switch states if there are no datagroups', function () {
            dataGroupValues = [];
            createController(true);

            expect($state.go).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('noaccess', {message: 'Your user account does not seem to have access to any of the data streams.'});
        });
    });

    describe('addUser', function () {
        var controller;
        var userService;
        var notify;

        beforeEach(inject(function ($controller, $rootScope, $injector) {
            scope = $rootScope.$new();
            userService = $injector.get('userService');
            spyOn(userService, 'inviteUser').and.returnValue({
                then: function () {

                }
            });
            spyOn(userService, 'verifyInviteData').and.returnValue(true);

            notify = $injector.get('notify');
            spyOn(notify, 'error');
            spyOn(notify, 'success');
            spyOn(notify, 'warning');

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [],
                dataGroups: [],
                dimensionConstraint: {id: 'SomeID'},
                currentUser: currentUserMock(),
                userService: userService
            });
        }));

        it('should add the dimension constraint', function () {
            controller.addUser();

            expect(controller.userInviteObject.userCredentials.catDimensionConstraints[0].id).toEqual('SomeID');
        });

        it('should add the entityUserGroups', function () {
            scope.user.userEntity = {
                mechUserGroup: {
                    id: 'agencyGroupIdMech'
                },
                userUserGroup: {
                    id: 'agencyGroupIdUsers'
                }
            };
            controller.addUser();

            expect(controller.userInviteObject.userGroups[0]).toEqual({id: 'agencyGroupIdMech'});
            expect(controller.userInviteObject.userGroups[1]).toEqual({id: 'agencyGroupIdUsers'});
        });

        it('should not call inviteUser when there is no mechGroup', function () {
            scope.user.userEntity = {
                mechUserGroup: {
                    id: 'agencyGroupIdMech'
                },
                userUserGroup: {
                }
            };

            controller.addUser();

            expect(userService.inviteUser).not.toHaveBeenCalled();
            expect(notify.error).toHaveBeenCalled();
        });

        //TODO: These tests might be obsolete as this functionality is no longer supported.
        describe('user manager usergroup', function () {
            beforeEach(function () {
                scope.user.userActions['Manage users'] = true;
                scope.user.userEntity = {
                    mechUserGroup: {
                        id: 'agencyGroupIdMech'
                    },
                    userUserGroup: {
                        id: 'agencyGroupIdUsers'
                    },
                    userAdminUserGroup: {
                        id: 'userAdminUserGroup'
                    }
                };
            });

            it('should not add the user manager group when the user manager role is present but false', function () {
                scope.user.userActions['Manage users'] = false;

                controller.addUser();

                expect(controller.userInviteObject.userGroups.length).toBe(2);
            });

            it('should not add the user manager group when the user manager role is present but not the group', function () {
                scope.user.userEntity = {
                };

                controller.addUser();

                expect(controller.userInviteObject.userGroups.length).toBe(0);
            });

            it('should call the inviteUser method on the user service', function () {
                controller.addUser();
                expect(userService.inviteUser).toHaveBeenCalled();
            });
        });

        describe('verify data', function () {
            it('should call the verify data on the user service', function () {
                controller.addUser();

                expect(userService.verifyInviteData).toHaveBeenCalled();
            });

            it('should log a error when the object does not pass validation', function () {
                userService.verifyInviteData.and.returnValue(false);
                controller.addUser();

                expect(notify.error).toHaveBeenCalled();
            });

            it('should not call the inviteUser function when basic validation failed', function () {
                userService.verifyInviteData.and.returnValue(false);
                controller.addUser();

                expect(userService.inviteUser).not.toHaveBeenCalled();
            });
        });

        describe('result calls', function () {
            var $state;
            beforeEach(inject(function ($injector) {
                $state = $injector.get('$state');
                spyOn($state, 'go');

                scope.user.userEntity = {
                    mechUserGroup: {
                        id: 'agencyGroupIdMech'
                    },
                    userUserGroup: {
                        id: 'agencyGroupIdUsers'
                    }
                };

                userService.verifyInviteData.and.returnValue(true);
            }));

            describe('success', function () {

                beforeEach(function () {
                    spyOn(userService, 'saveUserLocale')
                        .and.returnValue({
                            then: function (success) {
                                success.call();
                            }
                        });
                    userService.inviteUser.and.returnValue({
                        then: function (success) {
                            success.call(undefined, {
                                name: '(TBD), (TBD)',
                                userCredentials: {
                                    username: 'username'
                                }
                            });
                        }
                    });
                    spyOn(userService, 'getUserObject').and.callThrough();
                    controller.addUser();
                });

                it('should set processing to false', function () {
                    expect(controller.isProcessingAddUser).toBe(false);
                });

                it('should have called state.go', function () {
                    expect($state.go).toHaveBeenCalled();
                });

                it('should call notify with success', function () {
                    expect(notify.success).toHaveBeenCalled();
                    expect(notify.success).toHaveBeenCalledWith('User invitation sent');
                });
            });

            describe('failure', function () {
                beforeEach(function () {
                    userService.inviteUser.and.returnValue({
                        then: function (success, failure) {
                            failure.call();
                        }
                    });
                    controller.addUser();
                });

                it('should set processing to false', function () {
                    expect(controller.isProcessingAddUser).toBe(false);
                });

                it('should call the notify with an error', function () {
                    expect(notify.error).toHaveBeenCalled();
                    expect(notify.error).toHaveBeenCalledWith('Request to add the user failed');
                });
            });

            describe('user locale success', function () {
                beforeEach(function () {
                    spyOn(userService, 'saveUserLocale')
                        .and.returnValue({
                            then: function () {
                            }
                        });
                    userService.inviteUser.and.returnValue({
                        then: function (success) {
                            success.call(undefined, {
                                name: '(TBD), (TBD)',
                                userCredentials: {
                                    username: 'username'
                                }
                            });
                        }
                    });
                    controller.addUser();
                });

                it('should call the saveUserLocale function on the userService', function () {
                    expect(userService.saveUserLocale).toHaveBeenCalled();
                });

                it('should call the saveUserLocale with the username and locale', function () {
                    expect(userService.saveUserLocale).toHaveBeenCalledWith('username', 'en');
                });
            });

            describe('user locale failure', function () {
                beforeEach(function () {
                    spyOn(userService, 'saveUserLocale')
                        .and.returnValue({
                            then: function (success, failure) {
                                failure.call();
                            }
                        });
                    userService.inviteUser.and.returnValue({
                        then: function (success) {
                            success.call(undefined, {
                                name: '(TBD), (TBD)',
                                userCredentials: {
                                    username: 'username'
                                }
                            });
                        }
                    });
                    controller.addUser();
                });

                it('should call warning when the locale save fails', function () {
                    expect(notify.warning).toHaveBeenCalled();
                    expect(notify.warning).toHaveBeenCalledWith('Saved user but was not able to save the user locale');
                });

                it('should set processing to false', function () {
                    expect(controller.isProcessingAddUser).toBe(false);
                });
            });
        });

        describe('user manager', function () {
            var controller;

            beforeEach(inject(function ($controller) {
                controller = $controller('addUserController', {
                    $scope: scope,
                    userTypes: [
                        {name: 'Inter-Agency'},
                        {name: 'Agency'},
                        {name: 'Partner'}
                    ],
                    dataGroups: [
                        {
                            name: 'SI',
                            access: false,
                            entry: false,
                            userGroups: [
                                {name: 'Data SI access', id: 'c6hGi8GEZot'}
                            ],
                            userRoles: [
                                {name: 'Data Entry SI', id: 'k7BWFXkG6zt'}
                            ]
                        }, {
                            name: 'EA',
                            access: false,
                            entry: false,
                            userGroups: [
                                {name: 'Data EA access', id: 'YbkldVOJMUl'}
                            ],
                            userRoles: [
                                {name: 'Data Entry EA', id: 'OKKx4bf4ueV'}
                            ]
                        }, {
                            name: 'SIMS',
                            access: false,
                            entry: false,
                            userGroups: [
                                {name: 'Data SIMS access', id: 'iuD8wUFz95X'}
                            ],
                            userRoles: [
                                {name: 'Data Entry SIMS', id: 'iXkZzRKD0i4'}
                            ]
                        }
                    ],
                    dimensionConstraint: {id: 'SomeID'},
                    currentUser: currentUserMock()
                });

                controller.isUserManager = true;

                scope.user.userEntity = {
                    mechUserGroup: {
                        id: 'agencyGroupIdMech'
                    },
                    userUserGroup: {
                        id: 'agencyGroupIdUsers'
                    },
                    userAdminUserGroup: {
                        id: 'agencyGroupIdUserAdmin'
                    }
                };
                scope.user.userType = {name: 'Agency'};
                scope.user.dataGroups = {
                    SI: {
                        entry: false,
                        access: false
                    },
                    EA: {
                        entry: false,
                        access: false
                    },
                    SIMS: {
                        entry: false,
                        access: false
                    }
                };

                var userActionsForManager = [
                    {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
                    {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                    {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
                ];

                userActions.getActionsForUserType.and.returnValue(userActionsForManager);

                controller.actions = userActionsForManager;
            }));

            it('should add the dimension constraint to the invite object', function () {
                controller.addUser();

                expect(controller.userInviteObject.userCredentials.catDimensionConstraints).toEqual([{id: 'SomeID'}]);
            });

            it('should add the mechanismsUserGroup to the invite object', function () {
                controller.addUser();

                expect(controller.userInviteObject.userGroups[3]).toEqual({id: 'agencyGroupIdMech'});
            });

            it('should add the usersUserGroup to the invite object', function () {
                controller.addUser();

                expect(controller.userInviteObject.userGroups[4]).toEqual({id: 'agencyGroupIdUsers'});
            });

            it('should add the userAdminUserGroup to the invite object', function () {
                controller.addUser();

                expect(controller.userInviteObject.userGroups[5]).toEqual({id: 'agencyGroupIdUserAdmin'});
            });

            it('should notify the user when the user admin group is not available', function () {
                delete scope.user.userEntity.userAdminUserGroup;

                controller.addUser();

                expect(notify.error).toHaveBeenCalledWith('User admin group can not be found');
                expect(notify.error).toHaveBeenCalledWith('Unable to invite user manager');
            });

            it('should set the roles onto the invite object', function () {
                controller.addUser();

                expect(controller.userInviteObject.userCredentials.userRoles)
                    .toEqual([{id: 'QbxXEPw9xlf'}, {id: 'n777lf1THwQ'}, {id: 'b2uHwX9YLhu'}, {id: 'KagqnetfxMr'},
                        {id: 'k7BWFXkG6zt'}, {id: 'iXkZzRKD0i4'}, {id: 'simskeypopsid'}, {id: 'OKKx4bf4ueV'}]);
            });

            it('should set the roles onto the invite object only once', function () {
                controller.addUser();
                controller.addUser();

                expect(controller.userInviteObject.userCredentials.userRoles)
                    .toEqual([{id: 'QbxXEPw9xlf'}, {id: 'n777lf1THwQ'}, {id: 'b2uHwX9YLhu'}, {id: 'KagqnetfxMr'},
                        {id: 'k7BWFXkG6zt'}, {id: 'iXkZzRKD0i4'}, {id: 'simskeypopsid'}, {id: 'OKKx4bf4ueV'}]);
            });

            describe('getUserManagerRoles', function () {
                it('should get the user actions', function () {
                    var expectedRoles = [
                        {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
                        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                        {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true},
                        {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'}
                    ];

                    expect(controller.getUserManagerRoles()).toEqual(expectedRoles);
                });

                it('should not return accept data for a partner user', function () {
                    var expectedRoles = [
                        {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
                        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
                        {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true},
                        {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'}
                    ];
                    scope.user.userType = {name: 'Partner'};

                    expect(controller.getUserManagerRoles()).toEqual(expectedRoles);
                });
            });

            describe('getUserManagerDataEntryRoles', function () {
                it('should get the data entry roles for the the user type', function () {
                    var expectedRoles = [
                        {userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'},
                        {userRole: 'Data Entry SIMS', userRoleId: 'iXkZzRKD0i4'},
                        {userRole: 'Data Entry SIMS Key Pops', userRoleId: 'simskeypopsid'},
                        {userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}
                    ];

                    expect(controller.getUserManagerDataEntryRoles()).toEqual(expectedRoles);
                });

                it('should give the inter-agency data entry roles', function () {
                    var expectedRoles = [
                        {userRole: 'Data Entry SI Country Team', userRoleId: 'dataEntryCountryTeamID'},
                        {userRole: 'Tracker', userRoleId: 'trackerid'},
                        {userRole: 'Data Deduplication', userRoleId: 'datadedupeid'},
                        {userRole: 'Data Entry SI', userRoleId: 'k7BWFXkG6zt'},
                        {userRole: 'Data Entry SIMS', userRoleId: 'iXkZzRKD0i4'},
                        {userRole: 'Data Entry SIMS Key Pops', userRoleId: 'simskeypopsid'},
                        {userRole: 'Data Entry EA', userRoleId: 'OKKx4bf4ueV'}
                    ];
                    scope.user.userType = {name: 'Inter-Agency'};

                    expect(controller.getUserManagerDataEntryRoles()).toEqual(expectedRoles);
                });
            });

            describe('getUserManagerDataAccessGroups', function () {
                it('should return all data stream groups', function () {
                    var expectedGroups = [
                        {name: 'Data SI access', id: 'c6hGi8GEZot'},
                        {name: 'Data EA access', id: 'YbkldVOJMUl'},
                        {name: 'Data SIMS access', id: 'iuD8wUFz95X'}
                    ];

                    expect(controller.getUserManagerDataAccessGroups()).toEqual(expectedGroups);
                });
            });
        });
    });

    describe('getDataEntryRolesNotShown', function () {
        var controller;
        var userActionsMock;
        var currentUserMock;

        beforeEach(inject(function ($controller, $httpBackend, $injector) {
            userActionsMock = $injector.get('userActions');
            currentUserMock = $injector.get('currentUser');

            userActionsMock.getDataEntryRestrictionDataGroups
                .and.returnValue(['SI']);

            scope = $injector.get('$rootScope').$new();
            $httpBackend.whenGET()
                .respond(200, {});

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [],
                dataGroups: [
                    {name: 'SI'},
                    {name: 'EA'},
                    {name: 'SIMS'}
                ],
                dimensionConstraint: {id: 'SomeID'}
                /*currentUser: currentUserMock()*/
            });

            scope.user.dataGroups.SI.access = true;
            scope.user.userType = {
                name: 'Inter-Agency'
            };
        }));

        it('should be a function', function () {
            expect(controller.getDataEntryRolesNotShown).toBeAFunction();
        });

        it('should return the different actions', function () {
            var expectedUserRoles = [
                    {userRole: 'Data Entry SI', userRoleId:  'k7BWFXkG6zt'},
                    {userRole: 'Data Entry SIMS', userRoleId:  'iXkZzRKD0i4'},
                    {userRole: 'Data Entry SIMS Key Pops', userRoleId:  'simskeypopsid'},
                    {userRole: 'Data Entry EA', userRoleId:  'OKKx4bf4ueV'}
            ];

            expect(controller.getDataEntryRolesNotShown()).toEqual(expectedUserRoles);
        });

        it('should not return any extra roles for partners', function () {
            scope.user.userType = {name: 'Partner'};

            expect(controller.getDataEntryRolesNotShown()).toEqual([]);
        });

        it('should return the extra roles for Agency users', function () {
            var expectedUserRoles = [
                {userRole: 'Data Entry SI', userRoleId:  'k7BWFXkG6zt'},
                {userRole: 'Data Entry EA', userRoleId:  'OKKx4bf4ueV'}
            ];

            scope.user.userType = {name: 'Agency'};

            expect(controller.getDataEntryRolesNotShown()).toEqual(expectedUserRoles);
        });
    });
});
