import {ServerService} from '../services/server.js'

let dateStream;

export const DateService = {
    getDateStream () {
        if (!dateStream) {
            dateStream = new Rx.ReplaySubject(1);
            ServerService.onUpdate('date', (data) => {
                dateStream.onNext(data);
            });
            ServerService.request('date').then((data) => {
                dateStream.onNext(data);
            });
        }
        return dateStream;
    }
};
