angular.module('PEPFAR.usermanagement').service('agenciesService', agenciesService);

function agenciesService(Restangular) {
    this.getAgencies = function () {
        return Restangular.all('dimensions')
            .all('bw8KHXzxd9i')
            .get('items', {
                paging: 'false'
            }).then(function (response) {
                //Extract the items from the response
                return response.items;
            });
    };
}
