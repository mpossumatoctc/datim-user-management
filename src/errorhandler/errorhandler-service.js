angular.module('PEPFAR.usermanagement').service('errorHandler', errorHandlerService);

function errorHandlerService($log, $window) {
    var errorMessages = {
        404: 'Requested resource was not found'
    };
    var sv = this;

    this.error = error;
    this.alert = alert;
    this.errorFn = function (message) {
            return function () {
                sv.error(message);
            };
        };

    function error(message) {
        if (message.status) {
            alert(errorMessages[message.status]);
        } else {
            alert(message);
        }
    }

    function alert(message) {
        $log.error(message);
        $window.alert(message);
    }
}
