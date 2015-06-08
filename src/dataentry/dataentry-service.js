angular.module('PEPFAR.usermanagement').factory('dataEntryService', dataEntryService);

function dataEntryService() {
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
        var activeDataEntryKeys = [];

        Object.keys(dataEntryRoles)
            .forEach(function (dataEntryKey) {
                if (dataEntryRoles[dataEntryKey] === true) {
                    activeDataEntryKeys.push(dataEntryKey);
                }
            });

        // FIXME: Hack for DOD Data Entry
        if (streamName === 'SI' && dataEntryRoles['SI DOD']) {
            return true;
        }
        // FIXME: End Hack for DOD Data Entry

        return activeDataEntryKeys.indexOf(streamName) >= 0;
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

    function setAllDataEntry(userType, userEntity) {
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
                if (userType !== 'Partner') {
                    dataEntryRoles[streamName] = true;
                } else {
                    //Partner specific rules regarding DOD
                    if ((userEntity && streamName === 'SI DOD' && userEntity.dodEntry) ||
                        (userEntity && streamName === 'SI' && userEntity.normalEntry) ||
                        (streamName !== 'SI DOD' && streamName !== 'SI')
                    ) {
                        dataEntryRoles[streamName] = true;
                    }
                }
            });
    }
}
