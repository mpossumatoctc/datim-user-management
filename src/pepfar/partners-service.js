angular.module('PEPFAR.usermanagement').factory('partnersService', partnersService);

function partnersService($q, Restangular, errorHandler, _) {
    'use strict';

    return {
        getPartners: getPartners
    };

    function getPartners(organisationUnit) {
        return getPartnersForOrganisationUnit(organisationUnit);
    }

    function getPartnersForOrganisationUnit(organisationUnit) {
        var organisationUnitName;

        if (!(organisationUnit && organisationUnit.name && organisationUnit.id)) {
            return $q.reject('No organisation unit found');
        }
        organisationUnitName = organisationUnit.name;

        return $q.all([
                getImplementingPartnerCogs().then(getPartnersFromApi),
                getUserGroups(organisationUnitName)]
            )
            .then(matchPartnersWithUserGroups)
            .then(addDataEntryFlags(organisationUnit.id))
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
            fields: 'categoryOptionGroups[id,name,code]',
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

                return _.sortBy(partnersWithCode, 'name');
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

    function addDataEntryFlags(organisationUnitId) {
        return function (partners) {
            return getDodDataEntryPartnerChecker()
                .then(function (dodDataEntryPartnerData) {
                    partners.forEach(function (partner) {
                        //If the partner is found for in this org unit we have special dataEntry requirements
                        if (dodDataEntryPartnerData[organisationUnitId] &&
                            isPartnerListContainsPartner(dodDataEntryPartnerData[organisationUnitId], partner)) {
                            partner.dodEntry = true;

                            if (isPartnerListContainsPartnerAndHasNonDod(dodDataEntryPartnerData[organisationUnitId], partner)) {
                                partner.normalEntry = true;
                            } else {
                                partner.normalEntry = false;
                            }
                        } else {
                            //If the partner is not in the result we set the defaults
                            partner.dodEntry = false;
                            partner.normalEntry = true;
                        }
                    });
                    return partners;
                });
        };

        function isPartnerListContainsPartner(partnerList, partner) {
            return partnerList.some(function (dodOnlyEntry) {
                return dodOnlyEntry.partner === partner.id;
            });
        }

        function isPartnerListContainsPartnerAndHasNonDod(partnerList, partner) {
            return partnerList.some(function (dodOnlyEntry) {
                return dodOnlyEntry.partner === partner.id && dodOnlyEntry.nondod === '1';
            });
        }

    }

    function getDodDataEntryPartnerChecker() {
        return Restangular
            .all('systemSettings').withHttpConfig({cache: true})
            .get('keyAPP_User_Management-dod_only_SqlView')
            .then(function (data) {
                if (data.value) {
                    return data.value;
                }
                return errorHandler.error('Unable to load keyAPP_User_Management-dod_only_SqlView from SystemSettings');
            })
            .then(function (sqlViewId) {
                return Restangular
                    .all('sqlViews')
                    .all(sqlViewId).withHttpConfig({cache: true})
                    .get('data.json')
                    .then(buildObjectsFromSqlView)
                    .then(function (data) {
                        return _.groupBy(data, 'ou');
                    });
            })
            .catch(errorHandler.error);

        function buildObjectsFromSqlView(sqlViewData) {
            var headers = sqlViewData.headers;
            var rows = sqlViewData.rows;

            return (rows || []).map(function (dataRow) {
                var dataObject = {};
                (headers || []).forEach(function (header, index) {
                    dataObject[header.name] = dataRow[index];
                });
                return dataObject;
            });
        }
    }
}
