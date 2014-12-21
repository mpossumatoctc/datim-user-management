beforeEach(function () {
    jasmine.addMatchers({
        toHaveClass: function () {
            return {
                compare: function (actual, className) {
                    var result = actual[0].classList.contains(className);
                    var message = function () {
                        if (actual.length === 1) {
                            return 'Expected ' + actual + (result ? ' NOT' : '') + ' to have class "' + className + '"';
                        } else {
                            return 'More than one element given';
                        }
                    }();

                    return {
                        pass: result,
                        message: message
                    };
                }
            }
        }
    });
});

