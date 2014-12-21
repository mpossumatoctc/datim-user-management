beforeEach(function () {
    jasmine.addMatchers({
        toHaveBeenCalledOnce: function () {
            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            if (this.actual.callCount === 1) {
                return true;
            }

            this.message = function () {
                return 'Expected ' + this.actual.methodName + ' to have been called ' +
                    'once and only once. (it was called ' + this.actual.callCount + ' times).';
            };
            return false;
        },

        toHaveCallCount: function (callCount) {
            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            if (this.actual.callCount === callCount) {
                return true;
            }

            this.message = function () {
                return 'Expected ' + this.actual.methodName + ' to have been called ' + callCount +
                    ' times. Instead it was called ' + this.actual.callCount + ' times.';
            }
            return false;
        }
    });
});