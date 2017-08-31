import {ServerService} from '../services/server.js'

export const MissionsService = {
    getRegionMissionsStream (regionId) {
        return ServerService.getListStream('Mission', { 'assignee': [null, ServerService.getPlayerId()], 'region': regionId });
    },

    getMissionStream (missionId) {
        return ServerService.getStream('Mission', missionId);
    },

    getCurrentMissionsStream () {
        return ServerService.getListStream('Mission', { 'assignee': ServerService.getPlayerId(), finished: false });
    },

    getFinishedMissionsStream () {
        return ServerService.getListStream('Mission', { 'assignee': ServerService.getPlayerId(), finished: true });
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
