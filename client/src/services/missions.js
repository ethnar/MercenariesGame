define('services/missions', ['services/server'], function (ServerService) {

    return {
        getKnownMissionsStream () {
            return ServerService.getListStream('known-missions');
        },

        getCurrentMissionsStream () {
            return ServerService.getListStream('current-missions');
        },

        getKnownMissionStream (missionId) {
            return this
                .getKnownMissionsStream()
                .map(missions => missions.find(mission => mission.id === missionId));
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