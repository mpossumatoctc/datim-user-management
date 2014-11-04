jasmine.Expectation.addMatchers({
    toHaveMethod: function (methodName) {
        if (this.actual[methodName] && typeof this.actual[methodName] === 'function') {
            return true;
        }
        this.message = function () {
            return 'Expected ' + this.actual + ' to have a method called ' + methodName;
        }
        return false;
    },

    //TODO: Is not used anymore, see if we still want to keep this.
    toHavePrototype: function (wantedPrototype) {
        return wantedPrototype.prototype.isPrototypeOf(this.actual);
    }
});
