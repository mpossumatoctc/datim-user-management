describe('Pagination service', function () {
    var service;
    var paginationOptions;

    beforeEach(module('PEPFAR.usermanagement'));
    beforeEach(inject(function ($injector) {
        paginationOptions = {
            page: 1,
            pageCount: 19,
            total: 919,
            nextPage: 'http://localhost:8080/dhis/api/users?page=2'};
        service = $injector.get('paginationService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should have a getCurrentPage method', function () {
        expect(service.getCurrentPage).toBeAFunction();
    });

    it('should have a setPagination method', function () {
        expect(service.setPagination).toBeAFunction();
    });

    it('should have a getTotalItemCount method', function () {
        expect(service.getTotalItemCount).toBeAFunction();
    });

    it('should set the correct page based on the paginationOptions', function () {
        service.setPagination(paginationOptions);

        expect(service.getCurrentPage()).toBe(1);
    });

    it('should set the correct total items based on the paginationOptions', function () {
        service.setPagination(paginationOptions);

        expect(service.getTotalItemCount()).toBe(919);
    });

    it('should set the correct page count based on the paginationOptions', function () {
        service.setPagination(paginationOptions);

        expect(service.getNumberOfPages()).toBe(19);
    });

    it('should set the default currentPage to 1', function () {
        expect(service.getCurrentPage()).toBe(1);
    });

    it('should have a page size method that returns 50', function () {
        expect(service.getPageSize()).toBe(50);
    });

    it('should have a setCurrentPage method', function () {
        expect(service.setCurrentPage).toBeAFunction();
    });

    it('should set the currentPage to the passed pagenr', function () {
        service.setPagination(paginationOptions);
        service.setCurrentPage(3);

        expect(service.getCurrentPage()).toEqual(3);
    });

    it('should not set the current page number if it does not exist', function () {
        service.setPagination(paginationOptions);

        service.setCurrentPage(-1);
        expect(service.getCurrentPage()).toEqual(1);

        service.setCurrentPage(20);
        expect(service.getCurrentPage()).toEqual(1);

        service.setCurrentPage('12');
        expect(service.getCurrentPage()).toEqual(1);
    });

    it('should set the page to the last page', function () {
        service.setPagination(paginationOptions);

        service.setCurrentPage(19);
        expect(service.getCurrentPage()).toEqual(19);
    });

    describe('page switching', function () {
        beforeEach(function () {
            service.setPagination(paginationOptions);
        });

        it('should return the number for next page', function () {
            expect(service.getNextPageNumber()).toBe(2);
        });

        it('should return the previous for next page', function () {
            expect(service.getPreviousPageNumber()).toBe(1);
        });

        it('should set the number to the max page', function () {
            service.setPagination({
                page: 19,
                pageCount: 19,
                total: 919
            });

            expect(service.getNextPageNumber()).toBe(19);
        });

        it('should get the previous page', function () {
            service.setPagination({
                page: 8,
                pageCount: 19,
                total: 919
            });

            expect(service.getPreviousPageNumber()).toBe(7);
        });
    });
});
