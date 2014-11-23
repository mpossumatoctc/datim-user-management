angular.module('PEPFAR.usermanagement').service('errorHandler', errorHandlerService);

function errorHandlerService($q, $log, notify) {
    var errorMessages = {
        404: 'Requested resource was not found'
    };
    var sv = this;

    this.error = error;
    this.warning = warning;
    this.errorFn = function (message) {
            return function () {
                return sv.error(message);
            };
        };

    this.warningFn = function (message) {
        return function () {
            return sv.warning(message);
        };
    };

    function error(message) {
        if (message.status) {
            $log.error(errorMessages[message.status]);
            notify.error(errorMessages[message.status]);
        } else {
            $log.error(message);
            notify.error(message);
        }
        return $q.reject(message);
    }

    function warning(message) {
        if (message.status) {
            $log.error(errorMessages[message.status]);
            notify.warning(errorMessages[message.status]);
        } else {
            $log.error(message);
            notify.warning(message);
        }
        return $q.reject(message);
    }
}
