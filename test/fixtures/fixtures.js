(function () {
    var fixtures = {};

    fixtures.agenciesList = {"items": [
        {"name": "HHS/CDC", "created": "2014-05-09T23:23:06.953+0000", "lastUpdated": "2014-10-05T13:07:55.940+0000", "id": "FPUgmtt8HRi"},
        {"name": "U.S. Peace Corps", "created": "2014-05-09T23:23:07.533+0000", "lastUpdated": "2014-10-05T13:07:55.979+0000", "id": "m4mzzwVQOUi"},
        {"name": "USAID", "created": "2014-05-09T23:23:07.254+0000", "lastUpdated": "2014-10-05T13:07:55.952+0000", "id": "NLV6dy7BE2O"},

    ]};

    fixtures.partnerList = {"items": [
        {
            name: "Apple",
            created: "2014-05-28T19:50:31.075+0000",
            lastUpdated: "2014-10-05T13:07:56.175+0000",
            id: "Cs2c30KKxg6"
        },
        {
            name: "Banana",
            created: "2014-05-28T19:50:31.398+0000",
            lastUpdated: "2014-10-05T13:07:56.182+0000",
            id: "pBimh5znu2H"
        },
        {
            name: "Cranberry",
            created: "2014-05-28T19:50:31.576+0000",
            lastUpdated: "2014-10-05T13:07:56.178+0000",
            id: "e9F2oANoK6F"
        },
        {
            name: "Dragon Fruit",
            created: "2014-05-28T19:50:31.967+0000",
            lastUpdated: "2014-10-05T13:07:56.171+0000",
            id: "xQ0xjBfQzI8"
        }
    ]};

    fixtures.actionsList = [
        {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
        {name: 'Capture inter-agency data', userRole: '', typeDependent: true},
        {name: 'Accept data', userRole: 'Data Accepter'},
        {name: 'Submit data', userRole: 'Data Submitter'},
        {name: 'Manage users', userRole: 'User Administrator'},
        {name: 'Read data', userRole: 'Read Only', default: true}
    ];

    fixtures.actionsListWithRoles = [
        {name: 'Capture data', userRole: 'Data Entry {{dataStream}}', typeDependent: true},
        {name: 'Capture inter-agency data', userRole: '', typeDependent: true},
        {name: 'Accept data', userRole: 'Data Accepter', userRoleId: 'QbxXEPw9xlf'},
        {name: 'Submit data', userRole: 'Data Submitter', userRoleId: 'n777lf1THwQ'},
        {name: 'Manage users', userRole: 'User Administrator', userRoleId: 'KagqnetfxMr'},
        {name: 'Read data', userRole: 'Read Only', userRoleId: 'b2uHwX9YLhu', default: true}
    ];

    fixtures.locales = ["ar", "ar_IQ", "ar_SD", "bn", "bi", "my", "zh", "dz", "en", "fr", "in", "km", "rw", "lo", "ne", "pt", "pt_BR", "ru", "es", "tg", "vi"];

    fixtures.userGroups = {"userGroups":[{"id":"YbkldVOJMUl","name":"Data EA access"},{"id":"c6hGi8GEZot","name":"Data SI access"},{"id":"iuD8wUFz95X","name":"Data SIMS access"},{"id":"S6qRafboIIu","name":"Global EA data"},{"id":"XRHKxqIpQ0T","name":"Global Metadata Administrators"},{"id":"l6fLS0atWsv","name":"Global SI data"},{"id":"bP89c2kQQsF","name":"Global SIMS data"},{"id":"ofT4kgxt4h9","name":"OU Ghana Mechanism 16638 - GAC Data Quality Assessment"},{"id":"hFlYeFQLe3O","name":"OU South Africa Mechanism 14847 - PIMS Database"},{"id":"zBucNG6udcd","name":"OU Tanzania Mechanism 12728 - Data warehouse"},{"id":"pbn1BRzeG9w","name":"OU Uganda Mechanism 10281 - Technical Assistance for Data Use/M&E Systems Strenghtening for Implementing Partners"},{"id":"E49I572Cws3","name":"OU Zambia Mechanism 16833 - TBD - Nursing Continuing Education Database"},{"id":"wxguOZ0rZYH","name":"OU Zimbabwe Mechanism 12893 - Building Health Data Dissemination and Information Use Systems"}]};

    fixtures.userRoles = {"userRoles":[{"id":"OKKx4bf4ueV","name":"Data Entry EA"},{"id":"k7BWFXkG6zt","name":"Data Entry SI"},{"id":"iXkZzRKD0i4","name":"Data Entry SIMS"}]};

    fixtures.userRolesForActions = {"userRoles":[{"id":"QbxXEPw9xlf","name":"Data Accepter"},{"id":"n777lf1THwQ","name":"Data Submitter"},{"id":"b2uHwX9YLhu","name":"Read Only"},{"id":"KagqnetfxMr","name":"User Administrator"}]};

    fixtures.currentUser = {"name":"kp1001ea Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism","created":"2014-09-12T13:16:38.843+0000","lastUpdated":"2014-11-20T11:06:25.617+0000","surname":"Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism","firstName":"kp1001ea","userCredentials":{"code":"kp1001ea","name":"kp1001ea Kenya partner access to mechanism 1001 EA data Banana USAID Mechanism","created":"2014-09-12T13:16:38.843+0000","lastUpdated":"2014-11-20T11:26:48.495+0000","username":"kp1001ea","passwordLastUpdated":"2014-11-20T11:06:25.617+0000","userAuthorityGroups":[{"name":"Read Only","created":"2014-02-20T02:47:44.417+0000","lastUpdated":"2014-10-20T13:39:20.109+0000","id":"b2uHwX9YLhu"},{"name":"Data Entry EA","created":"2014-09-13T21:11:15.686+0000","lastUpdated":"2014-10-20T13:39:20.120+0000","id":"OKKx4bf4ueV"}],"catDimensionConstraints":[{"name":"Funding Mechanism","created":"2014-02-18T07:51:04.612+0000","lastUpdated":"2014-10-16T12:18:02.751+0000","id":"SH885jaRe0o"}],"lastLogin":"2014-11-20T11:06:25.756+0000","selfRegistered":false,"disabled":false,"id":"fpYv7pe4Kbh"},
        "groups":[
            {"name":"OU Kenya Mechanism 1001 - Banana USAID Mechanism","created":"2014-09-29T13:08:16.040+0000","lastUpdated":"2014-10-16T16:47:55.750+0000","id":"UUejaqD9UNe"},
            {"name":"OU Kenya Partner 10001 users - Banana","created":"2014-09-29T13:08:16.357+0000","lastUpdated":"2014-10-18T12:52:38.664+0000","id":"pGh2wzc7bMY"}
        ],"organisationUnits":[{"code":"ke","name":"Kenya","created":"2013-03-14T01:25:38.231+0000","lastUpdated":"2014-10-20T19:17:09.897+0000","id":"HfVjCurKxh2"}],"dataViewOrganisationUnits":[{"code":"ke","name":"Kenya","created":"2013-03-14T01:25:38.231+0000","lastUpdated":"2014-10-20T19:17:09.897+0000","id":"HfVjCurKxh2"}],"id":"BukIlLTCbz9"};

    fixtures.currentUserAuthorities = ["F_DATAVALUE_DELETE","M_dhis-web-sms","M_dhis-web-reporting","M_dhis-web-light","F_DATAVALUE_ADD","M_dhis-web-maintenance-datadictionary","F_INDICATOR_PRIVATE_ADD","F_REPORT_PUBLIC_ADD","M_dhis-web-mapping","M_dhis-web-validationrule","M_dhis-web-pivot","F_RUN_VALIDATION","M_dhis-web-dashboard-integration","F_DOCUMENT_PRIVATE_ADD","M_dhis-web-importexport","F_VALIDATIONRULE_ADD","M_dhis-web-caseentry","M_dhis-web-visualizer","M_dhis-web-mobile"];

    fixtures.rwandaUserGroup = {"userGroups":[{"id":"k6IKG8UtvJQ","name":"OU Rwanda Agency DOD all mechanisms"},{"id":"yi4l7yIWRQM","name":"OU Rwanda Agency DOD user administrators"},{"id":"f8uYL2O1IFH","name":"OU Rwanda Agency DOD users"},{"id":"Stc8jiohyTg","name":"OU Rwanda Agency HHS/CDC all mechanisms"},{"id":"x47aP9pWYlu","name":"OU Rwanda Agency HHS/CDC user administrators"},{"id":"hjLU7Ug0vKG","name":"OU Rwanda Agency HHS/CDC users"},{"id":"wIY2oMvmLmk","name":"OU Rwanda Agency PC all mechanisms"},{"id":"OjIScdFujry","name":"OU Rwanda Agency PC user administrators"},{"id":"WMAyDS3iOIa","name":"OU Rwanda Agency PC users"},{"id":"HlttAyxuL82","name":"OU Rwanda Agency State/PRM all mechanisms"},{"id":"R048ZoOnLxr","name":"OU Rwanda Agency State/PRM user administrators"},{"id":"BPupZKeCY01","name":"OU Rwanda Agency State/PRM users"},{"id":"FzwHJqJ81DO","name":"OU Rwanda Agency USAID all mechanisms"},{"id":"J19zR2dMaWa","name":"OU Rwanda Agency USAID user administrators"},{"id":"s7jeIAC1Psa","name":"OU Rwanda Agency USAID users"}]};
    fixtures.rwandaUserGroupWithoutUSAIDUserGroup = {"userGroups":[{"id":"k6IKG8UtvJQ","name":"OU Rwanda Agency DOD all mechanisms"},{"id":"yi4l7yIWRQM","name":"OU Rwanda Agency DOD user administrators"},{"id":"f8uYL2O1IFH","name":"OU Rwanda Agency DOD users"},{"id":"Stc8jiohyTg","name":"OU Rwanda Agency HHS/CDC all mechanisms"},{"id":"x47aP9pWYlu","name":"OU Rwanda Agency HHS/CDC user administrators"},{"id":"hjLU7Ug0vKG","name":"OU Rwanda Agency HHS/CDC users"},{"id":"wIY2oMvmLmk","name":"OU Rwanda Agency PC all mechanisms"},{"id":"OjIScdFujry","name":"OU Rwanda Agency PC user administrators"},{"id":"WMAyDS3iOIa","name":"OU Rwanda Agency PC users"},{"id":"HlttAyxuL82","name":"OU Rwanda Agency State/PRM all mechanisms"},{"id":"R048ZoOnLxr","name":"OU Rwanda Agency State/PRM user administrators"},{"id":"BPupZKeCY01","name":"OU Rwanda Agency State/PRM users"},{"id":"FzwHJqJ81DO","name":"OU Rwanda Agency USAID all mechanisms"},{"id":"J19zR2dMaWa","name":"OU Rwanda Agency USAID user administrators"}]};
    fixtures.rwandaUserGroupWithoutUSAIDAdminUserGroup = {"userGroups":[{"id":"k6IKG8UtvJQ","name":"OU Rwanda Agency DOD all mechanisms"},{"id":"yi4l7yIWRQM","name":"OU Rwanda Agency DOD user administrators"},{"id":"f8uYL2O1IFH","name":"OU Rwanda Agency DOD users"},{"id":"Stc8jiohyTg","name":"OU Rwanda Agency HHS/CDC all mechanisms"},{"id":"x47aP9pWYlu","name":"OU Rwanda Agency HHS/CDC user administrators"},{"id":"hjLU7Ug0vKG","name":"OU Rwanda Agency HHS/CDC users"},{"id":"wIY2oMvmLmk","name":"OU Rwanda Agency PC all mechanisms"},{"id":"OjIScdFujry","name":"OU Rwanda Agency PC user administrators"},{"id":"WMAyDS3iOIa","name":"OU Rwanda Agency PC users"},{"id":"HlttAyxuL82","name":"OU Rwanda Agency State/PRM all mechanisms"},{"id":"R048ZoOnLxr","name":"OU Rwanda Agency State/PRM user administrators"},{"id":"BPupZKeCY01","name":"OU Rwanda Agency State/PRM users"},{"id":"FzwHJqJ81DO","name":"OU Rwanda Agency USAID all mechanisms"},{"id":"s7jeIAC1Psa","name":"OU Rwanda Agency USAID users"}]};
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

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName])
                return angular.copy(fixtures[fixtureName]);
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    }

}(window));
