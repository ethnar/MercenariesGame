define('services/staff', ['services/server'], function (ServerService) {

    return {
        getStaffStream () {
            return ServerService.getListStream('staff');
        }
    };

});