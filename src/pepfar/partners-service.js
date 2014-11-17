angular.module('PEPFAR.usermanagement').factory('partnersService', partnersService);

function partnersService(Restangular) {

    return {
        getPartners: getPartners
    };

    function getPartners() {
        return Restangular
            .all('dimensions')
            .all('BOyWrF33hiR')
            .get('items', {
                paging: 'false'
            }).then(function (response) {
                return response.items;
            });
    }
}
