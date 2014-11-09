function dataGroupsService($q) {
    var deferred = $q.defer();

    var dataGroups = [
        {name: 'MER'},
        {name: 'EA'},
        {name: 'SIMS'}
    ];

    this.getDataGroups = function () {
        return deferred.promise;
    };

    deferred.resolve(dataGroups);
}

angular.module('PEPFAR.usermanagement').service('dataGroupsService', dataGroupsService);
