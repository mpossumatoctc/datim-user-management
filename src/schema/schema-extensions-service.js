angular.module('PEPFAR.usermanagement').factory('schemaExtensionsService', schemaExtensionsService);

function schemaExtensionsService() {
    return {
        bind: bind,
        isTruthy: isTruthy
    };

    function isTruthy(expression, argumentNames, argumentValues) {
        return bind({}, 'isTruthy', { type: 'function', config: expression, args: argumentNames })
            .isTruthy.apply(null, argumentValues);
    }

    function bind(obj, name, definition, requires) {
        if (typeof definition !== 'object') { // static value
            obj[name] = definition;
            return obj;
        }

        // HACK: This is hacky...
        if (requires) {
            obj.__requires = requires;
        }

        var type = definition.type.toLowerCase();
        switch (type) {
            case 'rest':
                // schemaStoresService should have already invoked the REST call and assigned data
                obj[name] = definition.data;
                break;
            case 'getter':
                Object.defineProperty(obj, name, {
                    get: compile(definition.config, definition.args).bind(obj)
                });
                break;
            case 'function':
                obj[name] = compile(definition.config, definition.args).bind(obj)
                break;
            default:
                throw 'unable to create function as the type "' + type + '" is unknown';
        }

        return obj;
    }

    function compile(body, args) {
        try {
            var ret = "try { return " + body + "; } catch (err) { console.log('schema-extensions-service.compiled: error in expression: " + body.replace(/'/g, "\\'") + "'); console.error(err); throw err; }";
            switch ((args || []).length) {
                case 0: return new Function(ret);
                case 1: return new Function(args[0], ret);
                case 2: return new Function(args[0], args[1], ret);
                case 3: return new Function(args[0], args[1], args[2], ret);
                case 4: return new Function(args[0], args[1], args[2], args[3], ret);
                case 5: return new Function(args[0], args[1], args[2], args[3], args[4], ret);
                case 6: return new Function(args[0], args[1], args[2], args[3], args[4], args[5], ret);
                case 7: return new Function(args[0], args[1], args[2], args[3], args[4], args[5], args[6], ret);
                case 8: return new Function(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], ret);
                case 9: return new Function(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], ret);
                default:
                    throw 'unable to create function as the argument list is too long';
            }
        } catch (err) {
            console.log('schema-extensions-service: unable to compile expression: ' + body);
            console.error(err);
            throw err;
        }
    }
}
