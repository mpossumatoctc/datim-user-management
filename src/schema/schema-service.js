angular.module('PEPFAR.usermanagement').factory('schemaService', schemaService);

function schemaService(schemaStoresService, schemaAuthorizationsService) {
    return {
        store: schemaStoresService,
        authorization: schemaAuthorizationsService
    };
}
