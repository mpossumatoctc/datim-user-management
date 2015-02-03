describe('User utils service', function () {
    var userUtils;
    var dataStreams;
    var userActions;
    var allActions;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        userUtils = $injector.get('userUtils');

        dataStreams = {
            EA: {access: false, entry: false},
            SI: {access: false, entry: false},
            SIMS: {access: false, entry: false}
        };

        userActions = {};
        allActions = [
            {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
            {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
            {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
            {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
        ];
    }));

    it('should be an object', function () {
        expect(userUtils).toBeAnObject();
    });

    describe('setAllDataStreamsAndEntry', function () {
        it('should be a function', function () {
            expect(userUtils.setAllDataStreamsAndEntry).toBeAFunction();
        });

        it('should expect 1 argument', function () {
            expect(userUtils.setAllDataStreamsAndEntry.length).toBe(1);
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.setAllDataStreamsAndEntry();
            }

            expect(shouldThrow).toThrowError('Expected passed value "dataGroups" to be an object');
        });

        it('should set access and entry to true for all streams', function () {
            var expectedDataStreams = {
                EA: {access: true, entry: true},
                SI: {access: true, entry: true},
                SIMS: {access: true, entry: true}
            };

            expect(userUtils.setAllDataStreamsAndEntry(dataStreams)).toEqual(expectedDataStreams);
        });
    });

    describe('storeDataGroups', function () {
        it('should be a function', function () {
            expect(userUtils.storeDataStreamsAndEntry).toBeAFunction();
        });

        it('should take 1 argument', function () {
            expect(userUtils.storeDataStreamsAndEntry.length).toBe(1);
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.storeDataStreamsAndEntry();
            }

            expect(shouldThrow).toThrowError('Expected passed value "dataGroups" to be an object');
        });
    });

    describe('restoreDataStreamsAndEntry', function () {
        beforeEach(function () {
            dataStreams.EA.access = true;
            dataStreams.SIMS.access = true;
            dataStreams.EA.entry = true;
        });

        it('should be a function', function () {
            expect(userUtils.restoreDataStreamsAndEntry).toBeAFunction();
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.restoreDataStreamsAndEntry();
            }

            expect(shouldThrow).toThrowError('Expected passed value "dataGroups" to be an object');
        });

        it('should restore the dataStreams back to the original settings', function () {
            var expectedDataStreams = {
                EA: {access: true, entry: true},
                SI: {access: false, entry: false},
                SIMS: {access: true, entry: false}
            };

            dataStreams = userUtils.setAllDataStreamsAndEntry(dataStreams);

            expect(userUtils.restoreDataStreamsAndEntry(dataStreams)).toEqual(expectedDataStreams);
        });

        it('should return the current dataStreams when there is no previous value', function () {
            expect(userUtils.restoreDataStreamsAndEntry(dataStreams)).toEqual(dataStreams);
        });
    });

    describe('setAllActions', function () {
        it('should be a function', function () {
            expect(userUtils.setAllActions).toBeAFunction();
        });

        it('should expect two arguments', function () {
            expect(userUtils.setAllActions.length).toBe(2);
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.setAllActions();
            }

            expect(shouldThrow).toThrowError('Expected passed value "allActions" to be an array');
        });

        it('should set the actions on the userActions object and set them to true', function () {
            var expectedUserActions = {
                'Accept data': true,
                'Submit data': true,
                'Manage users': true
            };

            expect(userUtils.setAllActions(allActions)).toEqual(expectedUserActions);
        });

        it('should also set actions marked as default to true', function () {
            var expectedUserActions = {
                'Accept data': true,
                'Submit data': true,
                'Manage users': true,
                'Read data': true
            };

            expect(userUtils.setAllActions(allActions, true)).toEqual(expectedUserActions);
        });
    });

    describe('storeUserActions', function () {
        it('should be a function', function () {
            expect(userUtils.storeUserActions).toBeAFunction();
        });

        it('should expect 1 parameter', function () {
            expect(userUtils.storeUserActions.length).toBe(1);
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.storeUserActions();
            }

            expect(shouldThrow).toThrowError('Expected passed value "userActions" to be an object');
        });
    });

    describe('restoreUserActions', function () {
        it('should be a function', function () {
            expect(userUtils.restoreUserActions).toBeAFunction();
        });

        it('should throw if the argument is not an object', function () {
            function shouldThrow() {
                userUtils.restoreUserActions();
            }

            expect(shouldThrow).toThrowError('Expected passed value "userActions" to be an object');
        });

        it('should return the previous stored user actions', function () {
            var expectedUserActions = {'Submit data': true};
            userActions = {'Submit data': true};
            userUtils.storeUserActions(userActions);

            expect(userUtils.restoreUserActions(userActions)).toEqual(expectedUserActions);
        });

        it('should return the current userActions if no value was saved', function () {
            var expectedUserActions = {'Submit data': true};
            userActions = {'Submit data': true};

            expect(userUtils.restoreUserActions(userActions)).toEqual(expectedUserActions);
        });
    });

    describe('hasUserAdminRights', function () {
        var user;

        beforeEach(function () {
            user = {
                userGroups: [
                    {name: 'OU Burma Partner 9865 user administrators - FHI 360'}
                ],
                userCredentials: {
                    userRoles: [
                        {name: 'User Administrator'}
                    ]
                }
            };
        });

        it('should be a function', function () {
            expect(userUtils.hasUserAdminRights).toBeAFunction();
        });

        it('should return false', function () {
            expect(userUtils.hasUserAdminRights()).toBe(false);
        });

        it('should return false for a user without groups', function () {
            delete user.userGroups;

            expect(userUtils.hasUserAdminRights(user)).toBe(false);
        });

        it('should return false for a user without userRoles', function () {
            delete user.userCredentials.userRoles;

            expect(userUtils.hasUserAdminRights(user)).toBe(false);
        });

        it('should return false for a user without userCredentials', function () {
            delete user.userCredentials;

            expect(userUtils.hasUserAdminRights(user)).toBe(false);
        });

        it('should return true for a user with user management rights', function () {
            expect(userUtils.hasUserAdminRights(user)).toBe(true);
        });
    });
});
