(function () {
    var fixtures = {};

    fixtures.agenciesList = {"categoryOptionGroups": [
        {
            id: "FPUgmtt8HRi",
            code: "Agency_HHS/CDC",
            name: "HHS/CDC",
            created: "2014-05-09T23:23:06.953+0000",
            lastUpdated: "2014-10-05T13:07:55.940+0000"
        },
        {
            id: "m4mzzwVQOUi",
            code: "Agency_U.S. Peace Corps",
            name: "U.S. Peace Corps",
            created: "2014-05-09T23:23:07.533+0000",
            lastUpdated: "2014-10-05T13:07:55.979+0000"
        },
        {
            id: "NLV6dy7BE2O",
            code: "Agency_USAID",
            name: "USAID",
            created: "2014-05-09T23:23:07.254+0000",
            lastUpdated: "2014-10-05T13:07:55.952+0000"
        }
    ]};

    fixtures.partnerList = {"categoryOptionGroups": [
        {
            id: "Cs2c30KKxg6",
            code: "Partner_10000",
            name: "Apple",
            created: "2014-05-28T19:50:31.075+0000",
            lastUpdated: "2014-10-05T13:07:56.175+0000"
        },
        {
            id: "pBimh5znu2H",
            code: "Partner_10001",
            name: "Banana",
            created: "2014-05-28T19:50:31.398+0000",
            lastUpdated: "2014-10-05T13:07:56.182+0000"
        },
        {
            id: "e9F2oANoK6F",
            code: "Partner_10002",
            name: "Cranberry",
            created: "2014-05-28T19:50:31.576+0000",
            lastUpdated: "2014-10-05T13:07:56.178+0000"
        },
        {
            id: "xQ0xjBfQzI8",
            code: "Partner_20002",
            name: "Dragon Fruit",
            created: "2014-05-28T19:50:31.967+0000",
            lastUpdated: "2014-10-05T13:07:56.171+0000"
        }
    ]};

    fixtures.actionsListWithRoles = [
        {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
        {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
        {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
    ];

    fixtures.locales = ["ar", "ar_IQ", "ar_SD", "bn", "bi", "my", "zh", "dz", "en", "fr", "in", "km", "rw", "lo", "ne", "pt", "pt_BR", "ru", "es", "tg", "vi"];

    fixtures.userGroups = {"userGroups": [
        {"id": "YbkldVOJMUl", "name": "Data EA access"},
        {"id": "c6hGi8GEZot", "name": "Data SI access"},
        {"id": "iuD8wUFz95X", "name": "Data SIMS access"},
        {"id": "S6qRafboIIu", "name": "Global EA data"},
        {"id": "XRHKxqIpQ0T", "name": "Global Metadata Administrators"},
        {"id": "l6fLS0atWsv", "name": "Global SI data"},
        {"id": "bP89c2kQQsF", "name": "Global SIMS data"},
        {"id": "ofT4kgxt4h9", "name": "OU Ghana Mechanism 16638 - GAC Data Quality Assessment"},
        {"id": "hFlYeFQLe3O", "name": "OU South Africa Mechanism 14847 - PIMS Database"},
        {"id": "zBucNG6udcd", "name": "OU Tanzania Mechanism 12728 - Data warehouse"},
        {"id": "pbn1BRzeG9w", "name": "OU Uganda Mechanism 10281 - Technical Assistance for Data Use/M&E Systems Strenghtening for Implementing Partners"},
        {"id": "E49I572Cws3", "name": "OU Zambia Mechanism 16833 - TBD - Nursing Continuing Education Database"},
        {"id": "wxguOZ0rZYH", "name": "OU Zimbabwe Mechanism 12893 - Building Health Data Dissemination and Information Use Systems"}
    ]};

    fixtures.userRoles = {"userRoles": [
        {"id": "OKKx4bf4ueV", "name": "Data Entry EA"},
        {"id": "k7BWFXkG6zt", "name": "Data Entry SI"},
        {"id": "iXkZzRKD0i4", "name": "Data Entry SIMS"}
    ]};

    fixtures.userRolesForActions = {"userRoles": [
        {"id": "QbxXEPw9xlf", "name": "Data Accepter"},
        {"id": "n777lf1THwQ", "name": "Data Submitter"},
        {"id": "b2uHwX9YLhu", "name": "Read Only"},
        {"id": "KagqnetfxMr", "name": "User Administrator"},
        {"id": "yYOqiMTxAOF", "name": "Data Entry SI Country Team"},
        {"id": "OKKx4bf4ueV", "name": "Data Entry EA"},
        {"id": "k7BWFXkG6zt", "name": "Data Entry SI"},
        {"id": "iXkZzRKD0i4", "name": "Data Entry SIMS"}
    ]};

    fixtures.currentUser = {"name": "kp1001ea Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism", "created": "2014-09-12T13:16:38.843+0000", "lastUpdated": "2014-11-20T11:06:25.617+0000", "surname": "Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism", "firstName": "kp1001ea", "userCredentials": {"code": "kp1001ea", "name": "kp1001ea Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism", "created": "2014-09-12T13:16:38.843+0000", "lastUpdated": "2014-11-20T11:26:48.495+0000", "username": "kp1001ea", "passwordLastUpdated": "2014-11-20T11:06:25.617+0000", "userRoles": [
        {"name": "Read Only", "created": "2014-02-20T02:47:44.417+0000", "lastUpdated": "2014-10-20T13:39:20.109+0000", "id": "b2uHwX9YLhu"},
        {"name": "Data Entry EA", "created": "2014-09-13T21:11:15.686+0000", "lastUpdated": "2014-10-20T13:39:20.120+0000", "id": "OKKx4bf4ueV"}
    ], "catDimensionConstraints": [
        {"name": "Funding Mechanism", "created": "2014-02-18T07:51:04.612+0000", "lastUpdated": "2014-10-16T12:18:02.751+0000", "id": "SH885jaRe0o"}
    ], "lastLogin": "2014-11-20T11:06:25.756+0000", "selfRegistered": false, "disabled": false, "id": "fpYv7pe4Kbh"},
        "userGroups": [
            {"name": "OU Kenya Mechanism 1001 - Banana USAID Mechanism", "created": "2014-09-29T13:08:16.040+0000", "lastUpdated": "2014-10-16T16:47:55.750+0000", "id": "UUejaqD9UNe"},
            {"name": "OU Kenya Partner 10001 users - Banana", "created": "2014-09-29T13:08:16.357+0000", "lastUpdated": "2014-10-18T12:52:38.664+0000", "id": "pGh2wzc7bMY"}
        ], "organisationUnits": [
            {"code": "ke", "name": "Kenya", "created": "2013-03-14T01:25:38.231+0000", "lastUpdated": "2014-10-20T19:17:09.897+0000", "id": "HfVjCurKxh2"}
        ], "dataViewOrganisationUnits": [
            {"code": "ke", "name": "Kenya", "created": "2013-03-14T01:25:38.231+0000", "lastUpdated": "2014-10-20T19:17:09.897+0000", "id": "HfVjCurKxh2"}
        ], "id": "BukIlLTCbz9"};

    fixtures.currentUserAuthorities = ["F_DATAVALUE_DELETE", "M_dhis-web-sms", "M_dhis-web-reporting", "M_dhis-web-light", "F_DATAVALUE_ADD", "M_dhis-web-maintenance-datadictionary", "F_INDICATOR_PRIVATE_ADD", "F_REPORT_PUBLIC_ADD", "M_dhis-web-mapping", "M_dhis-web-validationrule", "M_dhis-web-pivot", "F_RUN_VALIDATION", "M_dhis-web-dashboard-integration", "F_DOCUMENT_PRIVATE_ADD", "M_dhis-web-importexport", "F_VALIDATIONRULE_ADD", "M_dhis-web-caseentry", "M_dhis-web-visualizer", "M_dhis-web-mobile"];

    fixtures.rwandaUserGroup = {"userGroups": [
        {"id": "k6IKG8UtvJQ", "name": "OU Rwanda Agency DOD all mechanisms"},
        {"id": "yi4l7yIWRQM", "name": "OU Rwanda Agency DOD user administrators"},
        {"id": "f8uYL2O1IFH", "name": "OU Rwanda Agency DOD users"},
        {"id": "Stc8jiohyTg", "name": "OU Rwanda Agency HHS/CDC all mechanisms"},
        {"id": "x47aP9pWYlu", "name": "OU Rwanda Agency HHS/CDC user administrators"},
        {"id": "hjLU7Ug0vKG", "name": "OU Rwanda Agency HHS/CDC users"},
        {"id": "wIY2oMvmLmk", "name": "OU Rwanda Agency PC all mechanisms"},
        {"id": "OjIScdFujry", "name": "OU Rwanda Agency PC user administrators"},
        {"id": "WMAyDS3iOIa", "name": "OU Rwanda Agency PC users"},
        {"id": "HlttAyxuL82", "name": "OU Rwanda Agency State/PRM all mechanisms"},
        {"id": "R048ZoOnLxr", "name": "OU Rwanda Agency State/PRM user administrators"},
        {"id": "BPupZKeCY01", "name": "OU Rwanda Agency State/PRM users"},
        {"id": "FzwHJqJ81DO", "name": "OU Rwanda Agency USAID all mechanisms"},
        {"id": "J19zR2dMaWa", "name": "OU Rwanda Agency USAID user administrators"},
        {"id": "s7jeIAC1Psa", "name": "OU Rwanda Agency USAID users"}
    ]};
    fixtures.rwandaUserGroupWithoutUSAIDUserGroup = {"userGroups": [
        {"id": "k6IKG8UtvJQ", "name": "OU Rwanda Agency DOD all mechanisms"},
        {"id": "yi4l7yIWRQM", "name": "OU Rwanda Agency DOD user administrators"},
        {"id": "f8uYL2O1IFH", "name": "OU Rwanda Agency DOD users"},
        {"id": "Stc8jiohyTg", "name": "OU Rwanda Agency HHS/CDC all mechanisms"},
        {"id": "x47aP9pWYlu", "name": "OU Rwanda Agency HHS/CDC user administrators"},
        {"id": "hjLU7Ug0vKG", "name": "OU Rwanda Agency HHS/CDC users"},
        {"id": "wIY2oMvmLmk", "name": "OU Rwanda Agency PC all mechanisms"},
        {"id": "OjIScdFujry", "name": "OU Rwanda Agency PC user administrators"},
        {"id": "WMAyDS3iOIa", "name": "OU Rwanda Agency PC users"},
        {"id": "HlttAyxuL82", "name": "OU Rwanda Agency State/PRM all mechanisms"},
        {"id": "R048ZoOnLxr", "name": "OU Rwanda Agency State/PRM user administrators"},
        {"id": "BPupZKeCY01", "name": "OU Rwanda Agency State/PRM users"},
        {"id": "FzwHJqJ81DO", "name": "OU Rwanda Agency USAID all mechanisms"},
        {"id": "J19zR2dMaWa", "name": "OU Rwanda Agency USAID user administrators"}
    ]};
    fixtures.rwandaUserGroupWithoutUSAIDAdminUserGroup = {"userGroups": [
        {"id": "k6IKG8UtvJQ", "name": "OU Rwanda Agency DOD all mechanisms"},
        {"id": "yi4l7yIWRQM", "name": "OU Rwanda Agency DOD user administrators"},
        {"id": "f8uYL2O1IFH", "name": "OU Rwanda Agency DOD users"},
        {"id": "Stc8jiohyTg", "name": "OU Rwanda Agency HHS/CDC all mechanisms"},
        {"id": "x47aP9pWYlu", "name": "OU Rwanda Agency HHS/CDC user administrators"},
        {"id": "hjLU7Ug0vKG", "name": "OU Rwanda Agency HHS/CDC users"},
        {"id": "wIY2oMvmLmk", "name": "OU Rwanda Agency PC all mechanisms"},
        {"id": "OjIScdFujry", "name": "OU Rwanda Agency PC user administrators"},
        {"id": "WMAyDS3iOIa", "name": "OU Rwanda Agency PC users"},
        {"id": "HlttAyxuL82", "name": "OU Rwanda Agency State/PRM all mechanisms"},
        {"id": "R048ZoOnLxr", "name": "OU Rwanda Agency State/PRM user administrators"},
        {"id": "BPupZKeCY01", "name": "OU Rwanda Agency State/PRM users"},
        {"id": "FzwHJqJ81DO", "name": "OU Rwanda Agency USAID all mechanisms"},
        {"id": "s7jeIAC1Psa", "name": "OU Rwanda Agency USAID users"}
    ]};
    fixtures.kenyaPartnerAbtUserGroup = {
        id: "hxgit9fvIVv",
        name: "OU Kenya Partner 440 all mechanisms - Abt Associates"
    };
    fixtures.kenyaPartnerUserGroups = {
        userGroups: [
            {
                id: "PPER63aZQ1e",
                name: "OU Kenya Partner 10000 all mechanisms - Apple"
            },
            {
                id: "tICoPGZAWNk",
                name: "OU Kenya Partner 10001 all mechanisms - Banana"
            },
            {
                id: "UCnkwxHKAAm",
                name: "OU Kenya Partner 10001 user administrators - Banana"
            },
            {
                id: "pGh2wzc7bMY",
                name: "OU Kenya Partner 10001 users - Banana"
            },
            {
                id: "f8t4yjDIfiY",
                name: "OU Kenya Partner 10002 all mechanisms - Cranberry"
            },
            {
                id: "w1VeUZljmE8",
                name: "OU Kenya Partner 10002 user administrators - Cranberry"
            },
            {
                id: "eUXnF1aIa1Y",
                name: "OU Kenya Partner 10002 users - Cranberry"
            }
        ]
    };

    fixtures.successInvite = {
        "status": "SUCCESS",
        "importCount": {
            "imported": 1,
            "updated": 0,
            "ignored": 0,
            "deleted": 0
        },
        "type": "User",
        "importConflicts": [
            {
                "object": "(TBD) (TBD)",
                "value": "Unknown reference to IdentifiableObject{id=0, uid='PUSy6gGOQGb', code='invite-mark@thedutchies.com-q6mvxfQ7dcH', name='invite-mark@thedutchies.com-q6mvxfQ7dcH', created=Sat Nov 22 23:04:30 CET 2014, lastUpdated=Sat Nov 22 23:04:30 CET 2014} (UserCredentials) on object IdentifiableObject{id=0, uid='null', code='null', name='(TBD) (TBD)', created=null, lastUpdated=null} (User)."
            }
        ],
        "lastImported": "b4H1KaR7YYa"
    };

    fixtures.sampleInviteObject = {
        "email": "mark@thedutchies.com",
        "organisationUnits": [
            {
                "id": "XtxUYCsDWrR"
            }
        ],
        "dataViewOrganisationUnits": [
            {
                "id": "XtxUYCsDWrR"
            },
            {
                "id": "ybg3MO3hcf4"
            }
        ],
        "groups": [
            {
                "id": "c6hGi8GEZot"
            },
            {
                "id": "YbkldVOJMUl"
            },
            {
                "id": "IvMcZJNUPzr"
            },
            {
                "id": "vLqc4P1P20l"
            },
            {
                "id": "H0c4i5mOtkB"
            }
        ],
        "userCredentials": {
            "userRoles": [
                {
                    "id": "k7BWFXkG6zt"
                },
                {
                    "id": "n777lf1THwQ"
                },
                {
                    "id": "KagqnetfxMr"
                },
                {
                    "id": "b2uHwX9YLhu"
                }
            ],
            "catDimensionConstraints": [
                {
                    "id": "SH885jaRe0o"
                }
            ]
        }
    };

    fixtures.interAgencyGroupUsers = {userGroups: [
        {
            id: "LqrnY1CgnCv",
            name: "OU Rwanda Country team"
        }
    ]};

    fixtures.interAgencyGroupAdmin = {
        pager: {
            page: 1,
            pageCount: 1,
            total: 1
        },
        userGroups: [
            {
                id: "sJSLgsi6KjY",
                name: "OU Rwanda User administrators"
            }
        ]
    };

    fixtures.interAgencyGroupMech = {
        pager: {
            page: 1,
            pageCount: 1,
            total: 1
        },
        userGroups: [
            {
                id: "OGAFubEVJK0",
                name: "OU Rwanda All mechanisms"
            }
        ]
    };

    fixtures.usersPage1 = {"pager": {"page": 1, "pageCount": 19, "total": 919, "nextPage": "http://localhost:8080/dhis/api/users?page=2"}, "users": [
        {"id": "UuuWuLWe4Rv", "created": "2014-10-07T21:42:22.842+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.176+0000", "href": "http://localhost:8080/dhis/api/users/UuuWuLWe4Rv"},
        {"id": "LNqrLrWxPSB", "created": "2014-10-07T21:46:27.046+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.182+0000", "href": "http://localhost:8080/dhis/api/users/LNqrLrWxPSB"},
        {"id": "M15yjJw9to5", "created": "2014-10-07T21:22:28.779+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.123+0000", "href": "http://localhost:8080/dhis/api/users/M15yjJw9to5"},
        {"id": "EU3ZtFJGSHD", "created": "2014-10-07T21:51:09.577+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.146+0000", "href": "http://localhost:8080/dhis/api/users/EU3ZtFJGSHD"},
        {"id": "ANdzUzZeE1a", "created": "2014-10-07T23:31:28.061+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.160+0000", "href": "http://localhost:8080/dhis/api/users/ANdzUzZeE1a"},
        {"id": "r9Bj2qEtwuP", "created": "2014-10-07T19:07:46.311+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.978+0000", "href": "http://localhost:8080/dhis/api/users/r9Bj2qEtwuP"},
        {"id": "gTx1b7rzjSy", "created": "2014-10-07T20:47:08.913+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.094+0000", "href": "http://localhost:8080/dhis/api/users/gTx1b7rzjSy"},
        {"id": "oTkfdS4EZnU", "created": "2014-10-07T19:59:05.202+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.052+0000", "href": "http://localhost:8080/dhis/api/users/oTkfdS4EZnU"},
        {"id": "YTe0G0peiWn", "created": "2014-10-07T19:38:28.226+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.027+0000", "href": "http://localhost:8080/dhis/api/users/YTe0G0peiWn"},
        {"id": "SVvqLs2iAqx", "created": "2014-10-07T19:13:17.018+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.947+0000", "href": "http://localhost:8080/dhis/api/users/SVvqLs2iAqx"},
        {"id": "EHgPv4kHDgH", "created": "2014-10-07T21:41:06.428+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.138+0000", "href": "http://localhost:8080/dhis/api/users/EHgPv4kHDgH"},
        {"id": "PWa3VmQbjls", "created": "2014-10-07T19:24:11.073+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.990+0000", "href": "http://localhost:8080/dhis/api/users/PWa3VmQbjls"},
        {"id": "bfCh2zjVjz7", "created": "2014-10-05T20:03:19.555+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.851+0000", "href": "http://localhost:8080/dhis/api/users/bfCh2zjVjz7"},
        {"id": "x1kxMBHJPsB", "created": "2014-10-07T19:04:53.727+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.965+0000", "href": "http://localhost:8080/dhis/api/users/x1kxMBHJPsB"},
        {"id": "nKP1XOM0Cek", "created": "2014-10-07T19:02:41.185+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.959+0000", "href": "http://localhost:8080/dhis/api/users/nKP1XOM0Cek"},
        {"id": "Kcw2yxO7usM", "created": "2014-10-07T19:30:57.366+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.002+0000", "href": "http://localhost:8080/dhis/api/users/Kcw2yxO7usM"},
        {"id": "nweaJZQy92S", "created": "2014-10-07T20:01:15.048+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.039+0000", "href": "http://localhost:8080/dhis/api/users/nweaJZQy92S"},
        {"id": "hhwR6grx6BN", "created": "2014-10-05T20:18:00.372+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.863+0000", "href": "http://localhost:8080/dhis/api/users/hhwR6grx6BN"},
        {"id": "WkGrJkt6upz", "created": "2014-10-07T19:29:32.194+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.996+0000", "href": "http://localhost:8080/dhis/api/users/WkGrJkt6upz"},
        {"id": "bgIRI370uR5", "created": "2014-10-28T17:13:54.432+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-28T17:13:54.432+0000", "href": "http://localhost:8080/dhis/api/users/bgIRI370uR5"},
        {"id": "Z2tnwkOm0Dm", "created": "2014-10-07T19:33:45.645+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.014+0000", "href": "http://localhost:8080/dhis/api/users/Z2tnwkOm0Dm"},
        {"id": "z0jLyQhLjhT", "created": "2014-10-07T19:40:27.135+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.033+0000", "href": "http://localhost:8080/dhis/api/users/z0jLyQhLjhT"},
        {"id": "fW15xJNbRUW", "created": "2014-10-07T20:32:42.059+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.058+0000", "href": "http://localhost:8080/dhis/api/users/fW15xJNbRUW"},
        {"id": "QP8WFGDhJWh", "created": "2014-10-07T21:34:56.789+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.131+0000", "href": "http://localhost:8080/dhis/api/users/QP8WFGDhJWh"},
        {"id": "avyij13zXdX", "created": "2014-10-16T10:21:28.413+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:52.224+0000", "href": "http://localhost:8080/dhis/api/users/avyij13zXdX"},
        {"id": "hLcvxw8tdVp", "created": "2014-10-07T19:46:23.224+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.870+0000", "href": "http://localhost:8080/dhis/api/users/hLcvxw8tdVp"},
        {"id": "gK5dwQHPXQc", "created": "2014-10-09T11:22:20.651+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.935+0000", "href": "http://localhost:8080/dhis/api/users/gK5dwQHPXQc"},
        {"id": "VDcq07AsSau", "created": "2014-09-18T17:58:40.346+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.661+0000", "href": "http://localhost:8080/dhis/api/users/VDcq07AsSau"},
        {"id": "n1IxuQW4TFE", "created": "2014-10-09T11:23:26.694+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.945+0000", "href": "http://localhost:8080/dhis/api/users/n1IxuQW4TFE"},
        {"id": "hyS5Nz0ucJz", "created": "2014-09-17T11:48:45.362+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.549+0000", "href": "http://localhost:8080/dhis/api/users/hyS5Nz0ucJz"},
        {"id": "zrWtUgqM2pq", "created": "2014-10-09T11:24:43.705+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.955+0000", "href": "http://localhost:8080/dhis/api/users/zrWtUgqM2pq"},
        {"id": "Znf6EouxgwC", "created": "2014-10-07T18:59:03.722+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.953+0000", "href": "http://localhost:8080/dhis/api/users/Znf6EouxgwC"},
        {"id": "lbLuDO3QxiN", "created": "2014-10-16T11:42:24.419+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:52.226+0000", "href": "http://localhost:8080/dhis/api/users/lbLuDO3QxiN"},
        {"id": "UvVozDx69SH", "created": "2014-09-18T16:51:12.275+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.625+0000", "href": "http://localhost:8080/dhis/api/users/UvVozDx69SH"},
        {"id": "EYUBdxaf6G0", "created": "2014-10-13T15:53:41.635+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.970+0000", "href": "http://localhost:8080/dhis/api/users/EYUBdxaf6G0"},
        {"id": "rK7FC02awav", "created": "2014-09-16T17:42:30.474+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.596+0000", "href": "http://localhost:8080/dhis/api/users/rK7FC02awav"},
        {"id": "blYU13byh9m", "created": "2014-10-07T23:48:47.446+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.007+0000", "href": "http://localhost:8080/dhis/api/users/blYU13byh9m"},
        {"id": "njG5yURaHwX", "created": "2014-09-23T14:50:34.769+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.708+0000", "href": "http://localhost:8080/dhis/api/users/njG5yURaHwX"},
        {"id": "FDztSMBfiLC", "created": "2014-10-14T04:13:31.343+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.979+0000", "href": "http://localhost:8080/dhis/api/users/FDztSMBfiLC"},
        {"id": "dTrhoS3OCbT", "created": "2014-10-07T19:09:08.567+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.984+0000", "href": "http://localhost:8080/dhis/api/users/dTrhoS3OCbT"},
        {"id": "S9yk2340lG7", "created": "2014-09-18T18:20:10.147+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.682+0000", "href": "http://localhost:8080/dhis/api/users/S9yk2340lG7"},
        {"id": "qP07M99z0Gm", "created": "2014-10-07T18:49:20.647+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.895+0000", "href": "http://localhost:8080/dhis/api/users/qP07M99z0Gm"},
        {"id": "kU8rEyKH60C", "created": "2014-10-07T20:15:17.939+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.941+0000", "href": "http://localhost:8080/dhis/api/users/kU8rEyKH60C"},
        {"id": "ux5WUsqDnBf", "created": "2014-10-05T20:26:31.007+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.882+0000", "href": "http://localhost:8080/dhis/api/users/ux5WUsqDnBf"},
        {"id": "LE0PBQO8fVZ", "created": "2014-09-16T17:41:19.490+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.588+0000", "href": "http://localhost:8080/dhis/api/users/LE0PBQO8fVZ"},
        {"id": "ubfSzjHZN9o", "created": "2014-09-17T11:47:08.097+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.540+0000", "href": "http://localhost:8080/dhis/api/users/ubfSzjHZN9o"},
        {"id": "BTtPwJBnMQd", "created": "2014-10-09T11:20:29.156+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:49.898+0000", "href": "http://localhost:8080/dhis/api/users/BTtPwJBnMQd"},
        {"id": "fmAz7fhrECQ", "created": "2014-10-06T20:23:29.963+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:50.844+0000", "href": "http://localhost:8080/dhis/api/users/fmAz7fhrECQ"},
        {"id": "CBqXCfJwacH", "created": "2014-10-07T22:15:53.977+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.195+0000", "href": "http://localhost:8080/dhis/api/users/CBqXCfJwacH"},
        {"id": "rYd8TV1CaU2", "created": "2014-10-07T22:11:30.670+0000", "name": "(TBD) (TBD)", "lastUpdated": "2014-10-16T16:47:51.189+0000", "href": "http://localhost:8080/dhis/api/users/rYd8TV1CaU2"}
    ]};

    fixtures.userObjectDisabled = {"id": "Qjr59ESpRy5", "created": "2014-11-26T00:06:18.693+0000", "name": "Polak Mark", "href": "http://localhost:8080/dhis/api/users/Qjr59ESpRy5", "lastUpdated": "2014-11-26T13:16:20.002+0000", "surname": "Mark", "phoneNumber": "", "externalAccess": false, "firstName": "Polak", "email": "mark@thedutchies.com", "displayName": "Polak Mark", "userCredentials": {"lastUpdated": "2014-11-28T07:31:51.892+0000", "code": "markpolak", "id": "Qod0uIevoba", "created": "2014-11-26T00:06:18.186+0000", "name": "Polak Mark", "selfRegistered": false, "lastLogin": "2014-11-26T20:45:41.814+0000", "username": "markpolak", "externalAccess": false, "displayName": "Polak Mark", "passwordLastUpdated": "2014-11-26T00:06:18.186+0000", "disabled": true, "user": {"id": "Qjr59ESpRy5", "name": "Polak Mark", "created": "2014-11-26T00:06:18.693+0000", "lastUpdated": "2014-11-26T13:16:20.002+0000", "href": "http://localhost:8080/dhis/api/users/Qjr59ESpRy5"}, "cogsDimensionConstraints": [], "userRoles": [
        {"id": "b2uHwX9YLhu", "name": "Read Only", "created": "2014-02-20T02:47:44.417+0000", "lastUpdated": "2014-11-26T22:41:35.436+0000"},
        {"id": "jtzbVV4ZmdP", "name": "Superuser", "created": "2014-01-28T01:43:58.125+0000", "lastUpdated": "2014-10-22T19:49:11.374+0000"},
        {"id": "OKKx4bf4ueV", "name": "Data Entry EA", "created": "2014-09-13T21:11:15.686+0000", "lastUpdated": "2014-11-20T16:40:58.948+0000"},
        {"id": "n777lf1THwQ", "name": "Data Submitter", "created": "2014-05-05T08:41:19.534+0000", "lastUpdated": "2014-11-26T22:41:33.482+0000"},
        {"id": "KagqnetfxMr", "name": "User Administrator", "created": "2014-02-20T02:57:43.415+0000", "lastUpdated": "2014-11-26T22:41:33.442+0000"},
        {"id": "k7BWFXkG6zt", "name": "Data Entry SI", "created": "2014-02-20T02:49:58.841+0000", "lastUpdated": "2014-11-26T22:41:33.516+0000"},
        {"id": "iXkZzRKD0i4", "name": "Data Entry SIMS", "created": "2014-09-13T21:12:24.301+0000", "lastUpdated": "2014-11-20T03:00:51.610+0000"}
    ], "catDimensionConstraints": [
        {"id": "SH885jaRe0o", "name": "Funding Mechanism", "created": "2014-02-18T07:51:04.612+0000", "lastUpdated": "2014-11-24T11:56:38.859+0000"}
    ], "userGroupAccesses": []}, "access": {"update": true, "externalize": false, "delete": true, "write": true, "read": true, "manage": false}, "organisationUnits": [
        {"id": "XtxUYCsDWrR", "name": "Rwanda", "code": "RW", "created": "2014-02-18T06:43:03.335+0000", "lastUpdated": "2014-11-26T22:41:35.298+0000", "href": "http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"}
    ], "dataViewOrganisationUnits": [
        {"id": "XtxUYCsDWrR", "name": "Rwanda", "code": "RW", "created": "2014-02-18T06:43:03.335+0000", "lastUpdated": "2014-11-26T22:41:35.298+0000", "href": "http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"}
    ], "attributeValues": [], "userGroups": [
        {"id": "sJSLgsi6KjY", "name": "OU Rwanda User administrators", "created": "2014-09-29T12:56:41.284+0000", "lastUpdated": "2014-11-26T22:12:38.580+0000", "href": "http://localhost:8080/dhis/api/userGroups/sJSLgsi6KjY"},
        {"id": "YbkldVOJMUl", "name": "Data EA access", "created": "2014-09-29T12:44:02.361+0000", "lastUpdated": "2014-11-26T22:47:50.978+0000", "href": "http://localhost:8080/dhis/api/userGroups/YbkldVOJMUl"},
        {"id": "c6hGi8GEZot", "name": "Data SI access", "created": "2014-09-29T12:44:05.359+0000", "lastUpdated": "2014-11-27T09:04:28.371+0000", "href": "http://localhost:8080/dhis/api/userGroups/c6hGi8GEZot"},
        {"id": "OGAFubEVJK0", "name": "OU Rwanda All mechanisms", "created": "2014-09-29T12:56:41.450+0000", "lastUpdated": "2014-11-26T23:08:18.645+0000", "href": "http://localhost:8080/dhis/api/userGroups/OGAFubEVJK0"},
        {"id": "iuD8wUFz95X", "name": "Data SIMS access", "created": "2014-09-29T12:44:09.145+0000", "lastUpdated": "2014-11-26T23:08:18.561+0000", "href": "http://localhost:8080/dhis/api/userGroups/iuD8wUFz95X"},
        {"id": "LqrnY1CgnCv", "name": "OU Rwanda Country team", "created": "2014-09-29T12:56:41.136+0000", "lastUpdated": "2014-11-26T23:08:18.726+0000", "href": "http://localhost:8080/dhis/api/userGroups/LqrnY1CgnCv"}
    ], "userGroupAccesses": []};
    fixtures.userObjectEnabled = {"id": "Qjr59ESpRy5", "created": "2014-11-26T00:06:18.693+0000", "name": "Polak Mark", "href": "http://localhost:8080/dhis/api/users/Qjr59ESpRy5", "lastUpdated": "2014-11-26T13:16:20.002+0000", "surname": "Mark", "phoneNumber": "", "externalAccess": false, "firstName": "Polak", "email": "mark@thedutchies.com", "displayName": "Polak Mark", "userCredentials": {"lastUpdated": "2014-11-28T07:31:51.892+0000", "code": "markpolak", "id": "Qod0uIevoba", "created": "2014-11-26T00:06:18.186+0000", "name": "Polak Mark", "selfRegistered": false, "lastLogin": "2014-11-26T20:45:41.814+0000", "username": "markpolak", "externalAccess": false, "displayName": "Polak Mark", "passwordLastUpdated": "2014-11-26T00:06:18.186+0000", "disabled": false, "user": {"id": "Qjr59ESpRy5", "name": "Polak Mark", "created": "2014-11-26T00:06:18.693+0000", "lastUpdated": "2014-11-26T13:16:20.002+0000", "href": "http://localhost:8080/dhis/api/users/Qjr59ESpRy5"}, "cogsDimensionConstraints": [], "userRoles": [
        {"id": "b2uHwX9YLhu", "name": "Read Only", "created": "2014-02-20T02:47:44.417+0000", "lastUpdated": "2014-11-26T22:41:35.436+0000"},
        {"id": "jtzbVV4ZmdP", "name": "Superuser", "created": "2014-01-28T01:43:58.125+0000", "lastUpdated": "2014-10-22T19:49:11.374+0000"},
        {"id": "OKKx4bf4ueV", "name": "Data Entry EA", "created": "2014-09-13T21:11:15.686+0000", "lastUpdated": "2014-11-20T16:40:58.948+0000"},
        {"id": "n777lf1THwQ", "name": "Data Submitter", "created": "2014-05-05T08:41:19.534+0000", "lastUpdated": "2014-11-26T22:41:33.482+0000"},
        {"id": "KagqnetfxMr", "name": "User Administrator", "created": "2014-02-20T02:57:43.415+0000", "lastUpdated": "2014-11-26T22:41:33.442+0000"},
        {"id": "k7BWFXkG6zt", "name": "Data Entry SI", "created": "2014-02-20T02:49:58.841+0000", "lastUpdated": "2014-11-26T22:41:33.516+0000"},
        {"id": "iXkZzRKD0i4", "name": "Data Entry SIMS", "created": "2014-09-13T21:12:24.301+0000", "lastUpdated": "2014-11-20T03:00:51.610+0000"}
    ], "catDimensionConstraints": [
        {"id": "SH885jaRe0o", "name": "Funding Mechanism", "created": "2014-02-18T07:51:04.612+0000", "lastUpdated": "2014-11-24T11:56:38.859+0000"}
    ], "userGroupAccesses": []}, "access": {"update": true, "externalize": false, "delete": true, "write": true, "read": true, "manage": false}, "organisationUnits": [
        {"id": "XtxUYCsDWrR", "name": "Rwanda", "code": "RW", "created": "2014-02-18T06:43:03.335+0000", "lastUpdated": "2014-11-26T22:41:35.298+0000", "href": "http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"}
    ], "dataViewOrganisationUnits": [
        {"id": "XtxUYCsDWrR", "name": "Rwanda", "code": "RW", "created": "2014-02-18T06:43:03.335+0000", "lastUpdated": "2014-11-26T22:41:35.298+0000", "href": "http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"}
    ], "attributeValues": [], "userGroups": [
        {"id": "sJSLgsi6KjY", "name": "OU Rwanda User administrators", "created": "2014-09-29T12:56:41.284+0000", "lastUpdated": "2014-11-26T22:12:38.580+0000", "href": "http://localhost:8080/dhis/api/userGroups/sJSLgsi6KjY"},
        {"id": "YbkldVOJMUl", "name": "Data EA access", "created": "2014-09-29T12:44:02.361+0000", "lastUpdated": "2014-11-26T22:47:50.978+0000", "href": "http://localhost:8080/dhis/api/userGroups/YbkldVOJMUl"},
        {"id": "c6hGi8GEZot", "name": "Data SI access", "created": "2014-09-29T12:44:05.359+0000", "lastUpdated": "2014-11-27T09:04:28.371+0000", "href": "http://localhost:8080/dhis/api/userGroups/c6hGi8GEZot"},
        {"id": "OGAFubEVJK0", "name": "OU Rwanda All mechanisms", "created": "2014-09-29T12:56:41.450+0000", "lastUpdated": "2014-11-26T23:08:18.645+0000", "href": "http://localhost:8080/dhis/api/userGroups/OGAFubEVJK0"},
        {"id": "iuD8wUFz95X", "name": "Data SIMS access", "created": "2014-09-29T12:44:09.145+0000", "lastUpdated": "2014-11-26T23:08:18.561+0000", "href": "http://localhost:8080/dhis/api/userGroups/iuD8wUFz95X"},
        {"id": "LqrnY1CgnCv", "name": "OU Rwanda Country team", "created": "2014-09-29T12:56:41.136+0000", "lastUpdated": "2014-11-26T23:08:18.726+0000", "href": "http://localhost:8080/dhis/api/userGroups/LqrnY1CgnCv"}
    ], "userGroupAccesses": []};
    fixtures.userPutSuccess = {"status": "SUCCESS", "importCount": {"imported": 0, "updated": 1, "ignored": 0, "deleted": 0}, "type": "User", "importConflicts": [
        {"object": "Polak Mark", "value": "Unknown reference to IdentifiableObject{id=0, uid='Qod0uIevoba', code='markpolak', name='null null', created=Wed Nov 26 01:06:18 CET 2014, lastUpdated=Fri Nov 28 08:31:51 CET 2014} (UserCredentials) on object IdentifiableObject{id=0, uid='Qjr59ESpRy5', code='null', name='Polak Mark', created=Wed Nov 26 01:06:18 CET 2014, lastUpdated=Wed Nov 26 14:16:20 CET 2014} (User)."}
    ], "lastImported": "Qjr59ESpRy5"};

    fixtures.userGroupsRoles = {"userCredentials": {"userRoles": [
        {"id": "b2uHwX9YLhu", "name": "Read Only", "created": "2014-02-20T02:47:44.417+0000", "lastUpdated": "2014-11-26T22:41:35.436+0000"},
        {"id": "k7BWFXkG6zt", "name": "Data Entry SI", "created": "2014-02-20T02:49:58.841+0000", "lastUpdated": "2014-11-26T22:41:33.516+0000"}
    ]}, "userGroups": [
        {"id": "YbkldVOJMUl", "name": "Data EA access", "created": "2014-09-29T12:44:02.361+0000", "lastUpdated": "2014-11-26T22:47:50.978+0000", "href": "http://localhost:8080/dhis/api/userGroups/YbkldVOJMUl"},
        {"id": "iSC0IMnwa4n", "name": "OU Rwanda Mechanism 10193 - TRAC Cooperative Agreement", "created": "2014-09-29T12:56:50.366+0000", "lastUpdated": "2014-11-20T11:22:00.781+0000", "href": "http://localhost:8080/dhis/api/userGroups/iSC0IMnwa4n"},
        {"id": "c6hGi8GEZot", "name": "Data SI access", "created": "2014-09-29T12:44:05.359+0000", "lastUpdated": "2014-11-27T09:04:28.371+0000", "href": "http://localhost:8080/dhis/api/userGroups/c6hGi8GEZot"},
        {"id": "Xxel2E26U9j", "name": "OU Rwanda Partner 618 users - Treatment and Research AIDS Center", "created": "2014-09-29T12:56:50.674+0000", "lastUpdated": "2014-11-17T20:07:12.583+0000", "href": "http://localhost:8080/dhis/api/userGroups/Xxel2E26U9j"}
    ]};

    fixtures.dataStreamAccess = [
        {"name": "SI", "userGroups": [
            {"id": "c6hGi8GEZot", "name": "Data SI access"}
        ], "userRoles": [
            {"id": "k7BWFXkG6zt", "name": "Data Entry SI"}
        ], access: true, entry: true},
        {"name": "EA", "userGroups": [
            {"id": "YbkldVOJMUl", "name": "Data EA access"}
        ], "userRoles": [
            {"id": "OKKx4bf4ueV", "name": "Data Entry EA"}
        ], access: true, entry: false},
        {"name": "SIMS", "userGroups": [
            {"id": "iuD8wUFz95X", "name": "Data SIMS access"}
        ], "userRoles": [
            {"id": "iXkZzRKD0i4", "name": "Data Entry SIMS"}
        ], access: false, entry: false}
    ];

    fixtures.organisationUnits = {"organisationUnits":[{"id":"W73PRZcjFIU","created":"2014-09-29T16:51:27.873+0000","name":"Indonesia","lastUpdated":"2014-11-19T19:44:27.619+0000","code":"ID","href":"http://localhost:8080/dhis/api/organisationUnits/W73PRZcjFIU"},{"id":"PqlFzhuPcF1","created":"2014-02-18T06:43:59.199+0000","name":"Nigeria","lastUpdated":"2014-11-19T19:30:37.859+0000","code":"NG","href":"http://localhost:8080/dhis/api/organisationUnits/PqlFzhuPcF1"},{"id":"CZ9ysPg2dSk","created":"2014-09-29T16:47:12.410+0000","name":"China","lastUpdated":"2014-11-19T19:43:55.182+0000","code":"CN","href":"http://localhost:8080/dhis/api/organisationUnits/CZ9ysPg2dSk"},{"id":"cl7jVQOW3Ks","created":"2014-09-29T16:56:35.880+0000","name":"Papua New Guinea","lastUpdated":"2014-11-19T19:44:41.144+0000","code":"PG","href":"http://localhost:8080/dhis/api/organisationUnits/cl7jVQOW3Ks"},{"id":"ANN4YCOufcP","created":"2014-09-29T16:47:53.148+0000","name":"Democratic Republic of the Congo","lastUpdated":"2014-11-20T03:00:24.791+0000","code":"CD","href":"http://localhost:8080/dhis/api/organisationUnits/ANN4YCOufcP"},{"id":"a71G4Gtcttv","created":"2014-02-18T06:44:21.494+0000","name":"Zimbabwe","lastUpdated":"2014-11-20T03:00:51.444+0000","code":"ZW","href":"http://localhost:8080/dhis/api/organisationUnits/a71G4Gtcttv"},{"id":"mdXu6iCbn2G","created":"2014-09-29T16:59:31.687+0000","name":"Tanzania","lastUpdated":"2014-11-20T02:59:57.830+0000","code":"TZ","href":"http://localhost:8080/dhis/api/organisationUnits/mdXu6iCbn2G"},{"id":"y3zhsvdXlhN","created":"2014-09-29T16:49:55.628+0000","name":"Ghana","lastUpdated":"2014-11-19T19:29:23.460+0000","code":"GH","href":"http://localhost:8080/dhis/api/organisationUnits/y3zhsvdXlhN"},{"id":"h11OyvlPxpJ","created":"2014-02-18T06:43:33.680+0000","name":"Mozambique","lastUpdated":"2014-11-19T19:30:09.899+0000","code":"MZ","href":"http://localhost:8080/dhis/api/organisationUnits/h11OyvlPxpJ"},{"id":"V0qMZH29CtN","created":"2014-09-29T16:59:06.478+0000","name":"Swaziland","lastUpdated":"2014-11-21T09:03:34.037+0000","code":"SZ","href":"http://localhost:8080/dhis/api/organisationUnits/V0qMZH29CtN"},{"id":"JTypsdEUNPw","created":"2014-09-29T16:50:36.286+0000","name":"Haiti","lastUpdated":"2014-11-19T19:35:00.887+0000","code":"HT","href":"http://localhost:8080/dhis/api/organisationUnits/JTypsdEUNPw"},{"id":"iD2i0aynOGm","created":"2014-09-29T16:44:28.491+0000","name":"Asia Regional Program","lastUpdated":"2014-11-19T19:42:17.514+0000","code":"AS","href":"http://localhost:8080/dhis/api/organisationUnits/iD2i0aynOGm"},{"id":"XtxUYCsDWrR","created":"2014-02-18T06:43:03.335+0000","name":"Rwanda","lastUpdated":"2014-11-26T22:41:35.298+0000","code":"RW","href":"http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"},{"id":"FFVkaV9Zk1S","created":"2014-02-18T06:43:14.510+0000","name":"Namibia","lastUpdated":"2014-11-19T19:30:27.346+0000","code":"NA","href":"http://localhost:8080/dhis/api/organisationUnits/FFVkaV9Zk1S"},{"id":"IH1kchw86uA","created":"2014-09-29T16:48:36.042+0000","name":"Ethiopia","lastUpdated":"2014-11-20T03:00:19.124+0000","code":"ET","href":"http://localhost:8080/dhis/api/organisationUnits/IH1kchw86uA"},{"id":"ds0ADyc9UCU","created":"2014-09-29T16:47:14.868+0000","name":"Cote d'Ivoire","lastUpdated":"2014-11-19T19:28:45.763+0000","code":"CI","href":"http://localhost:8080/dhis/api/organisationUnits/ds0ADyc9UCU"},{"id":"PeOHqAwdtez","created":"2014-09-29T16:50:18.011+0000","name":"Guyana","lastUpdated":"2014-11-20T03:00:00.811+0000","code":"GY","href":"http://localhost:8080/dhis/api/organisationUnits/PeOHqAwdtez"},{"id":"qllxzIjjurr","created":"2014-09-29T16:52:58.090+0000","name":"Lesotho","lastUpdated":"2014-11-20T03:00:32.122+0000","code":"LS","href":"http://localhost:8080/dhis/api/organisationUnits/qllxzIjjurr"},{"id":"YM6xn5QxNpY","created":"2014-09-11T22:37:26.760+0000","name":"Vietnam","lastUpdated":"2014-11-20T03:00:34.981+0000","code":"VN","href":"http://localhost:8080/dhis/api/organisationUnits/YM6xn5QxNpY"},{"id":"FETQ6OmnsKB","created":"2014-02-18T06:42:55.569+0000","name":"Uganda","lastUpdated":"2014-11-20T14:23:00.372+0000","code":"UG","href":"http://localhost:8080/dhis/api/organisationUnits/FETQ6OmnsKB"},{"id":"NzelIFhEv3C","created":"2014-09-29T16:48:16.405+0000","name":"Dominican Republic","lastUpdated":"2014-11-20T03:00:47.978+0000","code":"DR","href":"http://localhost:8080/dhis/api/organisationUnits/NzelIFhEv3C"},{"id":"Qh4XMQJhbk8","created":"2014-09-29T16:45:28.378+0000","name":"Burundi","lastUpdated":"2014-11-20T02:59:49.576+0000","code":"BI","href":"http://localhost:8080/dhis/api/organisationUnits/Qh4XMQJhbk8"},{"id":"vSu0nPMbq7b","created":"2014-09-29T16:46:32.557+0000","name":"Central America Region","lastUpdated":"2014-11-19T19:34:12.213+0000","code":"CE","href":"http://localhost:8080/dhis/api/organisationUnits/vSu0nPMbq7b"},{"id":"XWZK2nop7pM","created":"2014-09-29T16:45:39.189+0000","name":"Cambodia","lastUpdated":"2014-11-19T19:43:31.512+0000","code":"KH","href":"http://localhost:8080/dhis/api/organisationUnits/XWZK2nop7pM"},{"id":"wChmwjpXOw2","created":"2014-09-29T16:45:23.077+0000","name":"Burma","lastUpdated":"2014-11-19T19:43:07.887+0000","code":"MM","href":"http://localhost:8080/dhis/api/organisationUnits/wChmwjpXOw2"},{"id":"t25400wXrNB","created":"2014-09-29T16:46:55.860+0000","name":"Central Asia Region","lastUpdated":"2014-11-19T19:43:45.823+0000","code":"AC","href":"http://localhost:8080/dhis/api/organisationUnits/t25400wXrNB"},{"id":"ligZVIYs2rL","created":"2014-09-29T17:02:07.138+0000","name":"Ukraine","lastUpdated":"2014-11-19T20:53:40.855+0000","code":"UA","href":"http://localhost:8080/dhis/api/organisationUnits/ligZVIYs2rL"},{"id":"lZsCb6y0KDX","created":"2013-06-10T04:34:22.000+0000","name":"Malawi","lastUpdated":"2014-11-19T19:29:59.290+0000","code":"MW","href":"http://localhost:8080/dhis/api/organisationUnits/lZsCb6y0KDX"},{"id":"l1KFEXKI4Dg","created":"2014-02-18T06:44:11.821+0000","name":"Botswana","lastUpdated":"2014-11-20T03:00:37.815+0000","code":"BW","href":"http://localhost:8080/dhis/api/organisationUnits/l1KFEXKI4Dg"},{"id":"f5RoebaDLMx","created":"2014-02-18T06:43:52.854+0000","name":"Zambia","lastUpdated":"2014-11-19T19:31:45.824+0000","code":"ZM","href":"http://localhost:8080/dhis/api/organisationUnits/f5RoebaDLMx"},{"id":"cDGPF739ZZr","created":"2014-02-18T06:43:08.843+0000","name":"South Africa","lastUpdated":"2014-11-19T19:30:59.557+0000","code":"ZA","href":"http://localhost:8080/dhis/api/organisationUnits/cDGPF739ZZr"},{"id":"bQQJe0cC1eD","created":"2014-09-29T16:45:49.289+0000","name":"Cameroon","lastUpdated":"2014-11-20T02:59:41.480+0000","code":"CM","href":"http://localhost:8080/dhis/api/organisationUnits/bQQJe0cC1eD"},{"id":"HfVjCurKxh2","created":"2013-03-14T05:25:38.231+0000","name":"Kenya","lastUpdated":"2014-11-20T03:00:03.833+0000","code":"KE","href":"http://localhost:8080/dhis/api/organisationUnits/HfVjCurKxh2"},{"id":"XOivy2uDpMF","created":"2014-09-29T16:44:12.521+0000","name":"Angola","lastUpdated":"2014-11-19T19:23:39.554+0000","code":"AO","href":"http://localhost:8080/dhis/api/organisationUnits/XOivy2uDpMF"},{"id":"WLG0z5NxQs8","created":"2014-09-29T16:58:51.573+0000","name":"South Sudan","lastUpdated":"2014-11-19T19:31:09.051+0000","code":"SS","href":"http://localhost:8080/dhis/api/organisationUnits/WLG0z5NxQs8"},{"id":"skj3e4YSiJY","created":"2014-09-29T16:51:08.754+0000","name":"India","lastUpdated":"2014-11-19T19:44:03.744+0000","code":"IN","href":"http://localhost:8080/dhis/api/organisationUnits/skj3e4YSiJY"},{"id":"nBo9Y4yZubB","created":"2014-09-29T16:46:04.353+0000","name":"Caribbean Region","lastUpdated":"2014-11-19T19:34:04.011+0000","code":"CB","href":"http://localhost:8080/dhis/api/organisationUnits/nBo9Y4yZubB"}]};

    fixtures.getAgencies = [{
        id: 'FPUgmtt8HRi',
        code: 'Agency_HHS/CDC',
        name: 'HHS/CDC',
        created: '2014-05-09T23:23:06.953+0000',
        lastUpdated: '2014-10-05T13:07:55.940+0000',
        mechUserGroup: {
            id: 'Stc8jiohyTg',
            name: 'OU Rwanda Agency HHS/CDC all mechanisms'
        },
        userUserGroup: {
            id: 'hjLU7Ug0vKG',
            name: 'OU Rwanda Agency HHS/CDC users'
        },
        userAdminUserGroup: {
            id: 'x47aP9pWYlu',
            name: 'OU Rwanda Agency HHS/CDC user administrators'
        }
    }];

    fixtures.getPartners = [{
        id: 'pBimh5znu2H',
        code: 'Partner_10001',
        name: 'Banana',
        created: '2014-05-28T19:50:31.398+0000',
        lastUpdated: '2014-10-05T13:07:56.182+0000',
        mechUserGroup: {
            id: 'tICoPGZAWNk',
            name: 'OU Kenya Partner 10001 all mechanisms - Banana'
        },
        userUserGroup: {
            id: 'pGh2wzc7bMY',
            name: 'OU Kenya Partner 10001 users - Banana'
        },
        userAdminUserGroup: {
            id: 'UCnkwxHKAAm',
            name: 'OU Kenya Partner 10001 user administrators - Banana'
        }
    }];

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName])
                return angular.copy(fixtures[fixtureName]);
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    }

}(window));
