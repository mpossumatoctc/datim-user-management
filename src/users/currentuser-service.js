angular.module('PEPFAR.usermanagement').factory('currentUserService', currentUserService);

function currentUserService($q, Restangular) {
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

                return currentUser;
            });
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
        if (!this.userCredentials || !this.userCredentials.userAuthorityGroups) {
            return false;
        }

        return this.userCredentials.userAuthorityGroups.some(function (userRole) {
            return userRoleName === userRole.name;
        });
    }
}
