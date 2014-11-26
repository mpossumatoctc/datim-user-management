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
            $httpBackend.expectGET('manifest.webapp').respond(200, {
                name: 'User Management',
                activities: {
                    dhis: {
                        href: 'localhost:8080'
                    }
                }
            });

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
            spyOn($log, 'error').and.callThrough();

            $httpBackend.expectGET('markData.json').respond(404, {});
            ngBootstrapper.addInjectableFromRemoteLocation('markData', 'markData.json');

            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect($log.error.logs.length).toBe(1);
            expect($log.error.logs[0][0].status).toBe(404);
            expect($log.error).toHaveBeenCalled();
        });
    });

    it('should set the element on the bootstrapper', function () {
        var bootstrapper = getBootstrapper('PEPFAR.usermanagement', 'element');

        expect(bootstrapper.element).toEqual('element');
    });

    it('should set the body element as the element if the provided one is the document object', function () {
        var bootstrapper = getBootstrapper('PEPFAR.usermanagement', document);

        expect(bootstrapper.element).toEqual(document.body);
    });

    describe('loadScript', function () {
        var $httpBackend;

        beforeEach(function () {
            $httpBackend = ngBootstrapper.injector.get('$httpBackend');
            $httpBackend.expectGET('manifest.webapp').respond(200, {
                name: 'User Management',
                activities: {
                    dhis: {
                        href: 'localhost:8080'
                    }
                }
            });

            angular.bootstrap.calls.reset();

            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should have a loadScript function', function () {
            $httpBackend.resetExpectations();
            expect(ngBootstrapper.loadScript).toBeAFunction();
        });

        it('should add a script tag to the document with the provided function', function () {
            ngBootstrapper.loadScript('myScript.js');
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect(element.querySelector('script').getAttribute('src')).toEqual('myScript.js');
        });

        it('should return itself for chaining', function () {
            $httpBackend.resetExpectations();

            expect(ngBootstrapper.loadScript('someScript.js')).toBe(ngBootstrapper);
        });

        it('should change the path using the path function', function () {
            ngBootstrapper.loadScript('myScript.js', function (scriptUrl, injectables) {
                return [injectables.webappManifest.activities.dhis.href, scriptUrl].join('/');
            });
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect(element.querySelector('script').getAttribute('src')).toEqual('localhost:8080/myScript.js');
        });

        it('should use the set basePathResolver if it has been set', function () {
            ngBootstrapper.setBasePathResolver(function (scriptUrl, injectables) {
                return [injectables.webappManifest.activities.dhis.href, scriptUrl].join('/');
            });
            ngBootstrapper.loadScript('myScript.js');
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect(element.querySelector('script').getAttribute('src')).toEqual('localhost:8080/myScript.js');
        });
    });

    it('basepath resolver should return the bootstrapper', function () {
        expect(ngBootstrapper.setBasePathResolver()).toBe(ngBootstrapper);
    });

    describe('loadStylesheet', function () {
        var $httpBackend;

        beforeEach(function () {
            $httpBackend = ngBootstrapper.injector.get('$httpBackend');
            $httpBackend.expectGET('manifest.webapp').respond(200, {
                name: 'User Management',
                activities: {
                    dhis: {
                        href: 'localhost:8080'
                    }
                }
            });

            angular.bootstrap.calls.reset();

            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();

            //Remove the added link tags from the head
            Array.prototype.forEach.call(document.head.querySelectorAll('link'), function (element) {
                element.parentElement.removeChild(element);
            });
        });

        it('should be a function', function () {
            $httpBackend.resetExpectations();
            expect(ngBootstrapper.loadStylesheet).toBeAFunction();
        });

        it('should add the link element to the head of the document', function () {
            var currentLinkTags = document.head.querySelectorAll('link').length;

            ngBootstrapper.loadStylesheet('myStylesheet.css');
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect(document.head.querySelectorAll('link').length).toBe(currentLinkTags + 1);
        });

        it('should set the correct attributes', function () {
            ngBootstrapper.loadStylesheet('myStylesheet.css');
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            var styleSheetElement = document.head.querySelector('link');

            expect(styleSheetElement.getAttribute('href')).toBe('myStylesheet.css');
            expect(styleSheetElement.getAttribute('rel')).toBe('stylesheet');
            expect(styleSheetElement.getAttribute('type')).toBe('text/css');
        });

        it('should return itself for chaining', function () {
            $httpBackend.resetExpectations();

            expect(ngBootstrapper.loadStylesheet('')).toBe(ngBootstrapper);
        });

        it('should change the path using the path function', function () {
            var currentLinkTags = document.head.querySelectorAll('link').length;

            ngBootstrapper.loadStylesheet('myStylesheet.css', function (stylesheetUrl, injectables) {
                return [injectables.webappManifest.activities.dhis.href, stylesheetUrl].join('/');
            });
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            var styleSheetElement = document.head.querySelector('link');

            expect(document.head.querySelectorAll('link').length).toBe(currentLinkTags + 1);
            expect(styleSheetElement.getAttribute('href')).toBe('localhost:8080/myStylesheet.css');
        });
    });

    describe('loadModule', function () {
        it('should be a function', function () {
            expect(ngBootstrapper.loadModule).toBeAFunction();
        });

        it('should call the loadScript function with the script url', function () {
            spyOn(ngBootstrapper, 'loadScript');

            ngBootstrapper.loadModule('myModule.js', 'myModule');

            expect(ngBootstrapper.loadScript).toHaveBeenCalledWith('myModule.js', undefined);
        });

        it('should return itself for chaining', function () {
            expect(ngBootstrapper.loadModule()).toBe(ngBootstrapper);
        });

        it('should add the model name to the modules property', function () {
            ngBootstrapper.loadModule('myModule.js', 'myModule');

            expect(ngBootstrapper.modules).toContain('myModule');
        });

        it('should call angular.module when resuming the bootstrap', function () {
            spyOn(angular, 'module');
            ngBootstrapper.loadModule('myModule.js', 'myModule');
            ngBootstrapper.bootstrap();

            expect(angular.module).toHaveBeenCalledWith('myModule');
        });

        it('should set timeout when a module has not been loaded', function () {
            spyOn(angular, 'module').and.callThrough();
            spyOn(window, 'setTimeout');
            ngBootstrapper.loadModule('myModule.js', 'myModule');
            ngBootstrapper.bootstrap();

            expect(angular.module).toHaveBeenCalledWith('myModule');
            expect(window.setTimeout).toHaveBeenCalled();
        });
    });

    describe('execute', function () {
        var $httpBackend;

        beforeEach(function () {
            $httpBackend = ngBootstrapper.injector.get('$httpBackend');
            $httpBackend.expectGET('manifest.webapp').respond(200, {
                name: 'User Management',
                activities: {
                    dhis: {
                        href: 'localhost:8080'
                    }
                }
            });

            angular.bootstrap.calls.reset();

            ngBootstrapper.addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be a function', function () {
            $httpBackend.resetExpectations();

            expect(ngBootstrapper.execute).toBeAFunction();
        });

        it('should execute the given function on bootstrap', function () {
            var executeFunction = jasmine.createSpy();

            ngBootstrapper.execute(executeFunction);
            ngBootstrapper.bootstrap();
            $httpBackend.flush();

            expect(executeFunction).toHaveBeenCalled();
        });

        it('should not fail when the passed parameter is not a function', function () {
            ngBootstrapper.execute();
            ngBootstrapper.bootstrap();
            $httpBackend.flush();
        });

        it('should return itself for chaining', function () {
            $httpBackend.resetExpectations();

            expect(ngBootstrapper.execute()).toBe(ngBootstrapper);
        });
    });
});
