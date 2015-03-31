describe('Global User Invite Controller', function () {
    var controller;
    var userServiceMock;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($controller, $injector) {
        var userObjectMock = {
            addEntityUserGroup: jasmine.createSpy()
        };

        userServiceMock = $injector.get('userService');
        userServiceMock.getUserInviteObject = jasmine.createSpy()
            .and.returnValue(userObjectMock);

        controller = $controller('globalUserInviteController', {
            dataGroups: [],
            userActions: {},
            currentUser: {
                isGlobalUser: function () {
                    return true;
                },
                isUserAdministrator: function () {
                    return true;
                },
                hasAllAuthority: function () {
                    return false;
                }
            },
            userGroups: {
                userUserGroup: {
                    id: 'gh9tn4QBbKZ',
                    name: 'Global Users'
                },
                userAdminUserGroup: {
                    id: 'ghYxzrKHldx',
                    name: 'Global User Administrators'
                },
                mechUserGroup: {
                    id: 'TOOIJWRzJ3g',
                    name: 'Global all mechanisms'
                }
            }
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    it('should have a isProcessing property', function () {
        expect(controller.isProcessing).toBe(false);
    });

    describe('getErrorString', function () {
        it('should be a function', function () {
            expect(controller.getErrorString).toBeAFunction();
        });
    });

    describe('invite', function () {
        it('should be a method', function () {
            expect(controller.invite).toBeAFunction();
        });

        it('should set processing to true', function () {
            controller.invite();

            expect(controller.isProcessing).toBe(true);
        });

        it('should call the addEntityUserGroup method on the userObject with the users userGroup', function () {
            controller.invite();

            expect(userServiceMock.getUserInviteObject().addEntityUserGroup)
                .toHaveBeenCalledWith({id: 'gh9tn4QBbKZ', name: 'Global Users'});
        });

        it('should call the addEntityUserGroup method with the user admin group if admin is set', function () {
            controller.user.userActions['Manage users'] = true;

            controller.invite();

            expect(userServiceMock.getUserInviteObject().addEntityUserGroup)
                .toHaveBeenCalledWith({id: 'ghYxzrKHldx', name: 'Global User Administrators'});
        });

        it('should not call the addEntityUserGroup method with the user admin group if admin is not set', function () {
            controller.user.userActions['Manage users'] = false;

            controller.invite();

            expect(userServiceMock.getUserInviteObject().addEntityUserGroup)
                .not.toHaveBeenCalledWith({id: 'ghYxzrKHldx', name: 'Global User Administrators'});
        });

        it('should add the all mechanisms usergroup for global users', function () {
            controller.invite();

            expect(userServiceMock.getUserInviteObject().addEntityUserGroup)
                .toHaveBeenCalledWith({id: 'TOOIJWRzJ3g', name: 'Global all mechanisms'});
        });
    });
});
