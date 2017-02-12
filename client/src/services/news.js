define('services/news', ['services/server'], function (ServerService) {

    return {
        getNewsStream () {
            return ServerService
                .getListStream('news')
                .map(news => news.slice().reverse());
        },

        getRelatedStream (type, id) {
            return this
                .getNewsStream()
                .map(news => {
                    return this.filterRelevant(news, type, id)
                });
        },

        filterRelevant (news, type, id) {
            return news.filter(item => item.match('\{' + type + ':' + id + ':' + '[^}]+' + '\}'))
        }
    };

});