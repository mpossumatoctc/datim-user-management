angular.module('PEPFAR.usermanagement').service('userActionsService', userActionsService);

function userActionsService(_) {
    var availableAgencyActions = [
        'Accept data', 'Submit data', 'Manage users'
    ];
    var availableInterAgencyActions = [
        'Capture inter-agency data', 'Accept data', 'Submit data', 'Manage users'
    ];
    var availablePartnerActions =  [
        'Capture data', 'Submit data', 'Manage users'
    ];
    var actions = [
        {name: 'Capture data', userGroup: '', typeDependent: true},
        {name: 'Capture inter-agency data', userGroup: '', typeDependent: true},
        {name: 'Accept data', userGroup: 'Data accepter'},
        {name: 'Submit data', userGroup: 'Data submitter'},
        {name: 'Manage users', userGroup: 'User administrator'},
        {name: 'Read data', userGroup: 'Data reader', default: true}
    ];

    return {
        actions: actions,
        getActionsFor: getActionsFor
    };

    function getAvailableActionsForUserType(userType) {
        if (typeof userType === 'string') {
            userType = userType.toLowerCase();
        }

        switch (userType) {
            case 'agency':
                return availableAgencyActions;
            case 'partner':
                return availablePartnerActions;
            case 'inter-agency':
                return availableInterAgencyActions;
            default:
                return [];
        }
        return [];
    }

    function getActionsFor(userType) {
        var availableActions = getAvailableActionsForUserType(userType);

        return _.filter(actions, function (action) {
            return (availableActions.indexOf(action.name) >= 0) || action.default;
        });
    }
}
