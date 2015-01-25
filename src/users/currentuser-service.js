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
                currentUser.isGlobalUser = isGlobalUser;

                return currentUser;
            }, errorHandler.errorFn('Failed to load the current user data'));
    }

    function requestCurrentUser() {
        return Restangular.one('me').withHttpConfig({cache: true}).get({
            fields: ':all,userCredentials[:owner,!userGroupAccesses],!userGroupAccesses'
        });
    }

    function requestUserAuthorities() {
        return Restangular.all('me').withHttpConfig({cache: true}).get('authorization');
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

    function isGlobalUser() {
        var organisationUnit = this.organisationUnits && this.organisationUnits[0];

        return organisationUnit && organisationUnit.name === 'Global';
    }
}
