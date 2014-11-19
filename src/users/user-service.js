angular.module('PEPFAR.usermanagement').factory('userService', userService);

function userService(Restangular) {
    return {
        getUserObject: getUserObject,
        createUserInvite: createUserInvite
    };

    function getUserObject() {
        return {
            userType: undefined,
            userEntity: undefined,
            email: undefined,
            locale: {name: 'en'},
            userActions: {},
            userGroups: [],
            userRoles: [],
            dataGroups: {}
        };
    }

    function createUserInvite() {
        return Restangular.all('users').post();
    }
}
