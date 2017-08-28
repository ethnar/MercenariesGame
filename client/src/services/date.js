define('services/date', ['services/server'], function (ServerService) {
    let dateStream;

    return {
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
});
