//Translate is mocked out because it does some funky things on startup of the program
angular.module('pascalprecht.translate', []);
angular.module('pascalprecht.translate').provider('$translate', function () {
    return {
        $get: function () {
            return {
                instant: function (toTranslate) {
                    return toTranslate;
                }
            };
        },
        useStaticFilesLoader: function () {},
        preferredLanguage: function () {}
    };
});
