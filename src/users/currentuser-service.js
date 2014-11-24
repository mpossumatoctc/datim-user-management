angular.module('PEPFAR.usermanagement').factory('currentUserService', currentUserService);

function currentUserService($q, Restangular, errorHandler) {
    var currentUserPromise;

    initialise();
    return {
        getCurrentUser: getCurrentUser
    };

    function initialise() {
        currentUserPromise = $q.all([requestCurrentUser(), requestUserAuthorities()])
            .then(function (responses) {
                var currentUser = responses[0];
                var userAuthorities = responses[1];

                currentUser.authorities = userAuthorities;

                //Add convenience methods to the userObject
                currentUser.hasAllAuthority = hasAllAuthority.bind(currentUser.authorities);
                currentUser.hasUserRole = hasUserRole.bind(currentUser);
                currentUser.isUserAdministrator = isUserAdministrator.bind(currentUser);

                return currentUser;
            }, errorHandler.errorFn('Failed to load the current user data'));
    }

    function requestCurrentUser() {
        return Restangular.one('me').get();
    }

    function requestUserAuthorities() {
        return Restangular.all('me').get('authorization');
    }

    function getCurrentUser() {
        return currentUserPromise;
    }

    //*************************************************************************
    // User functions
    function hasAllAuthority() {
        return this.indexOf('ALL') >= 0;
    }

    function hasUserRole(userRoleName) {
        if (!this.userCredentials || !this.userCredentials.userRoles) {
            return false;
        }

        return this.userCredentials.userRoles.some(function (userRole) {
            return userRoleName === userRole.name;
        });
    }

    function isUserAdministrator() {
        return this.hasUserRole('User Administrator');
    }
}
