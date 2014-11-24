describe('Add user controller', function () {
    var scope;
    var currentUserMock;

    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.value('interAgencyService', {getUserGroups: function () {}});
    }));
    beforeEach(function () {
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
    });

    describe('basic structure', function () {
        var controller;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: undefined,
                dimensionConstraint: {},
                userActionsService: {
                    getActionsFor: function () {
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
            expect(controller.dataGroups).toEqual([]);
        });

        it('should have an array for actions', function () {
            expect(controller.actions).toEqual([]);
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
                MER: false,
                EA: false,
                SIMS: false
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
        var userActionsServiceMock;
        var expectedActions;

        beforeEach(inject(function ($controller, $rootScope) {
            expectedActions = [
                {name: 'Submit data', userGroup: 'Data submitter'},
                {name: 'Manage users', userGroup: 'User administrator'},
                {name: 'Read data', userGroup: 'Data reader', default: true}
            ];

            userActionsServiceMock = {
                getActionsFor: jasmine.createSpy().and.returnValue(expectedActions)
            };

            scope = $rootScope.$new();
            scope.user = {
                userType: undefined
            };

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: undefined,
                dimensionConstraint: {},
                userActionsService: userActionsServiceMock,
                currentUser: currentUserMock(),
                $state: {} //Fake the state to not load the default
            });
            scope.$apply();
        }));

        it('should ask for new actions when the userType changes', function () {
            scope.user.userType = {name: 'Partner'};
            scope.$apply();

            expect(userActionsServiceMock.getActionsFor).toHaveBeenCalledWith('Partner');
        });

        it('should store the available actions onto the controller', function () {
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
                scope.user.dataGroups.MER = true;

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

        function createController(allAuthority, userRole) {
            $controller('addUserController', {
                $scope: scope,
                userTypes: undefined,
                dataGroups: undefined,
                dimensionConstraint: {},
                userActionsService: {
                    getActionsFor: function () {
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
    });

    describe('userInviteObject', function () {
        var controller;
        var userservice;

        beforeEach(inject(function ($controller, $rootScope, userService) {
            scope = $rootScope.$new();
            userservice = userService;
            spyOn(userService, 'inviteUser').and.returnValue({
                then: function () {

                }
            });

            controller = $controller('addUserController', {
                $scope: scope,
                userTypes: [],
                dataGroups: [],
                dimensionConstraint: {id: 'SomeID'},
                currentUser: currentUserMock(),
                userService: userservice
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

            expect(controller.userInviteObject.groups[0]).toEqual({id: 'agencyGroupIdMech'});
            expect(controller.userInviteObject.groups[1]).toEqual({id: 'agencyGroupIdUsers'});
        });

        describe('user manager usergroup', function () {
            beforeEach(function () {
                scope.user.userActions['Manage users'] = true;
                scope.user.userEntity = {
                    userAdminUserGroup: {
                        id: 'userAdminUserGroup'
                    }
                };
            });

            it('should add the user manager group when the user manager role is present', function () {
                controller.addUser();

                expect(controller.userInviteObject.groups[0]).toEqual({id: 'userAdminUserGroup'});
            });

            it('should not add the user manager group when the user manager role is present but false', function () {
                scope.user.userActions['Manage users'] = false;

                controller.addUser();

                expect(controller.userInviteObject.groups.length).toBe(0);
            });

            it('should not add the user manager group when the user manager role is present but not the group', function () {
                scope.user.userEntity = {
                };

                controller.addUser();

                expect(controller.userInviteObject.groups.length).toBe(0);
            });

            it('should call the inviteUser method on the user service', function () {
                controller.addUser();
                expect(userservice.inviteUser).toHaveBeenCalled();
            });
        });
    });
});
