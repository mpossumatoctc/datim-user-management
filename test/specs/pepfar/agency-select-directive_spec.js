describe('Agency select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('pepfar/agencypartner-select.html'));
    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.service('agenciesService', function () {
            this.getAgencies = function () {
                return {
                    then: function (callback) {
                        callback(fixtures.agenciesList.items);
                    }
                };
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<agency-select></agency-select>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('agency-partner-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.agenciesList.items.length);
    });

    it('should have the right placeholder', function () {
        var inputBox = element[0].querySelector('input');

        expect(inputBox.attributes.placeholder.value).toBe('Select agency');
    });
});
