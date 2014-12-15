describe('Organisation unit select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('organisationunits/organisation-select.html'));
    beforeEach(module('PEPFAR.usermanagement', function ($provide) {
        $provide.service('organisationUnitService', function () {
            this.getOrganisationUnitsForLevel = function () {
                return {
                    then: function (callback) {
                        callback(fixtures.get('organisationUnits').organisationUnits);
                    }
                };
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var innerScope;
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<organisation-unit-select></organisation-unit-select>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();

        innerScope = element.find('.ui-select-bootstrap').scope();
        innerScope.$select.open = true;
        innerScope.$apply();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('organisation-unit-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.get('organisationUnits').organisationUnits.length);
    });
});
