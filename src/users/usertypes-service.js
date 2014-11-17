angular.module('PEPFAR.usermanagement').service('userTypesService', userTypesService);

function userTypesService($q) {
    var deferred = $q.defer();
    var userTypes = [
        {name: 'Inter-Agency'},
        {name: 'Agency'},
        {name: 'Partner'}
    ];

    deferred.resolve(userTypes);

    return {
        getUserTypes: getUserTypes
    };

    function getUserTypes() {
        return deferred.promise;
    }
}
