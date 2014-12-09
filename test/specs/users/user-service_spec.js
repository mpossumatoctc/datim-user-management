describe('User service', function () {
    var fixtures = window.fixtures;
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('userService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('getUserObject', function () {
        it('should be a function', function () {
            expect(service.getUserObject).toBeAFunction();
        });

        it('should return an empty user object', function () {
            var expectedUserObject = {
                userType: undefined,
                userEntity: undefined,
                email: undefined,
                locale: {name: 'en'},
                userActions: {},
                userGroups: [],
                userRoles: [],
                dataGroups: {}
            };

            expect(service.getUserObject()).toEqual(expectedUserObject);
        });
    });

    describe('createUserGroups', function () {
        it('should return the MER data access group name', function () {
            expect();
        });
    });

    describe('getUserInviteObject', function () {
        var actions;
        var dataGroups;
        var userObject;
        var expectedInviteObject;

        beforeEach(function () {
            userObject = {
                userType: {
                    name: 'Partner',
                    $$hashKey: 'object:21'
                },
                userEntity: {
                    name: 'African Evangelistic Enterprise',
                    created: '2014-05-09T23:23:11.387+0000',
                    lastUpdated: '2014-10-05T13:07:56.195+0000',
                    id: 'z4WtTPPjD7i',
                    $$hashKey: 'object:82'
                },
                email: 'mark@thedutchies.com',
                locale: {
                    name: 'en'
                },
                userActions: {
                    'Manage users': true,
                    'Capture data': true
                },
                userGroups: [],
                userRoles: [],
                dataGroups: {
                    SI: true,
                    EA: false,
                    SIMS: false
                }
            };
            actions = [
                {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true, $$hashKey: 'object:70'},
                {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ', $$hashKey: 'object:71'},
                {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr', $$hashKey: 'object:72'},
                {name: 'Read data', userRole: 'Read Only', default: true, $$hashKey: 'object:13', userRoleId: 'b2uHwX9YLhu'}
            ];
            dataGroups = [
                {name: 'SI', userRoles: [
                    {id: 'k7BWFXkG6zt', name: 'Data Entry SI'}
                ], userGroups: [
                    {id: 'c6hGi8GEZot', name: 'Data SI access'}
                ]},
                {name: 'EA', userRoles: [
                    {id: 'OKKx4bf4ueV', name: 'Data Entry EA'}
                ], userGroups: [
                    {id: 'YbkldVOJMUl', name: 'Data EA access'}
                ]},
                {name: 'SIMS', userRoles: [
                    {id: 'iXkZzRKD0i4', name: 'Data Entry SIMS'}
                ], userGroups: [
                    {id: 'iuD8wUFz95X', name: 'Data SIMS access'}
                ]}
            ];
            expectedInviteObject = {
                email: 'mark@thedutchies.com',
                organisationUnits: [],
                dataViewOrganisationUnits: [],
                groups: [
                    {id:'c6hGi8GEZot'}
                ],
                userCredentials: {
                    userRoles: [
                        {id: 'k7BWFXkG6zt'},
                        {id: 'KagqnetfxMr'},
                        {id: 'b2uHwX9YLhu'}
                    ]
                }
            };
        });

        it('should be a function', function () {
            expect(service.getUserInviteObject).toBeAFunction();
        });

        it('should return the correct userGroups', function () {
            expect(service.getUserInviteObject(userObject, dataGroups, actions)).toEqual(expectedInviteObject);
        });

        it('should add the organisation units from the current user', function () {
            var currentUser =  fixtures.get('currentUser');
            expectedInviteObject.organisationUnits = [{id: 'HfVjCurKxh2'}];
            expectedInviteObject.dataViewOrganisationUnits = [{id: 'HfVjCurKxh2'}];

            expect(service.getUserInviteObject(userObject, dataGroups, actions, currentUser))
                .toEqual(expectedInviteObject);
        });

        it('should not add roles for which there is no Id', function () {
            expectedInviteObject.userCredentials.userRoles = [
                {id: 'k7BWFXkG6zt'},
                {id: 'b2uHwX9YLhu'}
            ];
            actions[2].userRoleId = undefined;

            expect(service.getUserInviteObject(userObject, dataGroups, actions))
                .toEqual(expectedInviteObject);
        });

        it('should have a addEntityUserGroup method', function () {
            expect(service.getUserInviteObject(userObject, dataGroups, actions).addEntityUserGroup)
                .toBeAFunction();
        });

        it('addEntityUserGroup should add the userGroup to the entity', function () {
            var inviteEntity = service.getUserInviteObject(userObject, dataGroups, actions);

            inviteEntity.addEntityUserGroup({id: 'userGroupId'});

            expect(inviteEntity.groups.some(hasId('userGroupId')))
                .toBe(true);

            function hasId(requestedId) {
                return function (item) {
                    return item.id === requestedId;
                };
            }
        });

        it('should add the action if it restricted by a selected usergroup', function () {
            var inviteEntity;

            userObject.userActions['Data Entry'] = true;
            actions.push({name: 'Data Entry', userRole: 'Data Entry SI Country Team', dataStream: ['SI'], userRoleId: 'yYOqiMTxAOF'});

            inviteEntity = service.getUserInviteObject(userObject, dataGroups, actions);

            expect(inviteEntity.userCredentials.userRoles).toContain({id: 'yYOqiMTxAOF'});
        });

        it('should not add the action if it restricted by a not selected usergroup', function () {
            var inviteEntity;

            userObject.dataGroups.SI = false;
            userObject.dataGroups.EA = true;
            userObject.userActions['Data Entry'] = true;
            actions.push({name: 'Data Entry', userRole: 'Data Entry SI Country Team', dataStream: ['SI'], userRoleId: 'yYOqiMTxAOF'});

            inviteEntity = service.getUserInviteObject(userObject, dataGroups, actions);

            expect(inviteEntity.userCredentials.userRoles).not.toContain({id: 'yYOqiMTxAOF'});
        });
    });

    describe('inviteUser', function () {
        it('should be a function', function () {
            expect(service.inviteUser).toBeAFunction();
        });

        describe('invite request', function () {
            var $httpBackend;
            var $rootScope;
            var inviteRequest;

            beforeEach(inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');
                $rootScope = $injector.get('$rootScope');

                inviteRequest = $httpBackend.expectPOST('http://localhost:8080/dhis/api/users/invite', fixtures.get('sampleInviteObject'))
                    .respond(200, fixtures.get('successInvite'));

                $httpBackend.whenGET('http://localhost:8080/dhis/api/users/b4H1KaR7YYa')
                    .respond(200, {});
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should send the request to the invite endpoint', function () {
                service.inviteUser(fixtures.get('sampleInviteObject'));
                $httpBackend.flush();
            });

            it('should not post if the inviteObject is undefined', function () {
                $httpBackend.resetExpectations();
                service.inviteUser();
            });

            it('should return a promise like object on failure', function () {
                $httpBackend.resetExpectations();
                var promise = service.inviteUser();
                var errorMessage;

                promise.catch(function (response) {
                    errorMessage = response;
                });
                $rootScope.$apply();

                expect(promise).toBeAPromiseLikeObject();
                expect(errorMessage).toBe('Invalid invite data');
            });

            it('should reject the promise when the invite fails', function () {
                var promise;
                var errorMessage;

                inviteRequest.respond(500);
                promise = service.inviteUser(fixtures.get('sampleInviteObject'));

                promise.catch(function (response) {
                    errorMessage = response;
                });
                $httpBackend.flush();

                expect(promise).toBeAPromiseLikeObject();
                expect(errorMessage).toBe('Invite failed');
            });

            it('should reject the promise when the the import was not successful', function () {
                var promise;
                var errorMessage;

                inviteRequest.respond(200, {});
                promise = service.inviteUser(fixtures.get('sampleInviteObject'));

                promise.catch(function (response) {
                    errorMessage = response;
                });
                $httpBackend.flush();

                expect(promise).toBeAPromiseLikeObject();
                expect(errorMessage).toBe('Invite response not as expected');
            });

            it('should request the inserted user object on success', function () {
                $httpBackend.expectGET('http://localhost:8080/dhis/api/users/b4H1KaR7YYa')
                    .respond(200, {});

                service.inviteUser(fixtures.get('sampleInviteObject'));

                $httpBackend.flush();
            });
        });
    });

    describe('verifyInviteData', function () {
        var inviteObject;

        beforeEach(function () {
            inviteObject = {
                email: 'mark@does.work',
                organisationUnits:[
                    {id:'ybg3MO3hcf4'}
                ],
                dataViewOrganisationUnits:[
                    {id:'ybg3MO3hcf4'}
                ],
                groups: [
                    {id:'iuD8wUFz95X'},
                    {id:'gh9tn4QBbKZ'}
                ],
                userCredentials:{
                    userRoles:[
                        {id:'b2uHwX9YLhu'}
                    ]
                }
            };
        });

        it('should be a method', function () {
            expect(service.verifyInviteData).toBeAFunction();
        });

        it('should return true for a valid object', function () {
            expect(service.verifyInviteData(inviteObject)).toBe(true);
        });

        it('should return false on a an empty email', function () {
            inviteObject.email = '';
            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when the org unit is missing', function () {
            inviteObject.organisationUnits = [];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when the org unit does not have an id', function () {
            inviteObject.organisationUnits = [{}];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when the data view org unit is missing', function () {
            inviteObject.dataViewOrganisationUnits = [];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when the data view org unit does not have an id', function () {
            inviteObject.dataViewOrganisationUnits = [{}];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when there are no userGroups', function () {
            inviteObject.groups = [];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });

        it('should return false when there are no roles', function () {
            inviteObject.userCredentials.userRoles = [];

            expect(service.verifyInviteData(inviteObject)).toBe(false);
        });
    });

    describe('saveUserLocale', function () {
        it('should be a function', function () {
            expect(service.saveUserLocale).toBeAFunction();
        });

        describe('remote calls', function () {
            var $httpBackend;

            beforeEach(inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');

                $httpBackend.expectPOST('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=markpolak', 'en', {
                    'Content-Type': 'text/plain',
                    Accept: 'application/json, text/plain, */*'
                }).respond(200, 'Success');
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should call the userSettings endpoint', function () {
                service.saveUserLocale('markpolak', 'en');
                $httpBackend.flush();
            });

            it('should return the new locale on success', function () {
                var locale;
                service.saveUserLocale('markpolak', 'en').then(function (newLocale) {
                    locale = newLocale;
                });
                $httpBackend.flush();

                expect(locale).toBe('en');
            });

            it('should call the api with the correct name', function () {
                $httpBackend.resetExpectations();
                $httpBackend.expectPOST('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=johnsnow', 'en')
                    .respond(200, 'Success');

                service.saveUserLocale('johnsnow', 'en');
                $httpBackend.flush();
            });

            it('should call the catch on error', function () {
                var catchFunction = jasmine.createSpy();

                $httpBackend.resetExpectations();
                $httpBackend.expectPOST('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=johnsnow', 'en')
                    .respond(404, 'Fail');

                service.saveUserLocale('johnsnow', 'en').catch(catchFunction);
                $httpBackend.flush();

                expect(catchFunction).toHaveBeenCalled();
            });

            it('should call the api with the correct locale', function () {
                $httpBackend.resetExpectations();
                $httpBackend.expectPOST('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=johnsnow', 'fr')
                    .respond(200, 'Success');

                service.saveUserLocale('johnsnow', 'fr');
                $httpBackend.flush();
            });

            it('should not call the api if no username was given', function () {
                function shouldThrow() {
                    service.saveUserLocale(undefined, 'en');
                }
                $httpBackend.resetExpectations();

                expect(shouldThrow).toThrow(new Error('Username required'));
            });

            it('should not call the api if no locale was given', function () {
                function shouldThrow() {
                    service.saveUserLocale('markpolak');
                }
                $httpBackend.resetExpectations();

                expect(shouldThrow).toThrow(new Error('Locale required'));
            });

            it('should not accept an empty string as username', function () {
                function shouldThrow() {
                    service.saveUserLocale('');
                }
                $httpBackend.resetExpectations();

                expect(shouldThrow).toThrow(new Error('Username required'));
            });

            it('should not accept an empty string as locale', function () {
                function shouldThrow() {
                    service.saveUserLocale('johnsnow', '');
                }
                $httpBackend.resetExpectations();

                expect(shouldThrow).toThrow(new Error('Locale required'));
            });
        });
    });

    describe('getUserLocale', function () {
        var $httpBackend;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should call the api for the userLocale', function () {
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=markpo')
                .respond(200, 'en');

            service.getUserLocale('markpo');
            $httpBackend.flush();
        });

        it('should return the locale', function () {
            var userLocale;
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=markpo')
                .respond(200, 'en');

            service.getUserLocale('markpo').then(function (locale) {
                userLocale = locale;
            });
            $httpBackend.flush();

            expect(userLocale).toEqual({name: 'en', code: 'en'});
        });

        it('should return undefined when locale can not be found', function () {
            var userLocale = '';
            $httpBackend.expectGET('http://localhost:8080/dhis/api/userSettings/keyUiLocale?user=larshe')
                .respond(500);

            service.getUserLocale('larshe').then(function (locale) {
                userLocale = locale;
            });
            $httpBackend.flush();

            expect(userLocale).toBeUndefined();
        });
    });

    describe('getSelectedDataGroups', function () {
        var dataGroups;
        var userDataGroups;

        beforeEach(function () {
            dataGroups = [
                {name: 'MER'},
                {name: 'EA'},
                {name: 'SIMS'}
            ];
            userDataGroups = {
                dataGroups: {
                    EA: true,
                    MER: false,
                    SIMS: true
                }
            };
        });

        it('should be a function', function () {
            expect(service.getSelectedDataGroups).toBeAFunction();
        });

        it('should return the selected datagroups', function () {
            var exectedDataGroups = [
                {name: 'EA'},
                {name: 'SIMS'}
            ];
            expect(service.getSelectedDataGroups(userDataGroups, dataGroups)).toEqual(exectedDataGroups);
        });
    });

    describe('getUser', function () {
        var $httpBackend;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should request a user', function () {
            $httpBackend.expectGET('http://localhost:8080/dhis/api/users/dfersddd?fields=:all,userCredentials%5Bid,code,disabled,userRoles%5D')
                .respond(200, {});

            service.getUser('dfersddd');
            $httpBackend.flush();
        });
    });

    describe('updateUser', function () {
        var userToUpdate;
        var userGroups;
        var $q;
        var $httpBackend;

        beforeEach(inject(function ($injector) {
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');

            userToUpdate = {
                id: 'myUserId',
                userGroups: [
                    {id: 'ckBmsHSkJ9I', name: 'OU Rwanda Partner 3781 users - Partnership for Supply Chain Management',
                        created: '2014-09-29T12:56:42.101+0000',
                        lastUpdated: '2014-10-23T00:46:28.036+0000',
                        href: 'http://localhost:8080/dhis/api/userGroups/ckBmsHSkJ9I'},
                    {id: 'YbkldVOJMUl', name: 'Data EA access'},
                    {id: 'iuD8wUFz95X', name: 'Data SIMS access'}
                ],
                save: jasmine.createSpy('save').and.returnValue($q.when(true))
            };

            userGroups = [
                {id: 'U0lbV8pGhgB', name: 'OU Rwanda Mechanism 7158 - SCMS',
                    created: '2014-09-29T12:56:40.983+0000',
                    lastUpdated: '2014-11-07T10:05:16.094+0000',
                    href: 'http://localhost:8080/dhis/api/userGroups/U0lbV8pGhgB'},
                {id: 'ckBmsHSkJ9I', name: 'OU Rwanda Partner 3781 users - Partnership for Supply Chain Management',
                    created: '2014-09-29T12:56:42.101+0000',
                    lastUpdated: '2014-10-23T00:46:28.036+0000',
                    href: 'http://localhost:8080/dhis/api/userGroups/ckBmsHSkJ9I'},
                {id: 'YbkldVOJMUl', name: 'Data EA access'},
                {id: 'iuD8wUFz95X', name: 'Data SIMS access'}
            ];
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            expect(service.updateUser).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(service.updateUser(userToUpdate, userToUpdate.userGroups)).toBeAPromiseLikeObject();
        });

        it('should call the save method on the userToEdit', function () {
            service.updateUser(userToUpdate, userToUpdate.userGroups);

            expect(userToUpdate.save).toHaveBeenCalled();
        });

        it('should do a request for each userGroup that needs to be added', function () {
            $httpBackend.expectPOST('http://localhost:8080/dhis/api/userGroups/U0lbV8pGhgB/users/myUserId')
                .respond(200);

            service.updateUser(userToUpdate, userGroups);
            $httpBackend.flush();
        });

        it('should do a request for each userGroup that needs to be deleted', function () {
            userGroups = [
                {id: 'YbkldVOJMUl', name: 'Data EA access'},
                {id: 'iuD8wUFz95X', name: 'Data SIMS access'}
            ];
            $httpBackend.expectDELETE('http://localhost:8080/dhis/api/userGroups/ckBmsHSkJ9I/users/myUserId')
                .respond(200);

            service.updateUser(userToUpdate, userGroups);
            $httpBackend.flush();
        });
    });
});
