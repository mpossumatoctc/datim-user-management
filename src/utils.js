/* jshint unused:false */
function has(property) {
    return function (item) {
        if (item && item[property]) {
            return true;
        }
        return false;
    };
}

function pick(property) {
    var properties = Array.prototype.filter.apply(arguments, [angular.isString]);

    if (properties.length === 1 && angular.isString(property)) {
        return function (item) {
            return item[property];
        };
    }

    return function (item) {
        var result = {};
        Object.keys(item).map(function (key) {
            if (properties.indexOf(key) >= 0) {
                result[key] = item[key];
            }
        });
        return result;
    };
}

function flatten() {
    return function (current, items) {
        return (current || []).concat(items);
    };
}

/* jshint unused:true */
