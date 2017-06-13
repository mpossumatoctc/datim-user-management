# DATIM User Management Schema Definition

The schema defines static data within the Datim User Management application.  It also defines how data structures are defined, retrieved, their relationships to one another, and logic associated with the data.

#### Basic Schema Structure
+ i18n - translations keyed by locale
+ stores - data stored leveraged by the app

## i18n

Defines the translation keys by locale used within the app

```
i18n: {
    en: {
        "user": "User"
    },
    de: {
        "user": "Benutzer"
    }
}
```
## Stores

Defined the data sets used within the application that can be either static data or data retrieved from a RESTful web.  Data stores can "require" other data stores and leverage that data for filtering or making web requests.  The structure of a store is as follows:

+ name - a unique name for the data store
+ type - the type of data store
  - static - predefined (static) data
  - rest - data to be retrieved from the DHIS2 RESTful api
  - dynamic - data to be retrieved from the DHIS2 RESTful api that requires some user input (arguments)
+ requires - array of data store names required in order for the data store to be loaded / read
+ args - array of arguments (by name) leveraged by the store "config."  args must be used in conjunction with type = dynamic
+ preflight - JavaScript validation expression that must be truthy in order to execute
+ config - object representing the store configuration
  - when type is static this is the actual data set
  - when type is rest this is the restful definition
  - when type is dynamic this could be an array of restful requests keyed by name
+ extend - object representing JavaScript function expressions that will be bound to the dataset
  - fn - JavaScript function expression [or]
  - get - JavaScript function expression to be used as a getter
  - args - array of arguments bound to the fn defined (cannot be used with "get")
+ filter - array or string representing JavaScript expression(s) that will run against the dataset

### Static Data Set (type = "static")
Defines static data to be used within the application

```
stores: [{
    "name": "Predefined Data Set",
    "type": "static",
    "config": [
        { "id": "Key1", "value": "Data for Key1" },
        { "id": "Key2", "value": "Data for Key2" }
    ]
}]
```

### RESTful Data Set (type = "rest")
Defines a data set within the application that is populated with data retrieved from the DHIS2 api via a web request

The definition below retrieves all of the user roles from DHIS2 and stores them into "User Roles."  The default request will disable paging and retrieve only the id and name fields.

```
stores: [{
    "name": "User Roles",
    "config": {
        "datamodel": "userRoles"
    }
}]
```

A more sophisticated data store calls a REST service by utilizing argument data

```
stores: [{
    "name": "Organisation Units at Level",
    "type": "dynamic",
    "args": [ "level" ],
    "config": {
        "datamodel": "organisationUnits",
        "get": {
            "level": "${level}",
            "fields": "id,name,displayName"
        },
        "filter": "_.sortBy(this, 'name')"
    }
}]
```

The above data store retrieves the organisationUnits at a specific level.  In order to get data the user / app must also pass in a "level" argument.  This data is then bound to the "level" field when making the get request to the server.  After retrieving the data, a lodash sort is executed ("filter") and the resulting dataset is returned.

Multiple data sets can be returned as well.  They must be keyed and the data returned is an Object that has properties named by the name of each config block.
