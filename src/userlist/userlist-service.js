angular.module('PEPFAR.usermanagement').factory('userListService', userListService);

function userListService($q, Restangular, paginationService, userUtils, errorHandler, webappManifest) {
    var fields = ['id', 'firstName', 'surname', 'email', 'organisationUnits[name,displayName,id]', 'userCredentials[username,disabled,userRoles[id,name,displayName]]', 'userGroups[name,displayName,id]'];
    var filters = [];
    var pendingRequest = null;

    return {
        getList: getList,
        pagination: paginationService,
        setFilter: setFilter,
        getFilters: getFilters,
        resetFilters: resetFilters,
        removeFilter: removeFilter,
        filters: filters,
        getCSVUrl: getCSVUrl,
        downloadAsCSV: downloadAsCSV
    };

    function getList() {
        if (pendingRequest) {
            pendingRequest.resolve();
        }

        pendingRequest = $q.defer();

        return Restangular.one('users')
            .withHttpConfig({ timeout: pendingRequest.promise })
            .get(getRequestParams())
            .then(function (data) {
                pendingRequest = null;
                return data;
            })
            .then(setPagination)
            .then(extractUsers)
            .catch(function (err) {
                if (err && err.status !== 0) {
                    errorHandler.error('Unable to get the list of users from the server');
                }
            });
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

    function createCSVFromUsers(users) {
        var actions = userUtils.getAllActions();
        var getter = function (name, property, falseValue, trueValue) {
            return function (user) {
                if (!user) { return name; }

                var val = typeof property === 'function' ? property(user) : user[property];

                return (val ? (trueValue || val) : (falseValue || val)) || '';
            };
        };

        var fields = [
            getter('Last Updated', 'lastUpdated'),
            getter('Created', 'created'),
            getter('id', 'id'),
            getter('First Name', 'firstName'),
            getter('Surname', 'surname'),
            getter('E-mail', 'email'),
            getter('Active', function (user) { return !user.userCredentials.disabled; }, 'N', 'Y'),
            getter('Username', 'username'),
            getter('Account Type', '$accountType'),
            getter('Organisations', '$orgUnits')
        ];

        return userUtils.getAllDataGroups().then(function (dataGroups) {
            // push data group columns / getters
            dataGroups.forEach(function (dataGroup) {
                fields.push(getter(dataGroup.name + ' Access', function (user) {
                    return user.$dataGroups[dataGroup.name] && user.$dataGroups[dataGroup.name].access;
                }, 'N', 'Y'));

                fields.push(getter(dataGroup.name + ' Data Entry', function (user) {
                    return user.$dataGroups[dataGroup.name] && user.$dataGroups[dataGroup.name].entry;
                }, 'N', 'Y'));
            });

            // push actions columns / getters
            actions.forEach(function (action) {
                fields.push(getter(action.name, function (user) {
                    return user.$actions[action.name];
                }, 'N', 'Y'));
            });

            return dataGroups;
        }).then(function (dataGroups) {
            var promises = users.map(function (user) {
                return userUtils.extendUser(user, dataGroups).then(function (extended) {
                    return fields.map(function (getter) {
                        return getter(extended);
                    }).join(',');
                });
            });
            return $q.all(promises);
        }).then(function (csvUserData) {
            var headers = fields.map(function (getter) { return getter(); }).join(',');
            var data = csvUserData.join('\r\n');

            var csvBlob = new Blob([ headers, '\r\n', data ], { type: 'text/csv' });
            var csvUrl = URL.createObjectURL(csvBlob);

            FileSaver.saveAs(csvBlob, "users.csv", true);
        });
    }

    function getRequestParams() {
        cleanFilters();
        return {
            fields: fields.join(','),
            page: paginationService.getCurrentPage(),
            pageSize: paginationService.getPageSize(),
            filter: filters,
            canManage: 'true'
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

    function downloadAsCSV() {
        return Restangular.one('users')
            .get(addExtraFieldsForCSVObject(removePagingParameters(getRequestParams())))
            .then(extractUsers)
            .then(createCSVFromUsers)
            .catch(function (err) {
                if (err && err.status !== 0) {
                    errorHandler.error('Unable to get the list of users from the server');
                }
            });
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

    function addExtraFieldsForCSVObject(query) {
        addExtraFieldsForCSV(query)('fields');
        return query;
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
