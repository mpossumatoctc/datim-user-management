angular.module('PEPFAR.usermanagement').factory('userUtils', userUtilsService);

function userUtilsService() {
    var previousDataGroups;
    var previousUserActions;

    return {
        setAllDataStreamsAndEntry: setAllDataStreamsAndEntry,
        storeDataStreamsAndEntry: storeDataStreamsAndEntry,
        restoreDataStreamsAndEntry: restoreDataStreamsAndEntry,
        setAllActions: setAllActions,
        storeUserActions: storeUserActions,
        restoreUserActions: restoreUserActions
    };

    /**
     * Saves the passed object to be retrieved by `restoreDataStreamsAndEntry`. And returns a new Object with
     * the same keys as the passed one, the object values for the streams will have their access
     * and entry set to `true`.
     *
     * @param {Object} dataGroups
     * @returns {Object}
     *
     * @throws {Error} When `dataGroups` is not an object
     */
    function setAllDataStreamsAndEntry(dataGroups) {
        throwWhenNotObject(dataGroups, 'dataGroups');

        previousDataGroups = dataGroups;

        return _.chain(dataGroups)
            .mapValues(function () {
                return {access: true, entry: true};
            })
            .value();
    }

    function storeDataStreamsAndEntry(dataGroups) {
        throwWhenNotObject(dataGroups, 'dataGroups');

        previousDataGroups = dataGroups;
    }

    /**
     * Returns the previously set dataGroups object if it is available. Otherwise will return the passed in
     * current dataGroups object.
     *
     * @param {Object} dataGroups
     * @returns {Object}
     *
     * @throws {Error} When `dataGroups` is not an object
     */
    function restoreDataStreamsAndEntry(dataGroups) {
        throwWhenNotObject(dataGroups, 'dataGroups');

        return previousDataGroups || dataGroups;
    }

    /**
     * Creates and returns a new object based on the actions in `allActions`.
     * Uses the action names as keys and sets the values to true.
     *
     * @param {Array} allActions
     * @returns {Object}
     *
     * @throws {Error} When `allActions` is not an array
     */
    function setAllActions(allActions) {
        throwWhenNotArray(allActions, 'allActions');

        return _.chain(allActions)
            .filter(function (action) {
                return action.default ? false : true;
            })
            .map(function (value) {
                return value.name;
            })
            .reduce(function (result, actionName) {
                result[actionName] = true;

                return result;
            }, {})
            .value();
    }

    /**
     * Saves the value from `userActions` to be retrieved by `restoreUserActions`.
     *
     * @param {Object} userActions
     *
     * @throws {Error} When `userActions` is not an object
     */
    function storeUserActions(userActions) {
        throwWhenNotObject(userActions, 'userActions');

        previousUserActions = userActions;
    }

    /**
     * Returns previously saved userActions object or returns the passed in userActions object if there is no
     * previously saved value
     *
     * @param {Object} userActions
     * @returns {Object}
     *
     * @throws {Error} When `userActions` is not an object
     */
    function restoreUserActions(userActions) {
        throwWhenNotObject(userActions, 'userActions');

        return previousUserActions || userActions;
    }

    function throwWhenNotObject(value, name) {
        if (!angular.isObject(value)) {
            throw new Error('Expected passed value "' + name + '" to be an object');
        }
    }

    function throwWhenNotArray(value, name) {
        if (!Array.isArray(value)) {
            throw new Error('Expected passed value "' + name + '" to be an array');
        }
    }
}
