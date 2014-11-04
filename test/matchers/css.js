jasmine.Expectation.addMatchers({
    toHaveClass: function (className) {
        var result = this.actual.hasClass(className);

        this.message = function () {
            if (this.actual.length > 0) {
                return 'Expected ' + this.actual + (result ? ' NOT' : '') + ' to have class "' + className + '"';
            } else {
                return 'Expected some elements to have class "' + className + '" but no elements were found.';
            }
        };

        return result;
    }
});
