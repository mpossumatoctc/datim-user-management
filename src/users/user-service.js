angular.module('PEPFAR.usermanagement').factory('userService', userService);

function userService(Restangular) {
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
            userAuthorityGroups:[
                //{'id':'b2uHwX9YLhu'}
            ]
        }
    };

    return {
        getUserObject: getUserObject,
        createUserInvite: createUserInvite,
        getUserInviteObject: getUserInviteObject
    };

    function getUserObject() {
        return {
            userType: undefined,
            userEntity: undefined,
            email: undefined,
            locale: {name: 'en'},
            userActions: {},
            userGroups: [],
            userRoles: [],
            dataGroups: {}
        };
    }

    function createUserInvite() {
        return Restangular.all('users').post();
    }

    function getUserInviteObject(user, dataGroups, allActions, currentUser) {
        var inviteObject = angular.copy(userInviteObjectStructure);
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
            inviteObject.userCredentials.userAuthorityGroups.push({id: action.userRoleId});
        });

        inviteObject.email = user.email;

        //TODO: Create get functions for these on the userobject?
        var orgUnits = (currentUser && currentUser.organisationUnits) || [];
        var dataOrgUnits = (currentUser && currentUser.dataViewOrganisationUnits) || [];

        inviteObject.organisationUnits = orgUnits.map(function (orgUnit) {
            return {id: orgUnit.id};
        });
        inviteObject.dataViewOrganisationUnits = dataOrgUnits.map(function (orgUnit) {
            return {id: orgUnit.id};
        });

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
            if ((selectedActions.indexOf(action.name) >= 0) || action.default === true) {
                return true;
            }
            return false;
        });
    }
}
