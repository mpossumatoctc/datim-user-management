angular.module('PEPFAR.usermanagement').factory('partnersService', partnersService);

function partnersService($q, currentUserService, Restangular, errorHandler) {

    return {
        getPartners: getPartners
    };

    function getPartners() {
        return currentUserService.getCurrentUser()
            .then(getPartnersForUser);
    }

    function getPartnersForUser(user) {
        var organisationUnitName;

        if (!(user.organisationUnits && user.organisationUnits[0] && user.organisationUnits[0].name)) {
            return $q.reject('No organisation unit found on the current user');
        }
        organisationUnitName = user.organisationUnits[0].name;

        return $q.all([getPartnersFromApi(), getUserGroups(organisationUnitName)])
            .then(matchPartnersWithUserGroups)
            .catch(errorHandler.errorFn(['No partners found in', organisationUnitName, 'that you can access all mechanisms for'].join(' ')));
    }

    function matchPartnersWithUserGroups(responses) {
        var partners = responses[0] || [];
        var userGroups = responses[1] || [];

        partners = partners
            .map(addUserGroupsToPartners(userGroups))
            .filter(partnersWithUserGroupId);

        if (partners.length > 0) {
            return partners;
        }
        return $q.reject('No partners found matching given userGroups and partners');
    }

    function addUserGroupsToPartners(userGroups) {
        return function (partner) {
            var partnerNameRegExp = new RegExp('OU .+? Partner .+? all mechanisms - ' + partner.name, 'i');

            partner.userGroup = userGroups.reduce(function (curr, userGroup) {
                if (partnerNameRegExp.test(userGroup.name)) {
                    return userGroup;
                }
                return curr;
            }, partner.userGroup);
            return partner;
        };
    }

    function partnersWithUserGroupId(partner) {
        return partner.userGroup && partner.userGroup.id;
    }

    function getPartnersFromApi() {
        return Restangular
            .all('dimensions')
            .all('BOyWrF33hiR')
            .get('items', {
                paging: 'false'
            }).then(function (response) {
                return response.items;
            });
    }

    function getUserGroups(organisationUnitName) {
        var queryParams = {
            fields: 'id,name',
            filter: [
                ['name', 'like', [organisationUnitName, 'partner'].join(' ')].join(':'),
                ['name', 'like', 'mechanisms'].join(':')
            ],
            paging: false
        };

        return Restangular
            .one('userGroups')
            .get(queryParams)
            .then(function (userGroups) {
                return userGroups.userGroups || [];
            });
    }
}
