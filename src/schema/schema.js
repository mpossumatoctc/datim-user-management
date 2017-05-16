// TODO: Debug - should originate from data store
var ___schema = {

    "stores": [{
        "name": "Current User",
        "config": {
            "endpoint": "me",
            "get": {
                "fields": ":all,userCredentials[:owner,!userGroupAccesses,userRoles[id,name,displayName]],!userGroupAccesses,userGroups[id,name,displayName],organisationUnits[id,name]"
            }
        },
        "extend": {
            "authorities": {
                "type": "REST",
                "config": {
                    "endpoint": "me/authorization"
                }
            },
            "hasUserRole": {
                "type": "function",
                "args": [ "name" ],
                "config": "((this.userCredentials || {}).userRoles || []).some(function (userRole) { return userRole.name === name; })"
            },
            "hasAllAuthority": {
                "type": "function",
                "config": "(this.authorities || []).indexOf('ALL') >= 0"
            },
            "isUserAdministrator": {
                "type": "function",
                "config": "this.hasUserRole('User Administrator')"
            },
            "isGlobalUser": {
                "type": "function",
                "config": "this.organisationUnits && this.organisationUnits.length && this.organisationUnits[0].name === 'Global'"
            }
        }
    }, {
        "name": "User Roles",
        "config": {
            "datamodel": "userRoles"
        },
        "extend": {
            "getByName": {
                "type": "function",
                "args": [ "name" ],
                "config": "_.find(this, { name: name })"
            }
        }
    }, {
        "name": "User Actions by User Type",
        "type": "static",
        "requires": [ "User Roles" ],
        "config": {
            "actions": [
                { "name": "Read data", "userRole": "Read Only", "default": true },
                { "name": "Accept data", "userRole": "Data Accepter" },
                { "name": "Submit data", "userRole": "Data Submitter" },
                { "name": "Manage user", "userRole": "User Administrator", "userGroupRestriction": true },
                { "name": "Data deduplication", "userRole": "Data Deduplication" },
                { "name": "Data Entry EA", "userRole": "Data Entry EA" },
                { "name": "Data Entry SI", "userRole": "Data Entry SI" },
                { "name": "Data Entry SI Country Team", "userRole": "Data Entry SI Country Team" },
                { "name": "Data Entry SI DOD", "userRole": "Data Entry SI DOD" },
                { "name": "Data Entry SIMS", "userRole": "Data Entry SIMS" },
                { "name": "Data Entry SIMS Key Populations", "userRole": "Data Entry SIMS Key Populations" },
                { "name": "Tracker", "userRole": "Tracker" }
            ],
            "definitions": {
                "default": {
                    "Agency": {
                        "*": [ "Accept data", "Submit data" ],
                        "SIMS": [ "Data Entry SIMS" ],
                        "SIMS Key Populations": [ "Data Entry SIMS Key Populations" ]
                    },
                    "Inter-Agency": {
                        "*": [ "Accept data", "Submit data" ],
                        "SI": [ "Data Deduplication", "Data Entry SI Country Team", "Tracker" ]
                    },
                    "Partner": {
                        "*": [ "Submit data" ],
                        "EA": [ "Data Entry EA" ],
                        "SI": [ "Data Entry SI" ],
                        "SI DOD": [ "Data Entry SI DOD" ]
                    }
                },
                "manager": {
                    "Agency": {
                        "EA": [ "Data Entry EA" ],
                        "SI": [ "Data Entry SI" ],
                        "SI DOD": [ "Data Entry SI DOD" ]
                    },
                    "Inter-Agency": {
                        "EA": [ "Data Entry EA" ],
                        "SI": [ "Data Entry SI" ],
                        "SI DOD": [ "Data Entry SI DOD" ],
                        "SIMS": [ "Data Entry SIMS" ],
                        "SIMS Key Populations": [ "Data Entry SIMS Key Populations" ]
                    }
                }
            }
        },
        "extend": {
            "getDefinition": {
                "type": "function",
                "args": [ "userType", "dataGroup", "isManager" ],
                "config": "(this.definitions[(isManager ? 'manager' : 'default')][userType] || {})[dataGroup] || []"
            },
            "getActionNames": {
                "type": "function",
                "args": [ "userType", "dataGroup", "isManager" ],
                "config": "_.unique(this.getDefinition(userType, '*', false).concat(this.getDefinition(userType, '*', isManager)).concat(this.getDefinition(userType, dataGroup, false)).concat(this.getDefinition(userType, dataGroup, isManager)))"
            },
            "getRoleIds": {
                "type": "function",
                "args": [ "userType", "dataGroup", "isManager" ],
                "config": "this.getActionNames(userType, dataGroup, isManager).map(function (roleName) { return (requires['User Roles'].getByName(roleName) || {}).userRoleId; })"
            }
        },
        "filter": "this.actions.forEach(function (action) { action.userRoleId = (requires['User Roles'].getByName(action.userRole) || {}).id; }) || this"
    }, {
        "name": "User Types",
        "type": "static",
        "config": [
            { "name": "Global", "regex": "^Global users" },
            { "name": "Inter-Agency", "value": "Country team", "regex": "^OU .+? Country team$" },
            { "name": "Agency", "regex": "^OU .+? Agency " },
            { "name": "Partner", "regex": "^OU .+? Partner " }
        ],
        "extend": {
            "fromUser": {
                "type": "function",
                "args": [ "user" ],
                "config": "(this.filter(function (ut) { return (user.userGroups || []).some(function (ug) { return (new RegExp(ut.regex, 'i').test(ug.name)); }); })[0] || { name: 'Unknown type' }).name"
            }
        }
    }, {
        "name": "Data Groups Definition",
        "type": "static",
        "config": [
            { "name": "SI" },
            { "name": "EA" },
            { "name": "SIMS" },
            { "name": "SIMS Key Populations" }
        ],
        "extend": {
            "getNames": {
                "type": "function",
                "args": [ "prefix", "suffix" ],
                "config": "this.map(function (dg) { return [prefix, dg.name, suffix].join(' ').trim(); })"
            }
        }
    }, {
        "name": "Data Groups User Groups",
        "requires": [ "Data Groups Definition" ],
        "config": {
            "datamodel": "userGroups",
            "get": {
                "filter": "name:in:[${requires['Data Groups Definition'].getNames('Data', 'access').join(',')}]"
            },
            "filter": "_.groupBy(this, function (ug) { return ug.name.replace(/^Data | access$/g, ''); })"
        }
    }, {
        "name": "Data Groups User Roles",
        "requires": [ "Data Groups Definition" ],
        "config": {
            "datamodel": "userRoles",
            "get": {
                "filter": "name:in:[${requires['Data Groups Definition'].getNames('Data Entry').join(',')}]"
            },
            "filter": "_.groupBy(this, function (obj) { return obj.name.replace(/^Data Entry /, ''); })"
        }
    }, {
        "name": "Data Groups",
        "type": "static",
        "requires": [ "Current User", "Data Groups Definition", "Data Groups User Groups", "Data Groups User Roles" ],
        "extend": {
            "arrayHasAll": {
                "type": "function",
                "args": [ "source", "requires" ],
                "config": "requires.every(function (key) { return source.indexOf(key) !== -1; })"
            },
            "isAccessibleToUser": {
                "type": "function",
                "args": [ "dataGroup", "user" ],
                "config": "this.arrayHasAll(_.pluck(user.userGroups || [], 'id'), _.pluck(dataGroup.userGroups || [], 'id'))"
            },
            "isEntryForUser": {
                "type": "function",
                "args": [ "dataGroup", "user" ],
                "config": "this.arrayHasAll(_.pluck(user.userCredentials.userRoles || [], 'name'), _.pluck(dataGroup.userRoles || [], 'name'))"
            },
            "extendFromUser": {
                "type": "function",
                "args": [ "dataGroup", "user" ],
                "config": "{ access: this.isAccessibleToUser(dataGroup, user), entry: this.isEntryForUser(dataGroup, user) }"
            },
            "fromUser": {
                "type": "function",
                "args": [ "user" ],
                "config": "this.map(function (dg) { return _.assign(_.clone(dg), this.extendFromUser(user)); }.bind(this))"
            }
        },
        "filter": [
            "requires['Data Groups Definition'].slice()",
            "this.map(function (dg) { return (dg.userGroups = requires['Data Groups User Groups'][dg.name] || []) && dg; })",
            "this.map(function (dg) { return (dg.userRoles = requires['Data Groups User Roles'][dg.name] || []) && dg; })",
            "this.filter(function (dg) { return requires['Current User'].hasAllAuthority() || _.pluck(dg.userGroups, 'id').some(function (ugId) { return _.pluck(requires['Current User'].userGroups, 'id').indexOf(ugId) !== -1; }) })"
        ]
    }, {
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
    }, {
        "name": "Funding Agency COGS",
        "config": {
            "datamodel": "categoryOptionGroupSets",
            "get": {
                "fields": "id",
                "filter": "name:eq:Funding Agency"
            },
            "filter": "(this[0] || {}).id"
        }
    }, {
        "name": "Agencies",
        "requires": [ "Funding Agency COGS" ],
        "config": {
            "endpoint": "categoryOptionGroupSets",
            "datamodel": "categoryOptionGroups",
            "get": {
                "fields": "categoryOptionGroups[id,name,code]",
                "id": "${requires['Funding Agency COGS']}"
            },
            "filter": "_.sortBy(this.filter(function (agency) { return (agency && typeof agency.code === 'string' && agency.code !== ''); }), 'name')"
        }
    }, {
        "name": "Agency User Groups",
        "type": "dynamic",
        "args": [ "organisationUnit" ],
        "preflight": "organisationUnit && !!organisationUnit.name",
        "config": {
            "datamodel": "userGroups",
            "get": {
                "filter": "name:ilike:${organisationUnit.name} Agency"
            }
        }
    }, {
        "name": "DoD View ID",
        "config": {
            "endpoint": "systemSettings/keyAPP_User_Management-dod_only_SqlView",
            "datamodel": "value"
        }
    }, {
        "name": "DoD View Data",
        "requires": [ "DoD View ID" ],
        "config": {
            "endpoint": "sqlViews/${requires['DoD View ID']}/data.json",
            "filter": "_.groupBy(this.rows.map(function (row) { return this.headers.reduce(function (obj, metadata, index) { obj[metadata.name] = row[index]; return obj; }, {}); }.bind(this)), 'ou')"
        },
        "extend": {
            "hasEntry": {
                "type": "function",
                "args": [ "orgUnitId", "partnerId" ],
                "config": "_.some(this[orgUnitId] || [], { partner: partnerId })"
            },
            "isNormalEntry": {
                "type": "function",
                "args": [ "orgUnitId", "partnerId" ],
                "config": "(this.hasEntry(orgUnitId, partnerId) ? _.some(this[orgUnitId], { partner: partnerId, nondod: '1' }) : true)"
            }
        }
    }, {
        "name": "Implementing Partner COGS",
        "config": {
            "datamodel": "categoryOptionGroupSets",
            "get": {
                "fields": "id",
                "filter": "name:eq:Implementing Partner"
            },
            "filter": "(this[0] || {}).id"
        }
    }, {
        "name": "Partners",
        "requires": [ "Implementing Partner COGS" ],
        "config": {
            "endpoint": "categoryOptionGroupSets",
            "datamodel": "categoryOptionGroups",
            "get": {
                "fields": "categoryOptionGroups[id,name,code]",
                "id": "${requires['Implementing Partner COGS']}"
            },
            "filter": "_.sortBy(this.filter(function (partner) { return (partner && typeof partner.code === 'string' && partner.code !== ''); }), 'name')"
        },
        "extend": {
            "getUserGroupRegExp": {
                "type": "function",
                "target": "item",
                "args": [ "userGroupType" ],
                "config": "new RegExp('^OU .+? ' + (this.code || '').replace(/^Partner_/, 'Partner ') + ' ' + userGroupType + ' - .+$', 'i')"
            },
            "assignUserGroup": {
                "type": "function",
                "target": "item",
                "args": [ "target", "userGroups", "userGroupType" ],
                "config": "this[target] = _.find(userGroups, function (ug) { return ug.name.match(this.getUserGroupRegExp(userGroupType)); }.bind(this))"
            }
        }
    }, {
        "name": "Partners in Organisation",
        "requires": [ "Partners", "DoD View Data" ],
        "type": "dynamic",
        "args": [ "organisationUnit" ],
        "preflight": "organisationUnit && !!organisationUnit.name",
        "config": {
            "datamodel": "userGroups",
            "get": {
                "filter": "name:ilike:${organisationUnit.name} Partner"
            },
            "filter": [
                "requires['Partners'].forEach(function (partner) { partner.assignUserGroup('mechUserGroup', this, 'all mechanisms'); partner.assignUserGroup('userUserGroup', this, 'users'); partner.assignUserGroup('userAdminUserGroup', this, 'user administrators'); }.bind(this)) || this",
                "requires['Partners'].filter(function (partner) { return partner.mechUserGroup && partner.mechUserGroup.id && partner.userUserGroup && partner.userUserGroup.id; })",
                "this.forEach(function (partner) { partner.dodEntry = requires['DoD View Data'].hasEntry(organisationUnit.id, partner.id); partner.normalEntry = requires['DoD View Data'].isNormalEntry(organisationUnit.id, partner.id); })"
            ]
        }
    }, {
        "name": "Interagency Groups",
        "type": "dynamic",
        "args": [ "organisationUnit" ],
        "preflight": "organisationUnit && !!organisationUnit.name",
        "config": [{
            "name": "userUserGroup",
            "datamodel": "userGroups",
            "get": {
                "filter": "name:ilike:OU ${organisationUnit.name} Country team"
            },
            "filter": "this.reduce(function (current, ug) { return (/OU .+? Country team/i).test(ug.name) ? ug : current; }, undefined)"
        }, {
            "name": "userAdminUserGroup",
            "datamodel": "userGroups",
            "get": {
                "filter": "name:ilike:OU ${organisationUnit.name} user administrators"
            },
            "filter": "this.reduce(function (current, ug) { return (/OU .+? user administrators/i).test(ug.name) ? ug : current; }, undefined)"
        }, {
            "name": "mechUserGroup",
            "datamodel": "userGroups",
            "get": {
                "filter": "name:ilike:OU ${organisationUnit.name} all mechanisms"
            },
            "filter": "this.reduce(function (current, ug) { return (/OU .+? all mechanisms/i).test(ug.name) ? ug : current; }, undefined)"
        }]
    }, {
        "name": "Category Dimension Constraint",
        "config": {
            "datamodel": "categories",
            "get": {
                "filter": "name:eq:Funding Mechanism"
            },
            "filter": "this[0]"
        }
    }],

    "authorizations": [ ]
};

module.exports = ___schema;
