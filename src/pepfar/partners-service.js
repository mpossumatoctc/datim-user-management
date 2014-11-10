function partnersService(Restangular) {
    this.getPartners = function () {
        return Restangular
            .all('dimensions')
            .all('BOyWrF33hiR')
            .get('items', {
                paging: 'false'
            }).then(function (response) {
                return response.items;
            });
    };
}

angular.module('PEPFAR.usermanagement').service('partnersService', partnersService);
