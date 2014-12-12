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

        return $q.all([
                getImplementingPartnerCogs().then(getPartnersFromApi),
                getUserGroups(organisationUnitName)]
            )
            .then(matchPartnersWithUserGroups)
            .catch(errorHandler.debugFn(['No partners found in', organisationUnitName, 'that you can access all mechanisms for'].join(' ')));
    }

    function matchPartnersWithUserGroups(responses) {
        var partners = responses[0] || [];
        var userGroups = responses[1] || [];

        partners = partners
            .map(addUserGroupsToPartners(userGroups))
            .filter(partnersWithUserGroupId);

        if (partners && partners.length > 0) {
            errorHandler.debug(
                errorHandler.message(['Found', partners.length, 'partners for which you can also access the required user groups.']),
                partners
            );

            return partners;
        }
        return $q.reject('No partners found matching given userGroups and partners');
    }

    function addUserGroupsToPartners(userGroups) {
        return function (partner) {
            var partnerMechRegExp = userGroupRegExp(partner, 'all mechanisms');
            var partnerUserRegExp = userGroupRegExp(partner, 'users');
            var userAdminUserGroup = userGroupRegExp(partner, 'user administrators');

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

    function userGroupRegExp(partner, userGroupType) {
        return new RegExp(['^OU .+?', underscoreToSpace(partner.code), userGroupType, '- .+$'].join(' '), 'i');
    }

    function underscoreToSpace(code) {
        var partnerCodeRegExp = new RegExp('^Partner_', '');

        return (code || '').replace(partnerCodeRegExp, 'Partner ');
    }

    function partnersWithUserGroupId(partner) {
        return partner.mechUserGroup && partner.mechUserGroup.id &&
            partner.userUserGroup && partner.userUserGroup.id;
    }

    function getPartnersFromApi(cogsId) {
        var queryParams = {
            fields: 'categoryOptionGroups',
            paging: 'false'
        };

        return Restangular
            .all('categoryOptionGroupSets').withHttpConfig({cache: true})
            .get(cogsId, queryParams)
            .then(function (response) {
                errorHandler.debug(
                    errorHandler.message(['Found', (response.categoryOptionGroups && response.categoryOptionGroups.length) || 0, 'partners that you can access'])
                );

                return response.categoryOptionGroups;
            })
            .then(function (partners) {
                var partnersWithCode = (partners || []).filter(function (partner) {
                    return (partner && angular.isString(partner.code) && partner.code !== '');
                });

                errorHandler.debug(errorHandler.message(['Of the accessible partners', partnersWithCode.length, 'has/have a code']), partnersWithCode);

                return partnersWithCode;
            });
    }

    function getImplementingPartnerCogs() {
        return Restangular
            .one('categoryOptionGroupSets').withHttpConfig({cache: true})
            .get({
                fields: 'id',
                filter: 'name:eq:Implementing Partner',
                paging: false
            })
            .then(function (response) {
                var categoryOptionGroupSets = response.categoryOptionGroupSets || [];

                if (categoryOptionGroupSets.length !== 1) {
                    return $q.reject('None or more than one categoryOptionGroupSets found that match "Implementing Partner"');
                }
                return categoryOptionGroupSets[0].id;
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
            .one('userGroups').withHttpConfig({cache: true})
            .get(queryParams)
            .then(function (userGroups) {

                errorHandler.debug(
                    errorHandler.message(['Found ', userGroups.userGroups.length, 'usergroups whos name contains', '"', [organisationUnitName.trim(), 'Partner'].join(' '), '"']),
                    userGroups.userGroups
                );

                return userGroups.userGroups || [];
            });
    }
}
