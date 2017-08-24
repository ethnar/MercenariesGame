define('services/missions', ['services/server'], function (ServerService) {

    return {
        getCurrentMissionsStream () {
            return ServerService.getListStream('current-missions');
        },

        startMission (missionId, siteId, staffIds) {
            return ServerService.request('startMission', {
                mission: missionId,
                site: siteId,
                staffList: staffIds
            });
        }
    };

});