function userTypesService($q) {
    var deferred = $q.defer();
    var userTypes = [
        {name: 'Inter-Agency'},
        {name: 'Agency'},
        {name: 'Partner'}
    ];

    this.getUserTypes = function () {
        return deferred.promise;
    };

    deferred.resolve(userTypes);
}

angular.module('PEPFAR.usermanagement').service('userTypesService', userTypesService);
