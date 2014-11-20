(function (window, angular) {

    /**
     * Constructs a new instance of the bootstrapper
     *
     * @param {String} appName Name of the app module that needs to be bootstrapped
     * @param {DomNode} element The element that the module needs to be attached to
     * @constructor
     */
    function NgBootstrapper(appName, element) {
        if (!appName || typeof appName !== 'string') {
            throw 'App name should be a string';
        }

        //Will throw an error if the module does not exist
        angular.module(appName);

        this.appName = appName;
        this.remoteInjectableConfigs = [];

        //Create an injectables module
        this.module = angular.module(this.appName + '.injectables', []);

        //Create a new injector for this bootstrapper
        this.injector = angular.injector(window.getBootstrapper.$inject);

        //Defer the bootstrapping by setting the name flag
        window.name = 'NG_DEFER_BOOTSTRAP!';

        angular.bootstrap(element, [this.appName]);

        //Reset the bootstrapping defer
        window.name = undefined;
    }

    /**
     * Specify a remote source by setting the name and the location.
     * The sources will be loaded when the bootstrap method is called.
     *
     * @param {String} name The name this data will be known by, the injectable name
     * @param {String} url The url where the data is located
     *
     * @returns {NgBootstrapper} Returns itself for chaining purposes
     */
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

    /**
     * Execute the ajax calls for the dependencies that are set using one of the add methods
     *
     * @returns {Array} Returns an array of promises that represent the requests
     */
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

    /**
     * Creates the factories on the module that will be injected with the external results.
     * It adds a factory to the module that returns the data on the response.
     * It looks for a data property on each of the responses.
     *
     * @param {Array} responses Array of responses that have been received from the ajax calls.
     */
    NgBootstrapper.prototype.createFactories = function (responses) {
        var module = this.module;
        angular.forEach(responses, function (response) {
            module.factory(response.name, function () {
                return response.data;
            });
        });
    };

    /**
     * Perform the actual bootstrapping. It executes the remote calls and when all of
     * them are successful will create the injectables and bootstrap the app.
     *
     * @returns {NgBootstrapper} Returns itself for chaining purposes
     */
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

    /**
     * Exposed method on the window to get a new bootstrapper.
     *
     * @param {String} appName Name of the app module that needs to be bootstrapped.
     * @param {DomNode} element Dom element that the app will be attached to.
     * @returns {NgBootstrapper} Returns the instance of the bootstrapper.
     */
    window.getBootstrapper = function (appName, element) {
        //Defer the bootstrapping of any apps

        return new NgBootstrapper(appName, element);
    };
    window.getBootstrapper.$inject = ['ng'];
}(window, angular));
