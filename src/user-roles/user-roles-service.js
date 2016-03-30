angular.module('PEPFAR.usermanagement').factory('userRolesService', userRolesService);

function userRolesService(Restangular, errorHandler) {
    return {
        /**
         * Load all userRoles from the api
         * @returns {Object}
         */
        getAllUserRoles: function () {
            return Restangular
                .one('userRoles')
                .withHttpConfig({cache: true})
                .get({
                    fields: ['id', 'name', 'displayName'].join(','),
                    paging: false
                })
                .then(function (response) {
                    if (response.userRoles && response.userRoles.length) {
                        return response.userRoles;
                    }

                    return [];
                })
                .catch(function (error) {
                    errorHandler.error('Unable to load the user roles: ' + error.message ? error.message : error);
                });
        }
    };
}
