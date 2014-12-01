describe('Error handler service', function () {
    var service;
    var notify;
    var $log;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector, errorHandler) {
        service = errorHandler;
        notify = $injector.get('notify');
        $log = $injector.get('$log');

        spyOn($log, 'error');
        spyOn(notify, 'error');
        spyOn(notify, 'warning');
        spyOn($log, 'debug');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('error', function () {
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

        it('should extract the message from the error object', function () {
            service.error({
                status: 404
            });
            expect(notify.error).toHaveBeenCalledWith('Requested resource was not found');
        });

        it('should call with just the message if the message is a string', function () {
            service.error('ErrorString');

            expect(notify.error).toHaveBeenCalledWith('ErrorString');
        });
    });

    describe('warning', function () {
        it('should be a function', function () {
            expect(service.warning).toBeAFunction();
        });

        it('should extract the message from the error object', function () {
            service.warning({
                status: 404
            });
            expect($log.error).toHaveBeenCalledWith('Requested resource was not found');
        });

        it('should call with just the message if the message is a string', function () {
            service.warning('ErrorString');

            expect($log.error).toHaveBeenCalledWith('ErrorString');
        });

        it('should extract the message from the error object an', function () {
            service.warning({
                status: 404
            });
            expect(notify.warning).toHaveBeenCalledWith('Requested resource was not found');
        });

        it('should call with just the message if the message is a string', function () {
            service.warning('ErrorString');

            expect(notify.warning).toHaveBeenCalledWith('ErrorString');
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

    describe('warningFn', function () {
        it('should be a function', function () {
            expect(service.warningFn).toBeAFunction();
        });

        it('should return a function', function () {
            expect(service.warningFn('ErrorMessage')).toBeAFunction();
        });

        it('the returned function should call the error function', function () {
            spyOn(service, 'warning');

            service.warningFn('ErrorMessage')();

            expect(service.warning).toHaveBeenCalled();
        });

        it('the returned function should call the error function with the right message', function () {
            spyOn(service, 'warning');

            service.warningFn('ErrorMessage')();

            expect(service.warning).toHaveBeenCalledWith('ErrorMessage');
        });
    });

    describe('debug', function () {
        var settings;
        beforeEach(inject(function (SETTINGS) {
            $log.debug.calls.reset();
            settings = SETTINGS;
            settings.debug = true;
        }));

        it('should be a function', function () {
            expect(service.debug).toBeAFunction();
        });

        it('should call with just the message if the message is a string', function () {
            service.debug('ErrorString');

            expect($log.debug).toHaveBeenCalledWith('ErrorString');
        });

        it('should still reject the promise if the debug is off', function () {
            var result;
            service.isDebugOn = false;
            result = service.debug('ErrorString');

            expect(result).toBeAPromiseLikeObject();
        });

        it('should log all the parameters given', function () {
            service.debug('ErrorString', 'ErrorMessage', {}, [], 'Another message');

            expect($log.debug.calls.count()).toBe(5);
        });

        it('should call the debug with the correct messages', function () {
            service.debug('ErrorString', 'ErrorMessage', {}, [], 'Another message');

            expect($log.debug).toHaveBeenCalledWith('ErrorString');
            expect($log.debug).toHaveBeenCalledWith('ErrorMessage');
            expect($log.debug).toHaveBeenCalledWith({});
            expect($log.debug).toHaveBeenCalledWith([]);
            expect($log.debug).toHaveBeenCalledWith('Another message');
        });
    });

    describe('debugFn', function () {
        beforeEach(inject(function (SETTINGS) {
            SETTINGS.debug = true;
        }));

        it('should be a function', function () {
            expect(service.debugFn).toBeAFunction();
        });

        it('should return a function', function () {
            expect(service.debugFn('ErrorMessage')).toBeAFunction();
        });

        it('the returned function should call the error function', function () {
            spyOn(service, 'debug');

            service.debugFn('ErrorMessage')();

            expect(service.debug).toHaveBeenCalled();
        });

        it('the returned function should call the debug function with the right message', function () {
            spyOn(service, 'debug');

            service.debugFn('ErrorMessage')();

            expect(service.debug).toHaveBeenCalledWith('ErrorMessage');
        });
    });

    describe('message', function () {
        it('should return a build error message if the parameter is an array', function () {
            expect(service.message(['my', 12, 'monkeys'])).toBe('my 12 monkeys');
        });

        it('should return the message if the parameter is a string', function () {
            expect(service.message('monkeys')).toBe('monkeys');
        });
    });
});
