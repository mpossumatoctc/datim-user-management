describe('ngBootstrapper', function () {
    var getBootstrapper;
    var ngBootstrapper;
    var element;

    beforeEach(function () {
        spyOn(angular, 'bootstrap').and.callThrough();
        window.getBootstrapper.$inject = ['ng', 'ngMock'];

        getBootstrapper = window.getBootstrapper;
        element = document.createElement('div');
        ngBootstrapper = getBootstrapper('PEPFAR.usermanagement', element);
        document.querySelector('body').appendChild(element);
    });

    it('should be a function on the window', function () {
        expect(getBootstrapper).toBeAFunction();
    });

    it('should create an object', function () {
        expect(getBootstrapper('PEPFAR.usermanagement')).toBeAnObject();
    });

    it('should create different objects when calling multiple times', function () {
        expect(getBootstrapper('PEPFAR.usermanagement')).not.toBe(getBootstrapper('PEPFAR.usermanagement'));
    });

    it('should have should have a property remoteInjectableConfigs', function () {
        expect(getBootstrapper('PEPFAR.usermanagement').remoteInjectableConfigs).toBeAnArray();
    });

    it('should throw an error when the app name is not provided', function () {
        function shouldThrow() {
            getBootstrapper();
        }

        expect(shouldThrow).toThrow('App name should be a string');
    });

    it('should throw an error when the app name is empty', function () {
        function shouldThrow() {
            getBootstrapper('');
        }

        expect(shouldThrow).toThrow('App name should be a string');
    });

    it('should throw an angular error when the module does not exist', function () {
        function shouldThrow() {
            getBootstrapper('some module that does not exist');
        }

        expect(shouldThrow).toThrow();
    });

    it('should call angular.bootstrap', function () {
        getBootstrapper('PEPFAR.usermanagement');

        expect(angular.bootstrap).toHaveBeenCalled();
    });

    describe('addInjectableFromRemoteLocation', function () {
        it('should be a function', function () {
            expect(ngBootstrapper.addInjectableFromRemoteLocation).toBeAFunction();
        });

        it('should add the right object to the remoteInjectablePromises', function () {
            var expectedConfig = {
                name: 'webappManifest',
                remoteUrl: 'manifest.webapp'
            };

            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');

            expect(ngBootstrapper.remoteInjectableConfigs[0]).toEqual(expectedConfig);
        });

        it('should add an object to the remoteInjectablePromises', function () {
            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');

            expect(ngBootstrapper.remoteInjectableConfigs.length).toBe(1);
        });

        it('should throw an error when name is not a string', function () {
            function shouldThrow() {
                ngBootstrapper.addInjectableFromRemoteLocation();
            }

            expect(shouldThrow).toThrow('name should be a string');
        });

        it('should throw an error when url is not a string', function () {
            function shouldThrow() {
                ngBootstrapper.addInjectableFromRemoteLocation('name');
            }

            expect(shouldThrow).toThrow('url should be a string');
        });

        it('should return the ngBootstrapper instance for chaining', function () {
            var ngbs = ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');
            expect(ngbs).toBe(ngBootstrapper);
        });
    });

    describe('bootstrap', function () {
        var element;
        beforeEach(function () {
            angular.bootstrap.calls.reset();
            element = document.createElement('div');
        });

        it('should a function', function () {
            expect(ngBootstrapper.bootstrap).toBeAFunction();
        });

        it('should return the ngBootstrapper instance for chaining', function () {
            expect(ngBootstrapper.bootstrap()).toBe(ngBootstrapper);
        });
    });

    describe('bootstrap remote calls', function () {
        var $httpBackend;

        beforeEach(function () {
            $httpBackend = ngBootstrapper.injector.get('$httpBackend');
            $httpBackend.expectGET('manifest.webapp').respond(200, {name: 'User Management'});

            angular.bootstrap.calls.reset();

            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should do a http request for the set remote injectable manifest', function () {
            ngBootstrapper.bootstrap(element, 'PEPFAR.usermanagement');
            $httpBackend.flush();
        });

        it('should do have created an injectables module for the app', function () {
            ngBootstrapper.bootstrap(element, 'PEPFAR.usermanagement');

            $httpBackend.flush();
            expect(angular.module('PEPFAR.usermanagement.injectables')).toBe(ngBootstrapper.module);
        });

        it('should inject the module into the app and make the data available', function () {
            var injectorForElement;
            var injectedManifest;

            ngBootstrapper.bootstrap(element, 'PEPFAR.usermanagement');
            $httpBackend.flush();

            injectorForElement = angular.element(element).injector();
            injectedManifest = injectorForElement.get('webappManifest');

            expect(injectedManifest).toBeAnObject();
            expect(injectedManifest.name).toBe('User Management');
        });

        it('should inject multiple remote injectables with the correct data', function () {
            var injectorForElement;
            var injectedManifest;
            var markData;

            $httpBackend.expectGET('markData.json').respond(200, {name: 'Mark Polak'});
            ngBootstrapper.addInjectableFromRemoteLocation('markData', 'markData.json');

            ngBootstrapper.bootstrap(element, 'PEPFAR.usermanagement');
            $httpBackend.flush();

            injectorForElement = angular.element(element).injector();
            injectedManifest = injectorForElement.get('webappManifest');
            markData = injectorForElement.get('markData');

            expect(injectedManifest).toBeAnObject();
            expect(injectedManifest.name).toBe('User Management');
            expect(markData.name).toBe('Mark Polak');
        });

        it('should log an error when a remote call failed', function () {
            var $log = ngBootstrapper.injector.get('$log');

            $httpBackend.expectGET('markData.json').respond(404, {});
            ngBootstrapper.addInjectableFromRemoteLocation('markData', 'markData.json');

            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect($log.error.logs.length).toBe(1);
            expect($log.error.logs[0][0].status).toBe(404);
        });
    });
});
