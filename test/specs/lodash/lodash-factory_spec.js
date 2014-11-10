describe('Lodash factory', function () {
    var lodash;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        lodash = $injector.get('_');
    }));

    it('should expose lodash using a factory', function () {
        expect(lodash).toBe(_);
    });
});
