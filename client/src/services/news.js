define('services/news', ['services/server'], function (ServerService) {

    return {
        getNewsStream () {
            return ServerService.getListStream('news');
        }
    };

});