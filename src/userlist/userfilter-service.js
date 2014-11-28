angular.module('PEPFAR.usermanagement').service('userFilterService', userFilterService);

function userFilterService($q, userTypesService) {
    var deferred = $q.defer();
    var userFilter = [
        {name: 'Name'},
        {name: 'Username'},
        {name: 'E-Mail'},
        {name: 'Roles'},
        {name: 'User Groups'},
        {name: 'Organisation Unit'}
    ];

    deferred.resolve(userFilter);

    initialise();
    return {
        getUserFilter: getUserFilter
    };

    function initialise() {
        userTypesService.getUserTypes().then(function (userTypes) {
            userFilter.push({name: 'Types', secondary: userTypes});
        });
    }

    function getUserFilter() {
        return deferred.promise;
    }
}
