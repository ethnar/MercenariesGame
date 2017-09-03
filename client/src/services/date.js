import {ServerService} from '../services/server.js'

let dateStream;

export const DateService = {
    getDateStream () {
        if (!dateStream) {
            dateStream = new Rx.ReplaySubject(1);
            ServerService.onUpdate('date', (data) => {
                dateStream.next(data);
            });
            ServerService.request('date').then((data) => {
                dateStream.next(data);
            });
        }
        return dateStream;
    }
};
