function localeService(Restangular) {
    var localeResource = Restangular
        .all('locales')
        .all('ui')
        .getList();

    this.getUiLocales = function () {
        return localeResource;
    };
}

angular.module('PEPFAR.usermanagement').service('localeService', localeService);
