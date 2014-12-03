angular.module('PEPFAR.usermanagement').service('userTypesService', userTypesService);

function userTypesService($q) {
    var deferred = $q.defer();
    var userTypes = [
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
        var userTypesForMatches = userTypes.map(fixCountryType).reverse();

        return userTypesForMatches.reduce(function (currentType) {
            var userGroupRegex = new RegExp('OU .+? (.+?) ', 'i');
            (user && user.userGroups || []).forEach(function (userGroup) {
                var matches = userGroupRegex.exec(userGroup.name);

                if (matches && (userTypesForMatches.indexOf(matches[1]) >= 0)) {
                    currentType = matches[1];

                    if (currentType.toLowerCase() === 'country') {
                        currentType = 'Inter-Agency';
                    }
                }
            });
            return currentType;
        }, 'Unknown type');

        function fixCountryType(userType) {
            if (userType.name === 'Inter-Agency') {
                return 'Country';
            }
            return userType.name;
        }
    }
}
