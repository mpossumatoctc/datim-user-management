(function () {
    var fixtures = {};

    fixtures.agenciesList = {"items": [
        {"name": "HHS/CDC", "created": "2014-05-09T23:23:06.953+0000", "lastUpdated": "2014-10-05T13:07:55.940+0000", "id": "FPUgmtt8HRi"},
        {"name": "U.S. Peace Corps", "created": "2014-05-09T23:23:07.533+0000", "lastUpdated": "2014-10-05T13:07:55.979+0000", "id": "m4mzzwVQOUi"},
        {"name": "USAID", "created": "2014-05-09T23:23:07.254+0000", "lastUpdated": "2014-10-05T13:07:55.952+0000", "id": "NLV6dy7BE2O"},

    ]};

    fixtures.partnerList = {"items": [
        {"name": "Abt Associates", "created": "2014-05-09T23:23:08.834+0000", "lastUpdated": "2014-10-05T13:07:56.049+0000", "id": "JkisvjF4ahe"},
        {"name": "African Evangelistic Enterprise", "created": "2014-05-09T23:23:11.387+0000", "lastUpdated": "2014-10-05T13:07:56.195+0000", "id": "z4WtTPPjD7i"},
        {"name": "World Learning", "created": "2014-05-09T23:23:10.013+0000", "lastUpdated": "2014-10-05T13:07:56.229+0000", "id": "sDFvhYDa4sX"}
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


    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName])
                return angular.copy(fixtures[fixtureName]);
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    }

}(window));
