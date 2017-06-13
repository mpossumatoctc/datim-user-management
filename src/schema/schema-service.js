angular.module('PEPFAR.usermanagement').factory('schemaService', schemaService);

function schemaService(schemaStoresService, schemaI18nService) {
    return {
        i18n: schemaI18nService,
        store: schemaStoresService
    };
}
