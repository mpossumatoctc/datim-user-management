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
        {name: 'Capture data', userGroup: '', typeDependent: true},
        {name: 'Capture inter-agency data', userGroup: '', typeDependent: true},
        {name: 'Accept data', userGroup: 'Data accepter'},
        {name: 'Submit data', userGroup: 'Data submitter'},
        {name: 'Manage users', userGroup: 'User administrator'},
        {name: 'Read data', userGroup: 'Data reader', default: true}
    ];

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName])
                return angular.copy(fixtures[fixtureName]);
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    }

}(window));
