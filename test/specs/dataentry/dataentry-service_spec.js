describe('Data Entry Service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('dataEntryService');
    }));

    it('should have a property for dataEntryRoles', function () {
        expect(service.dataEntryRoles).toEqual({});
    });

    describe('reset', function () {
        beforeEach(function () {
            service.dataEntryRoles.SI = true;
            service.dataEntryRoles.SIMS = true;
        });

        it('should be a method', function () {
            expect(service.reset).toEqual(jasmine.any(Function));
        });

        it('should reset all the keys on the dataEntryRoles object', function () {
            service.reset();

            expect(Object.keys(service.dataEntryRoles)).toEqual([]);
        });

        it('should be the same object after the reset', function () {
            var dataEntryRolesReference = service.dataEntryRoles;

            service.reset();

            expect(dataEntryRolesReference).toBe(service.dataEntryRoles);
        });
    });

    describe('hasDataEntryForStream', function () {
        beforeEach(function () {
            service.dataEntryRoles.SI = true;
            service.dataEntryRoles.SIMS = false;
        });

        it('should return true on a simple name lookup', function () {
            expect(service.hasDataEntryForStream('SI')).toBe(true);
        });

        it('should return false for a non set stream', function () {
            expect(service.hasDataEntryForStream('EA')).toBe(false);
        });

        it('should return true for a stream with a sub stream that is set', function () {
            service.dataEntryRoles['SIMS Key Pops'] = true;

            expect(service.hasDataEntryForStream('SIMS')).toBe(true);
        });
    });
});
