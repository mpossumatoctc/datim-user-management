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

    describe('createUserInvite', function () {
        it('should be a function', function () {
            expect(service.createUserInvite).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(service.createUserInvite()).toBeAPromiseLikeObject();
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
                    userAuthorityGroups: [
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
            expectedInviteObject.userCredentials.userAuthorityGroups = [
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
    });
});
