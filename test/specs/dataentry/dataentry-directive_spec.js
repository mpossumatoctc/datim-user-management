describe('Data entry directive', function () {
    var element;
    var scope;
    var userActionsServiceMock;
    var currentUserMock;
    var controller;
    var fixtures = window.fixtures;

    beforeEach(module('dataentry/dataentry.html'));
    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.factory('userActionsService', function ($q) {
            return {
                getActions: jasmine.createSpy().and.returnValue($q.when({
                    getDataEntryRestrictionDataGroups: jasmine.createSpy()
                        .and.returnValue(['SI', 'SIMS', 'SIMS Key Pops']),
                    dataEntryRestrictions: {
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
                    }
                }))
            };
        });
        $provide.factory('currentUserService', function ($q) {
            return {
                getCurrentUser: jasmine.createSpy().and.returnValue($q.when({}))
            };
        });
        $provide.factory('dataEntryService', function () {
            return {
                dataEntryRoles: {},
                reset: jasmine.createSpy('dataEntryService.reset')
            };
        });
        $provide.factory('userUtils', function () {
            return {
                getDataEntryStreamNamesForUserType: jasmine.createSpy('getDataEntryStreamNamesForUserType')
                    .and.returnValue(['SIMS', 'SIMS Key Pops'])
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        var $rootScope = $injector.get('$rootScope');
        userActionsServiceMock = $injector.get('userActionsService');
        currentUserMock = $injector.get('currentUserService');

        element = angular.element('<um-data-entry user="user"></um-data-entry>');
        scope = $rootScope.$new();
        scope.user = {
            userType: undefined,
            dataGroups: {
                SI: {
                    access: false
                },
                SIMS: {
                    access: false
                },
                EA: {
                    access: false
                }
            }
        };

        $compile(element)(scope);
        $rootScope.$digest();

        controller = element.controller('umDataEntry');

        scope.user.userType = {
            name: 'Agency'
        };
        scope.$apply();
    }));

    it('should compile', function () {
        expect(element[0].classList.contains('checkbox-group')).toEqual(true);
    });

    describe('initialise', function () {
        it('should call the userActionsService for the actions', function () {
            expect(userActionsServiceMock.getActions).toHaveBeenCalled();
        });

        it('should call the currentUserService for the currentUser', function () {
            expect(currentUserMock.getCurrentUser).toHaveBeenCalled();
        });
    });

    describe('display of data entry', function () {
        it('should display the two sims data entry boxes', function () {
            expect(element.find('li').length).toEqual(2);

            expect(element.find('li label')[0].textContent.trim()).toBe('Data Entry SIMS');
            expect(element.find('li label')[1].textContent.trim()).toBe('Data Entry SIMS Key Pops');
        });
    });

    describe('interaction', function () {
        it('should call the updateDataEntry function when a checkbox is clicked', function () {
            spyOn(controller, 'updateDataEntry');

            element.find('li input').first().click();
            scope.$apply();

            expect(controller.updateDataEntry).toHaveBeenCalled();
        });

        it('should set access for the passed stream', function () {
            controller.updateDataEntry('SI');

            expect(controller.user.dataGroups.SI.access).toBe(true);
        });

        it('should not set access for the passes stream', function () {
            controller.updateDataEntry('EA');

            expect(controller.user.dataGroups.EA.access).toBe(false);
        });

        it('should set access for the datagroup based on the sub section', function () {
            controller.updateDataEntry('SIMS Key Pops');

            expect(controller.user.dataGroups.SIMS.access).toBe(true);
        });

        it('should not set any of the other datagroups access', function () {
            controller.updateDataEntry('SIMS');

            expect(controller.user.dataGroups.SIMS.access).toBe(true);
            expect(controller.user.dataGroups.SI.access).toBe(false);
            expect(controller.user.dataGroups.EA.access).toBe(false);
        });

        it('should not add an extra key to the datagroups object', function () {
            controller.updateDataEntry('SIMS Key Pops');

            expect(Object.keys(controller.user.dataGroups).length).toBe(3);
        });
    });

    describe('for edit user', function () {
        var dataEntryServiceMock;

        beforeEach(inject(function ($injector) {
            var $compile = $injector.get('$compile');
            var $rootScope = $injector.get('$rootScope');
            userActionsServiceMock = $injector.get('userActionsService');
            currentUserMock = $injector.get('currentUserService');
            dataEntryServiceMock = $injector.get('dataEntryService');

            element = angular.element('<um-data-entry user="user" user-type="\'Partner\'" user-to-edit="userToEdit"></um-data-entry>');
            scope = $rootScope.$new();
            scope.user = {
                userType: undefined,
                dataGroups: {
                    SI: {
                        access: false
                    },
                    SIMS: {
                        access: false
                    },
                    EA: {
                        access: false
                    }
                }
            };

            scope.userToEdit = fixtures.get('userGroupsRoles');

            $compile(element)(scope);
            $rootScope.$digest();

            controller = element.controller('umDataEntry');

            scope.$apply();
        }));

        it('should set the dataentry options for the user that will be edited', function () {
            expect(dataEntryServiceMock.dataEntryRoles).toEqual({SI: true});
        });
    });
});
