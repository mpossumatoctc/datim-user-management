beforeEach(function () {
    jasmine.Expectation.addMatchers({
        toBeAnObject: function () {
            return {
                compare: function (actual) {
                    var result = angular.isObject(actual);

                    return {
                        pass: result,
                        message: 'Expected ' + actual + (result ? ' NOT' : '') + ' to be an object'
                    };
                }
            }
        },

        toBeAnArray: function () {
            return {
                compare: function (actual) {
                    var result = angular.isArray(actual);

                    return {
                        pass: result,
                        message: 'Expected ' + actual + (result ? ' NOT' : '') + ' to be an array'
                    };
                }
            };
        },

        toBeAFunction: function () {
            return {
                compare: function (actual) {
                    var result = angular.isFunction(actual);

                    return {
                        pass: result,
                        message: 'Expected ' + actual + (result ? ' NOT' : '') + ' to be an function'
                    };
                }
            }
        },

        toBeAPromiseLikeObject: function () {
            return {
                compare: function (actual) {
                    var result = angular.isFunction(actual.then) &&
                        angular.isFunction(actual.catch) &&
                        angular.isFunction(actual.finally);

                    return {
                        pass: result,
                        message: 'Expected ' + actual + (result ? ' NOT' : '') + ' to have the functions then, catch and finally'
                    };
                }
            }
        }
    });
});
