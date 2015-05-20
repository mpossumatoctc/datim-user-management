angular.module('PEPFAR.usermanagement').service('userTypesService', userTypesService);

function userTypesService($q) {
    var deferred = $q.defer();
    var userTypes = [
        {name: 'Global'},
        {name: 'Inter-Agency'},
        {name: 'Agency'},
        {name: 'Partner'}
    ];

    deferred.resolve(userTypes);

    return {
        getUserTypes: getUserTypes,
        getUserType: getUserType
    };

    function getUserTypes() {
        return deferred.promise;
    }

    function getUserType(user) {
        var userTypesForMatches = userTypes
            .map(function (userType) {
                return userType.name;
            })
            .reverse();

        return userTypesForMatches.reduce(function (currentType) {
            var partnerRegex = new RegExp('^OU .+? (Partner) ', 'i');
            var agencyRegex = new RegExp('^OU .+? (Agency) ', 'i');
            var interAgencyRegex = new RegExp('^OU .+? Country team$', 'i');

            (user && user.userGroups || []).forEach(function (userGroup) {
                var matches = partnerRegex.exec(userGroup.name);
                if (!matches) {
                    matches = agencyRegex.exec(userGroup.name);
                }

                if (matches && (userTypesForMatches.indexOf(matches[1]) >= 0)) {
                    if (userTypesForMatches.indexOf(matches[1]) >= 0) {
                        currentType = matches[1];
                    }
                } else {
                    if (interAgencyRegex.test(userGroup.name)) {
                        currentType = 'Inter-Agency';
                    }
                }
            });
            return currentType;
        }, 'Unknown type');
    }
}
