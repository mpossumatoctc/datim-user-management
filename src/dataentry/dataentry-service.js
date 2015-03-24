angular.module('PEPFAR.usermanagement').factory('dataEntryService', dataEntryService);

function dataEntryService() {
    var streamNameRegExp = /(\w+)/i;
    var dataEntryRoles = {};

    return {
        dataEntryRoles: dataEntryRoles,
        reset: reset,
        hasDataEntryForStream: hasDataEntryForStream
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
}
