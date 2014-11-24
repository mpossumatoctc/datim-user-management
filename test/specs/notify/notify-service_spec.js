describe('Notifier service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('notify');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a success method', function () {
        expect(service.success).toBeDefined();
    });

    it('should have warning method', function () {
        expect(service.warning).toBeDefined();
    });

    it('should have a error method', function () {
        expect(service.error).toBeDefined();
    });

    it('should call toastr.success when calling success', function () {
        spyOn(window.toastr, 'success');

        service.success();

        expect(window.toastr.success).toHaveBeenCalled();
    });

    it('should call toastr.error when calling error', function () {
        spyOn(window.toastr, 'error');

        service.error();

        expect(window.toastr.error).toHaveBeenCalled();
    });

    it('should call toastr.warning when calling warning', function () {
        spyOn(window.toastr, 'warning');

        service.warning();

        expect(window.toastr.warning).toHaveBeenCalled();
    });
});

describe('Notifier error', function () {
    var toastrTemp;
    var injector;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        toastrTemp = window.toastr;
        window.toastr = undefined;

        injector = $injector;
    }));

    afterEach(function () {
        window.toastr = toastrTemp;
    });

    it('should throw an error on undefined', function () {
        var shouldThrow = function () {
            injector.get('notify');
        };
        var expectedError = new Error('Toastr.js library does not seem to be loaded.');

        expect(shouldThrow).toThrow(expectedError);
    });
});
