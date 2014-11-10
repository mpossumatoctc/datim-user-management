describe('Agency select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('pepfar/agencypartner-select.html'));
    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.service('partnersService', function () {
            this.getPartners = function () {
                return {
                    then: function (callback) {
                        callback(fixtures.get('partnerList').items);
                    }
                };
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<partner-select></partner-select>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('agency-partner-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.get('partnerList').items.length);
    });

    it('should have the correct place holder', function () {
        var inputBox = element[0].querySelector('input');

        expect(inputBox.attributes.placeholder.value).toBe('Select a partner');
    });

    it('should have an isolate scope', function () {
        var elements;

        $scope.selectbox = {};
        $scope.$apply();

        elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.get('partnerList').items.length);
    });
});
