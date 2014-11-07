(function (window, angular) {
    function NgBootstrapper(appName, element) { // jshint: ignore
        if (!appName || typeof appName !== 'string') {
            throw 'App name should be a string';
        }

        //Will throw an error if the module does not exist
        angular.module(appName);

        window.name = 'NG_DEFER_BOOTSTRAP!';
        angular.bootstrap(element, [appName]);
        //Reset the bootstrapping defer
        window.name = undefined;

        this.appName = appName;
        this.remoteInjectableConfigs = [];

        //Create an injectables module
        this.module = angular.module(this.appName + '.injectables', []);

        //Create a new injector for this bootstrapper
        this.injector = angular.injector(window.getBootstrapper.$inject);
    }

    NgBootstrapper.prototype.addInjectableFromRemoteLocation = function (name, url) {
        if (typeof name !== 'string') {
            throw 'name should be a string';
        }

        if (typeof url !== 'string') {
            throw 'url should be a string';
        }

        this.remoteInjectableConfigs.push({
            name: name,
            remoteUrl: url
        });

        return this;
    };

    NgBootstrapper.prototype.executeRemoteCalls = function () {
        var promises = [];
        var $http = this.injector.get('$http');
        var $log = this.injector.get('$log');
        var $q = this.injector.get('$q');

        this.remoteInjectableConfigs.forEach(function (remoteInjectableConfig) {
            var promise = $http.get(remoteInjectableConfig.remoteUrl).then(function (response) {
                return {
                    name: remoteInjectableConfig.name,
                    data: response.data
                };
            }, function (error) {
                $log.error(error);
                return $q.reject(error);
            });
            promises.push(promise);
        });
        return promises;
    };

    NgBootstrapper.prototype.createFactories = function (responses) {
        var module = this.module;
        angular.forEach(responses, function (response) {
            module.factory(response.name, function () {
                return response.data;
            });
        });
    };

    NgBootstrapper.prototype.bootstrap = function () {
        var self = this;
        var $q = this.injector.get('$q');

        if (this.remoteInjectableConfigs.length > 0) {
            $q.all(this.executeRemoteCalls()).then(function (responses) {
                self.createFactories(responses);
                angular.resumeBootstrap([self.appName + '.injectables']);
            });
        } else {
            angular.resumeBootstrap();
        }

        return this;
    };

    window.getBootstrapper = function (appName, element) {
        //Defer the bootstrapping of any apps

        return new NgBootstrapper(appName, element);
    };
    window.getBootstrapper.$inject = ['ng'];
}(window, angular));
