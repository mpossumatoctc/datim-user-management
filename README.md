#PEPFAR User management app
[![Build Status](https://travis-ci.org/dhis2/user-management-pepfar.svg)](https://travis-ci.org/dhis2/user-management-pepfar)
[![Coverage Status](https://img.shields.io/coveralls/dhis2/user-management-pepfar.svg)](https://coveralls.io/r/dhis2/user-management-pepfar)

##Dependency statuses
Dependency file | Status
---- | ----
package.json | [![Dependency Status](https://www.versioneye.com/user/projects/54595f4b2b4804e10b0000c1/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54595f4b2b4804e10b0000c1)
bower.json | [![Dependency Status](https://www.versioneye.com/user/projects/54595fc12b48049ecc00004e/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54595fc12b48049ecc00004e)

##The app uses the following depencencies
+ angular-ui-router (ui.router) https://github.com/angular-ui/ui-router
+ restangular (restangular) https://github.com/mgonto/restangular
+ angular-translate (pascalprecht.translate) https://github.com/angular-translate/angular-translate
+ angular-bootstrap (ui.bootstrap) https://github.com/angular-ui/bootstrap
+ angular-ui-select (ui.select) https://github.com/angular-ui/ui-select

##Getting started

### Structure
The project directory stucture is set up as follows. See below the tree for some more detailed information.
+ src
  - {component-name}
    + {partial}.html
    + {component-name}-controller.js
    + {service-name}-service.js
    + {directive-name}-directive.js
  - {component-name}
    + {partial}.html
    + {component-name}-controller.js
    + {service-name}-service.js
    + {directive-name}-directive.js
  - i18n
    + en.json
  - images
    + icons
      + user-maintenance.png
  - index.html
  - manifest.webapp
+ test
  - matchers
    + {custom-jasmine-matcherfile}.js
  - mocks
    + {mock-name}_mock.js
  - specs
    + {component-name}
      + {component-name}-controller_spec.js
      + {service-name}-service_spec.js
      + {directive-name}-directive_spec.js
  - utils
    + {files that do not fit the specs/mocks or matchers category}
+ vendor
  - {Place where bower stores its components}
+ build
  - {The place where the project gets build when calling `gulp build` or `gulp build-prod`}

In the main directory you will find a folder `src`. This folder contains all the source files that will be used in the app. This folder will contain all the angular components likes services / directives / controllers etc.

##### Some special things
The `manifest.webapp` might not look familiar. This is a mozilla open web app manifest. This manifest file is used to install the app into DHIS2. See https://developer.mozilla.org/en-US/Apps/Quickstart/Build/Intro_to_open_web_apps  and https://www.dhis2.org/doc/snapshot/en/developer/html/ch02s02.html for more information.

The following directories might show up in the root of the project. The short explanation should give some insight into why this would have happened.
+ temp
  - Directory used by sass and usemin to store the temporary sass output
+ coverage
  - Directory used by coveralls to store the test coverage output from karma
+ .sass-cache
  - Directory used by sass to store cashed sass output

### How to get started


#####Clone the repository
```
git clone https://github.com/dhis2/user-management-pepfar.git
```

#####Install the node dependencies
```
npm install
```

#####Install the bower app dependencies
```
bower install
```

#####Run the tests
```
gulp test
```

##Running tests continuously
To run the tests continuously while making changes to the app files or the jasmine spec files use the following gulp task.
```
gulp watch
```
