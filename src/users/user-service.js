angular.module('PEPFAR.usermanagement').factory('userService', userService);

function userService($q, Restangular) {
    var userInviteObjectStructure = {
        email:'',
        organisationUnits:[
            //{'id':'ybg3MO3hcf4'}
        ],
        dataViewOrganisationUnits:[
            //{'id':'ybg3MO3hcf4'}
        ],
        groups: [
            //{'id':'iuD8wUFz95X'},
            //{'id':'gh9tn4QBbKZ'}
        ],
        userCredentials:{
            userRoles:[
                //{'id':'b2uHwX9YLhu'}
            ]
        }
    };

    return {
        getUserObject: getUserObject,
        getUserInviteObject: getUserInviteObject,
        inviteUser: inviteUser,
        verifyInviteData: verifyInviteData,
        saveUserLocale: saveUserLocale,
        getSelectedDataGroups: getSelectedDataGroups,
        getUser: getUser,
        getUserLocale: getUserLocale
    };

    function getUserObject() {
        return angular.copy({
            userType: undefined,
            userEntity: undefined,
            email: undefined,
            locale: {name: 'en'},
            userActions: {},
            userGroups: [],
            userRoles: [],
            dataGroups: {}
        });
    }

    function getInviteObject() {
        var inviteObject = Object.create(getUserInviteProto());
        return angular.extend(inviteObject, angular.copy(userInviteObjectStructure));
    }

    function getUserInviteProto() {
        return {
            addDimensionConstraint: addDimensionConstraint,
            addEmail: addEmail,
            addEntityUserGroup: addEntityUserGroup
        };

        function addDimensionConstraint(dimension) {
            if (!this.userCredentials.catDimensionConstraints) {
                this.userCredentials.catDimensionConstraints = [];
            }
            if (dimension && dimension.id) {
                this.userCredentials.catDimensionConstraints.push({id: dimension.id});
            }

        }

        function addEmail(email) {
            this.email = email;
        }

        function addEntityUserGroup(userGroup) {
            this.groups = this.groups || [];

            if (userGroup && userGroup.id) {
                this.groups.push({id: userGroup.id});
            }
        }
    }

    function getUserInviteObject(user, dataGroups, allActions, currentUser) {
        var inviteObject = getInviteObject();
        var selectedDataGroups = getSelectedDataGroups(user, dataGroups);
        var actions = getActionsForGroups(user, selectedDataGroups, allActions);

        //Add the usergroups to the invite object
        selectedDataGroups.forEach(function (dataGroup) {
            inviteObject.groups = inviteObject.groups.concat(dataGroup.userGroups.map(function (userGroup) {
                return {id: userGroup.id};
            }));
        });

        //Add the user actions to the invite object
        actions.forEach(function (action) {
            if (action.userRoleId) {
                inviteObject.userCredentials.userRoles.push({id: action.userRoleId});
            }
        });

        //TODO: Create get functions for these on the userobject?
        var orgUnits = (currentUser && currentUser.organisationUnits) || [];
        var dataOrgUnits = (currentUser && currentUser.dataViewOrganisationUnits) || [];

        inviteObject.organisationUnits = orgUnits.map(function (orgUnit) {
            return {id: orgUnit.id};
        });
        inviteObject.dataViewOrganisationUnits = dataOrgUnits.map(function (orgUnit) {
            return {id: orgUnit.id};
        });

        inviteObject.addEmail(user.email);

        return inviteObject;
    }

    function getSelectedActions(user) {
        return Object.keys(user.userActions).filter(function (key) {
            return this[key];
        }, user.userActions);
    }

    function getSelectedDataGroupNames(user) {
        return Object.keys(user.dataGroups).filter(function (key) {
            return this[key];
        }, user.dataGroups);
    }

    function getSelectedDataGroups(user, dataGroups) {
        var selectedDataGroupNames = getSelectedDataGroupNames(user);

        return dataGroups.filter(function (dataGroup) {
            return selectedDataGroupNames.indexOf(dataGroup.name) >= 0;
        });
    }

    function getActionsForGroups(user, selectedDataGroups, actions) {
        var selectedActions = getSelectedActions(user);

        return selectedDataGroups.map(function (dataGroup) {
            return actions.map(function (action) {

                if (action.typeDependent === true) {
                    action.userRole = action.userRole.replace(/{{.+}}/, dataGroup.name);
                }

                dataGroup.userRoles.forEach(function (userRole) {
                    if (action.userRole === userRole.name) {
                        action.userRoleId = userRole.id;
                    }
                });

                return action;
            });
        }).reduce(function (actions, current) {
            if (angular.isArray(actions)) { actions = []; }

            return actions.concat(current);
        }, actions).filter(function (action) {
            if (((selectedActions.indexOf(action.name) >= 0) || action.default === true) && isRequiredDataStreamSelected(action.dataStream, selectedDataGroups)) {
                return true;
            }
            return false;
        });
    }

    function isRequiredDataStreamSelected(dataGroupNames, selectedDataGroups) {
        if (Array.isArray(dataGroupNames) && dataGroupNames.length > 0) {
            return selectedDataGroups.reduce(function (curr, dataGroup) {
                return dataGroupNames.indexOf(dataGroup.name) >= 0 || curr;
            }, false);
        }
        return true;
    }

    function inviteUser(inviteData) {
        if (!angular.isObject(inviteData) && !null) {
            return $q.reject('Invalid invite data');
        }

        return Restangular
            .all('users')
            .all('invite')
            .post(inviteData)
            .then(function (response) {
                if (response.status !== 'SUCCESS' ||
                    response.importCount.imported !== 1 ||
                    response.importCount.updated !== 0 ||
                    response.importCount.ignored !== 0 ||
                    response.importCount.ignored !== 0) {
                    return $q.reject('Invite response not as expected');
                }
                return Restangular
                    .all('users')
                    .get(response.lastImported);
            })
            .catch(function (error) {
                if (angular.isString(error)) {
                    return $q.reject(error);
                }
                return $q.reject('Invite failed');
            });
    }

    function verifyInviteData(inviteObject) {
        if (verifyEmail(inviteObject.email) && verifyOrganisationUnits(inviteObject) &&
            verifyUserRoles(inviteObject.userCredentials) && verifyUserGroups(inviteObject.groups)) {
            return true;
        }
        return false;
    }

    function verifyEmail(email) {
        if (email) {
            return true;
        }
        return false;
    }

    function verifyOrganisationUnits(inviteObject) {
        if ((inviteObject.organisationUnits.length > 0 && inviteObject.organisationUnits[0].id) &&
            inviteObject.dataViewOrganisationUnits.length > 0 &&  inviteObject.dataViewOrganisationUnits[0].id) {
            return true;
        }
        return false;
    }

    function verifyUserRoles(userCredentials) {
        if (userCredentials && userCredentials.userRoles && userCredentials.userRoles.length > 0) {
            return true;
        }
        return false;
    }

    function verifyUserGroups(groups) {
        if (Array.isArray(groups) && groups.length > 0) {
            return true;
        }
        return false;
    }

    function saveUserLocale(username, locale) {
        if (username === undefined || username === '') {
            throw new Error('Username required');
        }

        if (locale === undefined || locale === '') {
            throw new Error('Locale required');
        }

        return Restangular.one('userSettings')
            .one('keyUiLocale')
            .post(undefined, locale, {user: username}, {'Content-Type': 'text/plain'})
            .then(function () {
                return locale;
            });
    }

    function getUserLocale(userName) {
        var deferred = $q.defer();

        Restangular
            .all('userSettings')
            .get('keyUiLocale', {user: userName})
            .then(function (locale) {
                deferred.resolve({
                    name: locale,
                    code: locale
                });
            })
            .catch(function () {
                deferred.resolve(undefined);
            });

        return deferred.promise;
    }

    function getUser(userId) {
        return Restangular
            .all('users')
            .get(userId, {
                fields: ['id', 'name', 'email', 'organisationUnits', 'userCredentials[code,disabled,userRoles]', 'userGroups'].join(',')
            });
    }
}
