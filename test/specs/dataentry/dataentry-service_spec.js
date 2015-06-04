describe('Data Entry Service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('dataEntryService');

        service.userActions = {dataEntryRestrictions: {
            'Inter-Agency': {
                SI: [{
                    userRole: 'Data Entry SI Country Team',
                    userRoleId: 'yYOqiMTxAOF'
                }]
            },
            Agency: {
                SI: [{
                    userRole: 'Data Entry SI',
                    userRoleId: 'k7BWFXkG6zt'
                }],
                EA: [{
                    userRole: 'Data Entry EA',
                    userRoleId: 'OKKx4bf4ueV'
                }]
            },
            Partner: {
                SI: [{
                    userRole: 'Data Entry SI',
                    userRoleId: 'k7BWFXkG6zt'
                }],
                SIMS: [{
                    userRole: 'Data Entry SIMS',
                    userRoleId: 'iXkZzRKD0i4'
                }]
            }
        }};
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

        it('should return false for a stream with an almost identical name', function () {
            service.dataEntryRoles['SIMS Key Populations'] = true;

            expect(service.hasDataEntryForStream('SIMS')).toBe(false);
        });

        it('should return true for key pops', function () {
            service.dataEntryRoles['SIMS Key Populations'] = true;

            expect(service.hasDataEntryForStream('SIMS Key Populations')).toBe(true);
        });
    });

    describe('setAllDataEntry', function () {
        it('should be a function', function () {
            expect(service.setAllDataEntry).toEqual(jasmine.any(Function));
        });

        it('should set all the values for the passed usertype', function () {
            var expectedDataEntryRoles = {
                SI: true,
                SIMS: true
            };

            service.setAllDataEntry('Partner');

            expect(service.dataEntryRoles).toEqual(expectedDataEntryRoles);
        });

        it('should throw when a usertype was not provided', function () {
            expect(function () { service.setAllDataEntry(); }).toThrowError('Passed usertype should be a string');
        });
    });

    describe('restore', function () {
        beforeEach(function () {
            service.dataEntryRoles.SI = true;
            service.dataEntryRoles.SIMS = false;
        });

        it('should be a function', function () {
            expect(service.restore).toEqual(jasmine.any(Function));
        });

        it('should restore the last config before setAllDataEntry was called', function () {
            var expectedDataEntryRoles = {
                SI: true
            };

            service.setAllDataEntry('Partner', {normalEntry: true});
            service.restore();

            expect(service.dataEntryRoles).toEqual(expectedDataEntryRoles);
        });
    });
});
