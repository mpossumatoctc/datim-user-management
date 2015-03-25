angular.module('PEPFAR.usermanagement').factory('dataEntryService', dataEntryService);

function dataEntryService() {
    var streamNameRegExp = /(\w+)/i;
    var dataEntryRoles = {};
    var dataEntryRolesCache = [];

    return {
        userActions: {},
        dataEntryRoles: dataEntryRoles,
        reset: reset,
        restore: restore,
        hasDataEntryForStream: hasDataEntryForStream,
        setAllDataEntry: setAllDataEntry
    };

    function hasDataEntryForStream(streamName) {
        var filteredGroups = {};

        Object.keys(dataEntryRoles)
            .forEach(function (dataEntryKey) {
                filteredGroups[getStreamName(dataEntryKey)] = filteredGroups[getStreamName(dataEntryKey)] || [];
                filteredGroups[getStreamName(dataEntryKey)].push(dataEntryKey);
            });

        if (filteredGroups[streamName]) {
            return filteredGroups[streamName].reduce(function (current, entryKey) {
                return current || dataEntryRoles[entryKey];
            }, false);
        }
        return false;
    }

    function getStreamName(dataEntryName) {
        return streamNameRegExp.test(dataEntryName) ? streamNameRegExp.exec(dataEntryName)[1] : dataEntryName;
    }

    function reset() {
        Object.keys(dataEntryRoles).forEach(function (dataEntryKey) {
            delete dataEntryRoles[dataEntryKey];
        });
    }

    function restore() {
        reset();
        dataEntryRolesCache.forEach(function (dataEntryKey) {
            dataEntryRoles[dataEntryKey] = true;
        });
    }

    function setAllDataEntry(userType) {
        if (!angular.isString(userType)) {
            throw new Error('Passed usertype should be a string');
        }

        dataEntryRolesCache = [];
        Object.keys(dataEntryRoles).forEach(function (dataEntryKey) {
            if (dataEntryRoles[dataEntryKey] === true) {
                dataEntryRolesCache.push(dataEntryKey);
            }
        });

        Object.keys(this.userActions.dataEntryRestrictions[userType])
            .forEach(function (streamName) {
                dataEntryRoles[streamName] = true;
            });
    }
}
