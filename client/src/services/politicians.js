import {ServerService} from '../services/server.js'

export const PoliticiansService = {
    getPoliticianStream (politicianId) {
        return ServerService.getStream('Politician', politicianId);
    },
};
