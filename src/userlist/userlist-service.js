angular.module('PEPFAR.usermanagement').factory('userListService', userListService);

function userListService(Restangular, paginationService, errorHandler) {
    var fields = ['id', 'name', 'email', 'organisationUnits', 'userCredentials[code,disabled,userRoles]', 'userGroups'];

    return {
        getList: getList,
        pagination: paginationService
    };

    function getList() {
        return Restangular.one('users')
            .get(getRequestParams())
            .then(setPagination)
            .then(extractUsers)
            .catch(errorHandler.errorFn('Unable to get the list of users from the server'));
    }

    function setPagination(response) {
        if (response.pager) {
            paginationService.setPagination(response.pager);
        }
        return response;
    }

    function extractUsers(response) {
        return response.users || [];
    }

    function getRequestParams() {
        return {
            fields: fields.join(','),
            page: paginationService.getCurrentPage(),
            pageSize: paginationService.getPageSize()
        };
    }
}
