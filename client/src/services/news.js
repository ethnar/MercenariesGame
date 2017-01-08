define('services/news', ['services/server'], function (ServerService) {

    return {
        getNewsStream () {
            const newsStream = new Rx.ReplaySubject();
            ServerService.request('news').then(items => {
                items.forEach(item => newsStream.onNext(item));
            });
            ServerService.onUpdate('news', item => newsStream.onNext(item));
            return newsStream;
        }
    };

});