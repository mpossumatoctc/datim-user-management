angular.module('PEPFAR.usermanagement').factory('paginationService', paginationService);

function paginationService() {
    var currentPage = 1;
    var totalItemCount = 0;
    var numberOfPages = 0;
    var defaultPageSize = 50;

    return {
        getCurrentPage: getCurrentPage,
        setCurrentPage: setCurrentPage,
        setPagination: setPagination,
        getTotalItemCount: getTotalItemCount,
        getNumberOfPages: getNumberOfPages,
        getNextPageNumber: getNextPageNumber,
        getPreviousPageNumber: getPreviousPageNumber,
        getPageSize: getPageSize
    };

    function getCurrentPage() {
        return currentPage;
    }

    function setCurrentPage(newCurrentPage) {
        if (angular.isNumber(newCurrentPage) && newCurrentPage > 0 && newCurrentPage <= getNumberOfPages()) {
            currentPage = newCurrentPage;
        }
    }

    function setPagination(paginateOptions) {
        currentPage = paginateOptions.page || 1;
        totalItemCount = paginateOptions.total || 0;
        numberOfPages = paginateOptions.pageCount || 0;
    }

    function getTotalItemCount() {
        return totalItemCount;
    }

    function getNumberOfPages() {
        return numberOfPages;
    }

    function getNextPageNumber() {
        if ((getCurrentPage() + 1) < numberOfPages) {
            return getCurrentPage() + 1;
        } else {
            return numberOfPages;
        }
    }

    function getPreviousPageNumber() {
        if ((getCurrentPage() - 1) > 0) {
            return getCurrentPage() - 1;
        } else {
            return 1;
        }
    }

    function getPageSize() {
        return defaultPageSize;
    }
}
