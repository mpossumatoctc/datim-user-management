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

####Clone the repository
'''
git clone https://github.com/dhis2/user-management-pepfar.git
'''

####Install the node dependencies
'''
npm install
'''

####Install the bower app dependencies
'''
bower install
'''

####Run the tests
'''
gulp test
'''