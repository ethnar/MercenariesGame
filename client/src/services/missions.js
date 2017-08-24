define('services/missions', ['services/server'], function (ServerService) {

    return {
        getCurrentMissionsStream () {
            return ServerService.getListStream('Mission', { 'assignee': ServerService.getPlayerId()});
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