describe('Global User Edit Controller', function () {
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

        controller = $controller('globalUserEditController', {
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
});
