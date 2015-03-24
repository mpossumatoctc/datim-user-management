angular.module('PEPFAR.usermanagement').directive('umDataEntry', dataEntryDirective);

function dataEntryDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            dataGroups: '=',
            isUserManager: '=',
            user: '='
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
            var userGroupsThatApplyForDataEntryForUserType = vm.userActions.getDataEntryRestrictionDataGroups(vm.user.userType.name);

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
            var dataStreamRegExp = /(\w+)/i;

            return dataStreamRegExp.test(dataEntryName) ? dataStreamRegExp.exec(dataEntryName)[1] : dataEntryName;
        }

        function initialise() {
            $q.all([currentUserService.getCurrentUser(), userActionsService.getActions()])
                .then(function (responses) {
                    vm.currentUser = responses[0];
                    vm.userActions = responses[1];
                })
                .then(registerWatch)
                .catch(function () {
                    notify.error('Error while loading data for the data entry directive');
                });
        }

        function registerWatch() {
            //TODO: See if we can do this without a watch
            $scope.$watch(function () {
                return vm.user.userType;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal && newVal && newVal.name) {
                    vm.dataEntryStreamNamesForUserType = userUtils.getDataEntryStreamNamesForUserType(vm.currentUser, vm.userActions, newVal.name);
                }
            });
        }

        initialise();
    }
}
