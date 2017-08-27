define('services/politicians', ['services/server'], function (ServerService) {
    return {
        getPoliticianStream (politicianId) {
            return ServerService.getStream('Politician', politicianId);
        },
    };
});
