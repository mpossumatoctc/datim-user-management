angular.module('PEPFAR.usermanagement').factory('schemaStoresService', schemaStoresService);

function schemaStoresService(Restangular, errorHandler, schemaExtensionsService, $q, _) {
    // TODO: Debug - should originate from the DHIS2 data store
    var storeData = require('./schema').stores;

    var storeMap = {};
    var stores = Promise.resolve(storeData).then(loadStores);

    var api = {
        get: getStoreByName
    };

    window.schemaStore = api;

    return api;

    function getContext(store, args) {
        var context = { requires: {} };

        (store.args || []).reduce(function (context, argName, argIndex) {
            context[argName] = args[argIndex];
            return context;
        }, context);

        if (!store.requires) { return $q.when(context); }

        return $q.all(store.requires.map(function (name) { return storeMap[name]; })).then(function (stores) {
            store.requires.reduce(function (requires, name, index) {
                requires[name] = stores[index];
                return requires;
            }, context.requires);
            return context;
        });
    }

    function loadStores(stores) {
        stores.forEach(function (store) {
            if (store.type === 'dynamic') {
                storeMap[store.name] = store;
            }
            else if (store.requires) {
                storeMap[store.name] = getContext(store).then(function (context) {
                    var clone = angular.fromJson(angular.toJson(store));
                    if (clone.config) {
                        if (clone.config.get) {
                            Object.keys(clone.config.get).forEach(function (key) {
                                clone.config.get[key] = _.template(clone.config.get[key])(context);
                            });
                        }
                        if (clone.config.endpoint) {
                            clone.config.endpoint = _.template(clone.config.endpoint)(context);
                        }
                    }

                    return $q.all(loadStore(clone, context)).then(function (data) {
                        store.data = data.pop();
                        bindExtensions(store, context.requires);
                        return store.data;
                    });
                });
            }
            else {
                storeMap[store.name] = $q.all(loadStore(store)).then(function (data) {
                    store.data = data.pop();
                    bindExtensions(store, {});
                    return store.data;
                });
            }
        });

        return storeMap;
    }

    function loadStore(store, context) {
        var name = store.name;
        var type = (store.type || 'REST').toLowerCase();
        var storeConfig = store.config;

        var promises = getAsyncExtensions(store);

        function evalFilter(data, filter) {
            if (!filter) { return data; }

            (angular.isArray(filter) ? filter : [ filter ]).forEach(function (filter) {
                try {
                    var argNames = Object.keys(context || {});
                    var argValues = argNames.map(function (name) { return context[name]; });

                    data = schemaExtensionsService
                        .bind(data, 'getFiltered', { type: 'function', config: filter, args: argNames })
                        .getFiltered.apply(data, argValues);

                    if (data && data.getFiltered) {
                        delete data.getFiltered;
                    }
                } catch (err) {
                    console.log('schema-stores-service: loadStore.evalFilter failed to invoke for store [' + store.name + '] filter: ' + filter);
                    console.error(err);
                    throw err;
                }
            });

            return data;
        }

        var promise = null;

        switch (type) {
            case 'static':
                promise = $q.when(evalFilter(storeConfig || [], store.filter));
                break;
            case 'rest':
                var datamodel = storeConfig.datamodel;
                var endpoint = storeConfig.endpoint || datamodel;
                var httpConfig = angular.extend({ cache: true }, storeConfig.httpConfig);

                var getParams = angular.extend({ fields: 'id,name', paging: false }, storeConfig.get);
                var getArgs = [getParams];
                if (getParams.id) {
                    getArgs.splice(0, 0, getParams.id);
                    delete getParams.id;
                }

                if (storeConfig.get === null) {
                    getArgs.length = 0;
                }

                promise = Restangular[(getArgs.length > 1 ? 'all' : 'one')](endpoint)
                    .withHttpConfig(httpConfig)
                    .get(getArgs[0], getArgs[1])
                    .then(function (response) {
                        var data = response;
                        if (!angular.isArray(data) && datamodel && datamodel in response) {
                            data = response[datamodel];
                        }

                        return evalFilter(data, storeConfig.filter) || [];
                    })
                    .catch(function (err) {
                        errorHandler.error('Unable to load ' + name + ': ' + err.message ? err.message : err);
                    });
                break;
            default:
                throw 'type ' + type + ' is not supported.';
                break;
        }

        if (promise) {
            promises.push(promise);
        }

        return promises;
    }

    function loadDynamicStore(store) {
        var args = safeCloneArguments(arguments, 1);

        if (store.preflight && !schemaExtensionsService.isTruthy(store.preflight, store.args, args)) {
            return $q.reject('preflight failed - the arguments and / or condition [' + store.preflight + '] is invalid');
        }

        return getContext(store, args).then(function (context) {
            var configs = angular.isArray(store.config) ? store.config : [store.config];
            configs = angular.fromJson(angular.toJson(configs));

            var promises = configs.map(function (config) {
                Object.keys(config.get || {}).forEach(function (key) {
                    config.get[key] = _.template(config.get[key])(context);
                });
                return loadStore({ name: config.name, type: 'REST', config: config }, context);
            }).reduce(function (arr, promises) { return arr.concat(promises); }, []);

            return $q.all(promises).then(function (results) {
                if (results.length <= 1) { return results[0]; }

                return results.reduce(function (obj, value, index) {
                    obj[configs[index].name] = value;
                    return obj;
                }, {});
            });
        });
    }

    function getAsyncExtensions(store) {
        return Object.keys(store.extend || {}).filter(function (key) {
            return (store.extend[key].type || '').toLowerCase() === 'rest';
        }).map(function (key) {
            var restStore = store.extend[key];
            restStore.name = key;

            return $q.all(loadStore(restStore)).then(function (data) {
                return restStore.data = data.pop();
            });
        });
    }

    function bindExtensions(store, requires) {
        Object.keys(store.extend || {}).forEach(function (key) {
            var target = store.extend[key].target || 'collection';
            if (target === 'item' && angular.isArray(store.data)) {
                store.data.forEach(function (data) {
                    schemaExtensionsService.bind(data, key, store.extend[key], requires);
                });
            }
            else {
                schemaExtensionsService.bind(store.data, key, store.extend[key], requires);
            }
        });
    }

    function safeCloneArguments(args, startAt) {
        var clonedArgs = [];
        for (var i = (startAt || 0); i < args.length; i++) {
            clonedArgs.push(args[i]);
        }
        return clonedArgs;
    }

    function getStoreByName(name, context, synchronous) {
        var args = safeCloneArguments(arguments, 1);

        if (arguments.length === 2 && typeof context === 'boolean') {
            synchronous = context;
            context = undefined;
        }

        if (synchronous === true) {
            var store = _.find(storeData, { name: name });
            return (!store ? null : store.data || null);
        }

        return stores.then(function (map) {
            var store = map[name];
            if (!store || store.type !== 'dynamic') {
                return store;
            }

            args.splice(0, 0, store);
            return loadDynamicStore.apply(this, args);
        });
    }
}