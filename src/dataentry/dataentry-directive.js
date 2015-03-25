angular.module('PEPFAR.usermanagement').directive('umDataEntry', dataEntryDirective);

function dataEntryDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            isUserManager: '=',
            user: '=',
            userType: '=',
            userToEdit: '='
        },
        bindToController: true,
        controller: umDataEntryController,
        controllerAs: 'umDataEntryCtrl',
        templateUrl: 'dataentry/dataentry.html'
    };

    function umDataEntryController($q, $scope, userActionsService, currentUserService, userUtils, notify, errorHandler, dataEntryService) {
        var vm = this;

        vm.updateDataEntry = updateDataEntry;
        vm.dataEntryRoles = dataEntryService;

        function updateDataEntry(dataEntryName) {
            var streamName = getStreamNameFromDataEntryName(dataEntryName);
            var userGroupsThatApplyForDataEntryForUserType = vm.userActions
                    .getDataEntryRestrictionDataGroups(vm.userType || vm.user.userType.name);

            if (!angular.isString(dataEntryName)) {
                errorHandler.debug('Update data entry the streamname given is invalid');
                return;
            }

            if (userGroupsThatApplyForDataEntryForUserType.indexOf(dataEntryName) >= 0) {
                //If data entry is given, also give the stream access
                if (dataEntryName && vm.user.dataGroups[streamName]) {
                    if (vm.user.dataGroups[streamName].access === false) {
                        vm.user.dataGroups[streamName].access = true;
                    }
                }
            }
        }

        function getStreamNameFromDataEntryName(dataEntryName) {
            //TODO: Remove this when the word is out on the key pops name thing
            return dataEntryName === 'SIMS Key Pops' ? 'SIMS Key Populations' : dataEntryName;
        }

        function initialise() {
            $q.all([currentUserService.getCurrentUser(), userActionsService.getActions()])
                .then(function (responses) {
                    vm.currentUser = responses[0];
                    vm.userActions = responses[1];
                    dataEntryService.userActions = vm.userActions;
                })
                .then(registerWatch)
                .catch(function () {
                    notify.error('Error while loading data for the data entry directive');
                });
        }

        function registerWatch() {
            if (vm.userType) {
                //Get the usertype for the current user
                vm.dataEntryStreamNamesForUserType = userUtils.getDataEntryStreamNamesForUserType(vm.currentUser, vm.userActions, vm.userType);

                var userRoleIds = vm.userToEdit.userCredentials.userRoles.map(function (userRole) {
                    return userRole.id;
                });

                Object.keys(vm.userActions.dataEntryRestrictions[vm.userType]).forEach(function (dataEntryName) {
                    var hasEntryRolesRequired = vm.userActions.dataEntryRestrictions[vm.userType][dataEntryName].every(function (expectedRole) {
                        return userRoleIds.indexOf(expectedRole.userRoleId) >= 0;
                    });

                    if (hasEntryRolesRequired) {
                        dataEntryService.dataEntryRoles[dataEntryName] = true;
                    }
                });

                //FIXME: Special case hack for the 'Data Entry SI Country Team' case
                var hasInterAgencySI = vm.userToEdit.userCredentials.userRoles.some(function (userRole) {
                    return userRole.name === 'Data Entry SI Country Team';
                });

                if (hasInterAgencySI) {
                    dataEntryService.dataEntryRoles.SI = true;
                }
                //End hack
            } else {
                //Register a watch for the invite screen as usertype changes
                //TODO: See if we can do this without a watch
                $scope.$watch(function () {
                    return vm.user.userType;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal && newVal && newVal.name) {
                        vm.dataEntryStreamNamesForUserType = userUtils.getDataEntryStreamNamesForUserType(vm.currentUser, vm.userActions, newVal.name);
                    }
                });
            }
        }

        initialise();
    }
}
