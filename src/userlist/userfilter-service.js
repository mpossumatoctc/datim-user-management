angular.module('PEPFAR.usermanagement').service('userFilterService', userFilterService);

function userFilterService($q, userTypesService, organisationUnitService, currentUserService) {
    var deferred = $q.defer();
    var userFilter = [
        {name: 'Name'},
        {name: 'Username'},
        {name: 'E-Mail'}
    ];

    deferred.resolve(userFilter);

    initialise();
    return {
        getUserFilter: getUserFilter
    };

    function initialise() {
        organisationUnitService.getOrganisationUnitsForLevel(3)
            .then(function (organisationUnits) {
                userFilter.push({name: 'Organisation Unit', secondary: organisationUnits});
            });

        userTypesService.getUserTypes()
            .then(function (userTypes) {
                userTypes = userTypes.map(function (userType) {
                    if (userType.name === 'Inter-Agency') {
                        userType.value = 'Country team';
                    }
                    return userType;
                });
                userFilter.push({name: 'Types', secondary: userTypes});
            });

        // TODO: Write some tests for this..
        currentUserService.getCurrentUser()
            .then(function (currentUser) {
                if (currentUser && currentUser.userCredentials.userRoles && angular.isArray(currentUser.userCredentials.userRoles)) {
                    var userRoleFilters = currentUser.userCredentials.userRoles.map(function (userRole) {
                        return {name: userRole.name};
                    });
                    if (userRoleFilters.length) {
                        userFilter.push({name: 'User Role', secondary: userRoleFilters});
                    }
                }

                if (currentUser && currentUser.userGroups && angular.isArray(currentUser.userGroups)) {
                    var userGroupFilters = currentUser.userGroups.map(function (userGroup) {
                        return {name: userGroup.name};
                    });

                    if (userGroupFilters.length) {
                        userFilter.push({name: 'User Group', secondary: userGroupFilters});
                    }
                }
            });
    }

    function getUserFilter() {
        return deferred.promise;
    }
}
