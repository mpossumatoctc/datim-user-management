describe('Error handler service', function () {
    var service;
    var $window;
    var $log;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector, errorHandler) {
        service = errorHandler;
        $window = $injector.get('$window');
        $log = $injector.get('$log');

        spyOn($window, 'alert');
        spyOn($log, 'error');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('error', function () {
        beforeEach(function () {
            spyOn(service, 'alert');
        });
        it('should be a function', function () {
            expect(service.error).toBeAFunction();
        });

        it('should extract the message from the error object', function () {
            service.error({
                status: 404
            });
            expect($log.error).toHaveBeenCalledWith('Requested resource was not found');
        });

        it('should call with just the message if the message is a string', function () {
            service.error('ErrorString');

            expect($log.error).toHaveBeenCalledWith('ErrorString');
        });
    });

    describe('alert', function () {
        it('should be a function', function () {
            expect(service.alert).toBeAFunction();
        });

        it('should call alert on the window', function () {
            service.alert();
            expect($window.alert).toHaveBeenCalled();
        });

        it('should call alert with the correct message', function () {
            service.alert('Error message');
            expect($window.alert).toHaveBeenCalledWith('Error message');
        });

        it('should call $log.error with the correct message', function () {
            service.alert('Error message');
            expect($log.error).toHaveBeenCalledWith('Error message');
        });
    });

    describe('errorFn', function () {
        it('should be a function', function () {
            expect(service.errorFn).toBeAFunction();
        });

        it('should return a function', function () {
            expect(service.errorFn('ErrorMessage')).toBeAFunction();
        });

        it('the returned function should call the error function', function () {
            spyOn(service, 'error');

            service.errorFn('ErrorMessage')();

            expect(service.error).toHaveBeenCalled();
        });

        it('the returned function should call the error function with the right message', function () {
            spyOn(service, 'error');

            service.errorFn('ErrorMessage')();

            expect(service.error).toHaveBeenCalledWith('ErrorMessage');
        });
    });
});
