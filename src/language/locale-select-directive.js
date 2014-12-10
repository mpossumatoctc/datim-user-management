angular.module('PEPFAR.usermanagement').directive('localeSelect', localeSelectDirective);

function localeSelectDirective(localeService, $translate, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            required: '@',
            user: '='
        },
        templateUrl: 'language/locale-select.html',
        link: linkFn
    };

    function linkFn(scope) {
        scope.selectbox = {
            placeholder: $translate.instant('Select a locale')
        };

        localeService.getUiLocales().then(function (uiLocales) {
            scope.selectbox.items = _.map(uiLocales, function (uiLocale) {
                return {
                    name: uiLocale,
                    code: uiLocale
                };
            });
        });
    }
}
