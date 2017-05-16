angular.module('PEPFAR.usermanagement').factory('schemaAuthorizationsService', schemaAuthorizationsService);

function schemaAuthorizationsService(Restangular, schemaStoresService, $q, _) {
    // Debug
    var authorizations = Promise.resolve(require('./schema').authorizations);
    console.log('schemaAuthorizationsService authorizations = ', authorizations);
    //var authorizations = Restangular.all('dataStore')
    //    .all('datim-user-management')
    //    .get('authorizations')
    //    .then(filterAuthorizations);

    var userRoles = schemaStoresService.get('User Roles');
    var currentUser = schemaStoresService.get('Current User');

    return {
        getActionsForUser: getActionsForUser
    };

    function getActionsForUser(user) {
        return $q.all([authorizations, userRoles, currentUser])
            .then(function (responses) {
                var authorizations = responses[0];
                var roles = responses[1];
                var currentUser = responses[2];

                var context = getContext(user);

                var groups = currentUser.userGroups;

                var actions = authorizations.filter(function (authorization) {
                    return evaluateAuthority(context, authorization.requires);
                }).map(function (authorization) {
                    var action = {
                        name: authorization.name,
                        hasAction: evaluateAuthority(context, authorization.grants),
                        grant: applyGrantsToUser(authorization, roles, groups, false),
                        revoke: applyGrantsToUser(authorization, roles, groups, true)
                    };
                    return action;
                });

                return actions;
            });
    }

    function getContext(user) {
        return {
            user: user,
            organisationUnits: user.organisationUnits.map(function (o) { return o.name; }),
            userRoles: user.userCredentials.userRoles.map(function (o) { return o.name; }),
            userGroups: user.userGroups.map(function (o) { return o.name; }),

            get: function get(name) {
                return this[name] || this[name + 's'];
            }
        };
    }

    function filterAuthorizations(response) {
        var authorizations = response.plain();
        return _.values(authorizations).filter(function (a) {
            return (a.disabled !== true && a.disabled != 'true');
        });
    }

    function evaluateAuthority(context, collection, isOrCondition) {
        var fn = (isOrCondition === true ? 'some' : 'every');
        return (collection || [])[fn](function (item) {
            if (item.$and) {
                return evaluateAuthority(context, item.$and);
            }

            if (item.$or) {
                return evaluateAuthority(context, item.$or, true);
            }

            return (context.get(item.type) || []).indexOf(item.name) !== -1;
        });
    }

    function applyGrantsToUser(authorization, roles, groups, shouldRemove) {
        return function (user) {
            var contextMappings = {
                userRole: [ roles, user.userCredentials.userRoles ],
                userGroup: [ groups, user.userGroups ]
            };

            authorization.grants.forEach(function (grant) {
                if (!(grant.type in contextMappings)) { return; }

                var source = contextMappings[grant.type][0];
                var target = contextMappings[grant.type][1];

                var indexOfGrant = _.findIndex(target, { name: grant.name });
                if (shouldRemove && indexOfGrant !== -1) {
                    target.splice(indexOfGrant, 1);
                }
                else if (!shouldRemove && indexOfGrant === -1) {
                    var toAdd = _.find(source, { name: grant.name });
                    if (toAdd) {
                        target.push(toAdd);
                    }
                }
            });
        };
    }
}
