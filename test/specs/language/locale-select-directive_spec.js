describe('Locale select directive', function () {
    var fixtures = window.fixtures;
    var $compile;
    var $rootScope;
    var scope;
    var element;

    beforeEach(module('language/locale-select.html'));
    beforeEach(module('PEPFAR.usermanagement', {
        localeService: {
            getUiLocales: function () {
                return {
                    then: function (callBack) {
                        callBack(fixtures.get('locales'));
                    }
                };
            }
        }
    }));

    beforeEach(inject(function ($injector) {
        var innerScope;
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        element = angular.element('<locale-select></locale-select>');
        $compile(element)(scope);
        $rootScope.$digest();

        innerScope = element.find('.ui-select-bootstrap').scope();
        innerScope.$select.open = true;
        innerScope.$apply();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('locale-select');
    });

    it('should display the languages provided', function () {
        var choices = element.find('.ui-select-choices-row');

        expect(choices.length).toBe(fixtures.get('locales').length);
    });

    it('should have the correct placeholder', function () {
        var inputBox = element[0].querySelector('input');
        expect(inputBox.attributes.placeholder.value).toBe('Select a locale');
    });

    it('should display the correct labels', function () {
        var choices = element[0].querySelectorAll('.ui-select-choices-row');
        var firstChoiceText = choices[0].querySelector('div').textContent;

        expect(firstChoiceText).toBe('ar');
    });
});
