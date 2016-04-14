//http://localhost:8080/dhis/api/categories.json?filter=name:eq:Funding%20Mechanism
angular.module('PEPFAR.usermanagement').factory('categoriesService', categoriesService);

function categoriesService(Restangular, $q) {
    var categoriesEndPoint = Restangular.one('categories');

    return {
        getDimensionConstraint: getDimensionConstraint
    };

    function getDimensionConstraint() {
        var queryParams = {
            filter: 'name:eq:Funding Mechanism',
            paging: false
        };

        return categoriesEndPoint.get(queryParams)
            .then(attemptToExtractFundingMechanismCategory);
    }

    function attemptToExtractFundingMechanismCategory(response) {
        if (Array.isArray(response.categories) && response.categories.length === 1) {
            return response.categories[0];
        }
        return $q.reject('More or less than 1 category with the name Funding Mechanism found');
    }
}
