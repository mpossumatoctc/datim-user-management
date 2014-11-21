//http://localhost:8080/dhis/api/categories.json?filter=name:eq:Funding%20Mechanism

describe('Category service', function () {
    var service;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('categoriesService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('getDimensionConstraint should be a method', function () {
        expect(service.getDimensionConstraint).toBeAFunction();
    });

    describe('getDimensionConstraint', function () {
        var $httpBackend;
        var categoryObject;
        var categoriesRequest;

        beforeEach(inject(function ($injector) {
            categoryObject = {
                id: 'SH885jaRe0o',
                created: '2014-02-18T07:51:04.612+0000',
                name: 'Funding Mechanism',
                lastUpdated: '2014-10-16T12:18:02.751+0000'
            };
            $httpBackend = $injector.get('$httpBackend');
            categoriesRequest = $httpBackend.expectGET('http://localhost:8080/dhis/api/categories?filter=name:eq:Funding+Mechanism&paging=false')
                .respond(200, {categories: [
                    categoryObject
                ]});
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should call the api for the dimensionConstraint id', function () {
            service.getDimensionConstraint();

            $httpBackend.flush();
        });

        it('should return a promise like object', function () {
            var response = service.getDimensionConstraint();

            $httpBackend.flush();

            expect(response).toBeAPromiseLikeObject();
        });

        it('should return the mechanism after the then', function () {
            var dimensionConstraint;

            service.getDimensionConstraint().then(function (response) {
                dimensionConstraint = response;
            });
            $httpBackend.flush();

            expect(dimensionConstraint.id).toEqual(categoryObject.id);
            expect(dimensionConstraint.name).toEqual(categoryObject.name);
            expect(dimensionConstraint.created).toEqual(categoryObject.created);
        });

        it('should reject the promise if the array is not exactly 1 element', function () {
            var thenFunction = jasmine.createSpy();
            var catchFunction = jasmine.createSpy();
            categoriesRequest.respond(200, {
                categories: [
                    {id: '1'},
                    {id: '2'}
                ]
            });

            service.getDimensionConstraint().catch(catchFunction);
            $httpBackend.flush();

            expect(thenFunction).not.toHaveBeenCalled();
            expect(catchFunction).toHaveBeenCalled();
        });
    });
});
