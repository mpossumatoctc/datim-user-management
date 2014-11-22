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
            var partnerMechRegExp = new RegExp('^OU .+? Partner .+? all mechanisms - ' + partner.name + '$', 'i');
            var partnerUserRegExp = new RegExp('^OU .+? Partner .+? users - ' + partner.name + '$', 'i');
            var userAdminUserGroup = new RegExp('^OU .+? Partner .+? user administrators - ' + partner.name + '$', 'i');

            userGroups.forEach(function (userGroup) {
                if (partnerMechRegExp.test(userGroup.name)) {
                    partner.mechUserGroup = userGroup;
                }

                if (partnerUserRegExp.test(userGroup.name)) {
                    partner.userUserGroup = userGroup;
                }

                if (userAdminUserGroup.test(userGroup.name)) {
                    partner.userAdminUserGroup = userGroup;
                }
            });

            return partner;
        };
    }

    function partnersWithUserGroupId(partner) {
        return partner.mechUserGroup && partner.mechUserGroup.id &&
            partner.userUserGroup && partner.userUserGroup.id;
    }

    function getPartnersFromApi() {
        return Restangular
            .all('dimensions')
            .all('BOyWrF33hiR')
            .get('items', {paging: 'false'})
            .then(function (response) {
                return response.items;
            });
    }

    function getUserGroups(organisationUnitName) {
        var queryParams = {
            fields: 'id,name',
            filter: [
                ['name', 'like', [organisationUnitName, 'partner'].join(' ')].join(':')
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
