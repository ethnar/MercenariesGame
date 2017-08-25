define('services/missions', ['services/server'], function (ServerService) {

    return {
        getRegionMissionsStream (regionId) {
            return ServerService.getListStream('Mission', { 'assignee': null, 'region': regionId });
        },

        getCurrentMissionsStream () {
            return ServerService.getListStream('Mission', { 'assignee': ServerService.getPlayerId()});
        },

        reserveMission(missionId) {
            return ServerService.request('reserve-mission', {
                mission: missionId,
            });
        },

        startMission (missionId, siteId, staffIds) {
            return ServerService.request('start-mission', {
                mission: missionId,
                site: siteId,
                staffList: staffIds
            });
        }
    };

});