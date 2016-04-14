angular.module('PEPFAR.usermanagement').factory('userListService', userListService);

function userListService(Restangular, paginationService, errorHandler, webappManifest) {
    var fields = ['id', 'firstName', 'surname', 'email', 'organisationUnits[name,displayName,id]', 'userCredentials[username,disabled,userRoles[id,name,displayName]]', 'userGroups[name,displayName,id]'];
    var filters = [];

    return {
        getList: getList,
        pagination: paginationService,
        setFilter: setFilter,
        getFilters: getFilters,
        resetFilters: resetFilters,
        removeFilter: removeFilter,
        filters: filters,
        getCSVUrl: getCSVUrl
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
        cleanFilters();
        return {
            fields: fields.join(','),
            page: paginationService.getCurrentPage(),
            pageSize: paginationService.getPageSize(),
            filter: filters,
            manage: 'true'
        };
    }

    function getFilters() {
        return filters;
    }

    function setFilter(filter) {
        filters.push(filter);
    }

    function resetFilters() {
        filters = [];
    }

    function removeFilter(index) {
        filters.splice(index, 1);
    }

    function cleanFilters() {
        var arr = [];
        for (var i = 0, len = filters.length; i < len; i = i + 1) {
            if (filters[i].length > 0) {
                arr.push(filters[i]);
            }
        }
        filters = arr;
    }

    function getCSVUrl() {
        var userEndPointUrl = [webappManifest.activities.dhis.href, 'api', 'users.csv'].join('/');
        return [userEndPointUrl, getHrefQuery()].join('?');
    }

    function getHrefQuery() {
        var queryParameters = removePagingParameters(getRequestParams());

        var queryParams =  Object.keys(queryParameters)
            .filter(function (queryVariableKey) {
                return (angular.isString(queryParameters[queryVariableKey]) ||
                    Array.isArray(queryParameters[queryVariableKey])) &&
                    queryParameters[queryVariableKey].length !== 0;
            })
            .map(addExtraFieldsForCSV(queryParameters))
            .map(function (queryVariableKey) {
                if (angular.isString(queryParameters[queryVariableKey])) {
                    return [
                        encodeURIComponent(queryVariableKey),
                        encodeSingleQueryParameterValue(queryParameters[queryVariableKey])
                    ].join('=');
                }
                return [
                    encodeMultipleQueryParameterValues(queryParameters[queryVariableKey], queryVariableKey)
                ].join('=');
            });
        queryParams.push('paging=false');

        return queryParams.join('&');
    }

    function addExtraFieldsForCSV(queryParameters) {
        return function (key) {
            if (key === 'fields') {
                queryParameters[key] = [
                    queryParameters[key], 'created', 'lastUpdated'
                ].join(',');
            }
            return key;
        };
    }

    function removePagingParameters(queryParametersObject) {
        delete queryParametersObject.page;
        delete queryParametersObject.pageSize;

        return queryParametersObject;
    }

    function encodeSingleQueryParameterValue(value) {
        return value.split(',').map(function (value) {
            return encodeURIComponent(value);
        }).join(',');
    }

    function encodeMultipleQueryParameterValues(values, key) {
        return values.map(function (value) {
            return [key, value].join('=');
        }).join('&');
    }
}
