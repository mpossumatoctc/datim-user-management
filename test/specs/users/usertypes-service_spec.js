describe('userTypesService', function () {
    var $rootScope;
    var userTypesService;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        userTypesService = $injector.get('userTypesService');
    }));

    it('should be an object', function () {
        expect(userTypesService).toBeAnObject();
    });

    describe('getUserTypes', function () {
        it('should be a function', function () {
            expect(userTypesService.getUserTypes).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(userTypesService.getUserTypes()).toBeAPromiseLikeObject();
        });

        it('should return an array when the promised is resolved', function () {
            var userTypes;
            var expectedUserTypes = [
                {name: 'Global'},
                {name: 'Inter-Agency'},
                {name: 'Agency'},
                {name: 'Partner'}
            ];

            userTypesService.getUserTypes().then(function (data) {
                userTypes = data;
            });

            $rootScope.$apply();
            expect(userTypes).toEqual(expectedUserTypes);
        });
    });

    describe('getUserType', function () {
        it('should be a function', function () {
            expect(userTypesService.getUserType).toBeAFunction();
        });

        it('should return usertype partner', function () {
            var user = window.fixtures.get('userGroupsRoles');

            expect(userTypesService.getUserType(user)).toBe('Partner');
        });

        it('should return usertype Inter-Agency instead of country', function () {
            var user = window.fixtures.get('userObjectDisabled');

            expect(userTypesService.getUserType(user)).toBe('Inter-Agency');
        });

        it('should return Unknown type if the type cannot be determined', function () {
            expect(userTypesService.getUserType({})).toBe('Unknown type');
        });

        it('should return Unknown type if the type cannot be determined', function () {
            var otherUserType = {userGroups: [{name: 'OU Rwanda Admin users'}]};

            expect(userTypesService.getUserType(otherUserType)).toBe('Unknown type');
        });

        it('should return the usertype Inter-Agency', function () {
            var user = {
                userGroups:[
                    {id:'BqQxti8UBwt', name:'OU Asia Regional Program Country team'},
                    {id:'x2GXjtJgeTN', name:'OU Asia Regional Program All mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'noSSQlumMRz', name:'OU Asia Regional Program User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Inter-Agency');
        });

        it('should return the user the partner usertype', function () {
            var user = {
                userGroups:[
                    {id:'BqQxti8UBwt', name:'OU South Africa Partner USAID users'},
                    {id:'x2GXjtJgeTN', name:'OU South Africa Partner USAID All mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'noSSQlumMRz', name:'OU South Africa Partner USAID User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Partner');
        });

        it('should return the user the partner usertype', function () {
            var user = {
                userGroups:[
                    {id:'BqQxti8UBwt', name:'OU Rwanda Partner USAID users'},
                    {id:'x2GXjtJgeTN', name:'OU Rwanda Partner USAID All mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'noSSQlumMRz', name:'OU Rwanda Partner USAID User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Partner');
        });

        it('should return the user the agency usertype', function () {
            var user = {
                userGroups:[
                    {id:'BqQxti8UBwt', name:'OU South Africa Agency USAID users'},
                    {id:'x2GXjtJgeTN', name:'OU South Africa Agency USAID All mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'noSSQlumMRz', name:'OU South Africa Agency USAID User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Agency');
        });

        it('should return the user the agency usertype', function () {
            var user = {
                userGroups:[
                    {id:'BqQxti8UBwt', name:'OU Rwanda Agency USAID users'},
                    {id:'x2GXjtJgeTN', name:'OU Rwanda Agency USAID All mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'noSSQlumMRz', name:'OU Rwanda Agency USAID User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Agency');
        });

        it('should return the global user type', function () {
            var user = {
                userGroups:[
                    {id:'gh9tn4QBbKZ', name:'Global users'},
                    {id:'TOOIJWRzJ3g', name:'Global all mechanisms'},
                    {id:'YbkldVOJMUl', name:'Data EA access'},
                    {id:'c6hGi8GEZot', name:'Data SI access'},
                    {id:'ghYxzrKHldx', name:'Global User administrators'},
                    {id:'iuD8wUFz95X', name:'Data SIMS access'}
                ]
            };

            expect(userTypesService.getUserType(user)).toBe('Global');
        });
    });
});
