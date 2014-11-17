angular.module('PEPFAR.usermanagement').factory('localeService', localeService);

function localeService(Restangular) {
    var localeResource = Restangular
        .all('locales')
        .all('ui')
        .getList();

    return {
        getUiLocales: getUiLocales
    };

    function getUiLocales() {
        return localeResource;
    }
}
