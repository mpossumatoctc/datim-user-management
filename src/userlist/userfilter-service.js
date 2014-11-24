angular.module('PEPFAR.usermanagement').service('userFilterService', userFilterService);

function userFilterService($q) {
    var deferred = $q.defer();
    var userFilter = [
        {name: 'Name'},
        {name: 'Username'},
        {name: 'E-Mail'},
        {name: 'Roles'},
        {name: 'User Groups'},
        {name: 'Organisation Unit'},
        {name: 'Types'}
    ];

    deferred.resolve(userFilter);

    return {
        getUserFilter: getUserFilter
    };

    function getUserFilter() {
        return deferred.promise;
    }
}
