/* global pick */
angular.module('PEPFAR.usermanagement').factory('userUtils', userUtilsService);

function userUtilsService(errorHandler) {
    var previousDataGroups;
    var previousUserActions;

    return {
        getUserRestrictionsDifference: getUserRestrictionsDifference,
        getDataGroupsForUserType: getDataGroupsForUserType,
        getDataEntryStreamNamesForUserType: getDataEntryStreamNamesForUserType,
        setAllDataStreams: setAllDataStreams,
        storeDataStreams: storeDataStreams,
        restoreDataStreams: restoreDataStreams,
        setAllActions: setAllActions,
        storeUserActions: storeUserActions,
        restoreUserActions: restoreUserActions,
        hasUserAdminRights: hasUserAdminRights,
        hasAdminUserGroup: hasAdminUserGroup,
        hasUserGroup: hasUserGroup,
        hasUserRole: hasUserRole,
        hasStoredData: hasStoredData
    };

    function getUserRestrictionsDifference(userRestrictionsForTypeLeft, userRestrictionsForTypeRight) {
        var assignedUserManagerRoles = _.chain(userRestrictionsForTypeLeft)
            .values()
            .flatten()
            .map(_.compose(_.values, _.partialRight(_.pick, ['userRoleId'])))
            .flatten()
            .value();

        return _.chain(userRestrictionsForTypeRight)
            .filter(function (userRole) {
                return assignedUserManagerRoles.indexOf(userRole.userRoleId) === -1;
            })
            .value();
    }

    function getDataGroupsForUserType(dataGroups, getUserType) {
        if (getUserType() === 'Partner') {
            errorHandler.debug('Partner type found remove sims as datagroup');
            return _.chain(dataGroups)
                .reject({name: 'SIMS'})
                .reject({name: 'SIMS Key Populations'})
                .value();
        }
        return dataGroups || [];
    }

    function getDataEntryStreamNamesForUserType(currentUser, userActions, getUserType) {
        if (!(currentUser && currentUser.userCredentials && Array.isArray(currentUser.userCredentials.userRoles))) {
            errorHandler.debug('currentUser.userCredentials.userRoles was not found on the currentUser object');
            return [];
        }

        var userType = angular.isString(getUserType) ? getUserType : getUserType();
        var userEntryDataEntryStreams = userActions.getDataEntryRestrictionDataGroups(userType)
            .filter(function (streamName) {
                return currentUser.hasAllAuthority() || currentUser.userCredentials.userRoles
                        .map(pick('name'))
                        .some(function (roleName) {
                            return roleName === ['Data Entry', streamName].join(' ') ||
                                (streamName === 'SI' && /^Data Entry SI(?: Country Team)?$/.test(roleName));
                        });
            });

        errorHandler.debug('The following data entry streams were found based on your userroles or ALL authority and the selected usertype: ', userEntryDataEntryStreams);

        return userEntryDataEntryStreams;
    }

    /**
     * Saves the passed object to be retrieved by `restoreDataStreams`. And returns a new Object with
     * the same keys as the passed one, the object values for the streams will have their access
     * and entry set to `true`.
     *
     * @param {Object} dataGroups
     * @returns {Object}
     *
     * @throws {Error} When `dataGroups` is not an object
     */
    function setAllDataStreams(dataGroups) {
        throwWhenNotObject(dataGroups, 'dataGroups');

        previousDataGroups = dataGroups;

        return _.chain(dataGroups)
            .mapValues(function () {
                return {access: true};
            })
            .value();
    }

    function storeDataStreams(dataGroups) {
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
    function restoreDataStreams(dataGroups) {
        throwWhenNotObject(dataGroups, 'dataGroups');

        return previousDataGroups || dataGroups;
    }

    /**
     * Creates and returns a new object based on the actions in `allActions`.
     * Uses the action names as keys and sets the values to true.
     *
     * @param {Array} allActions
     * @param {Boolean} includeDefaults When true returns actions marked as defaults too.
     * @returns {Object}
     *
     * @throws {Error} When `allActions` is not an array
     */
    function setAllActions(allActions, includeDefaults) {
        throwWhenNotArray(allActions, 'allActions');

        return _.chain(allActions)
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

    function hasUserAdminRights(user) {
        return hasUserRole(user, {name: 'User Administrator'}) && hasAdminUserGroup(user);
    }

    function hasAdminUserGroup(user) {
        var adminUserGroupRegex = /user administrators/i;

        return (user.userGroups || []).reduce(function (current, userGroup) {
            return current || adminUserGroupRegex.test(userGroup.name);
        }, false);
    }

    function hasUserGroup(user, userGroupToCheck) {
        return (user.userGroups || []).reduce(function (current, userGroup) {
            return current || (userGroup.name === userGroupToCheck.name);
        }, false);
    }

    function hasUserRole(user, userRoleToCheck) {
        return (user && user.userCredentials && user.userCredentials.userRoles || []).reduce(function (current, userRole) {
            return current || (userRole.name === userRoleToCheck.name);
        }, false);
    }

    function hasStoredData() {
        return previousDataGroups && previousUserActions ? true : false;
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
