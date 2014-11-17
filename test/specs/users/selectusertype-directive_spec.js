describe('Select usertype directive', function () {
    var scope;
    var element;

    beforeEach(module('users/selectusertype.html'));
    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        var $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        scope.userTypes = [
            {name: 'Inter-Agency'},
            {name: 'Agency'},
            {name: 'Partner'}
        ];

        scope.user = {};
        scope.userType = '';

        scope.userTypeChange = jasmine.createSpy();

        element = angular.element('<select-usertype ng-model="user.userType" user-types="userTypes" user-type-change="userTypeChange"></select-usertype>');

        $compile(element)(scope);
        $rootScope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('select-usertype');
    });

    it('should display the right placeholder', function () {
        var inputBox = element[0].querySelector('input');
        expect(inputBox.attributes.placeholder.value).toBe('Select user type');
    });

    it('should display three options', function () {
        var choices = element[0].querySelectorAll('.ui-select-choices-row');

        expect(choices.length).toBe(3);
    });

    it('should display the names of the options', function () {
        var choices = element[0].querySelectorAll('.ui-select-choices-row');

        expect(choices[0].querySelector('div').textContent).toBe('Inter-Agency');
        expect(choices[1].querySelector('div').textContent).toBe('Agency');
        expect(choices[2].querySelector('div').textContent).toBe('Partner');
    });

    it('should call the passed function on change', function () {
        element.isolateScope().onChange({});

        expect(scope.userTypeChange).toHaveBeenCalled();
    });

    it('should pass the selected item to the function', function () {
        var cos = {name: 'COS'};
        element.isolateScope().onChange(cos);

        expect(scope.userTypeChange).toHaveBeenCalledWith(cos.name);
    });
});
