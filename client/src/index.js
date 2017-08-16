require(['views/map', 'views/missions', 'views/mission/mission', 'views/sites', 'views/site', 'views/region', 'services/server'],
    function (MapView, MissionsView, MissionView, SitesView, SiteView, RegionView, ServerService) {
    Vue.use(VueRx, Rx);

    Vue.prototype.stream = function (prop) {
        return this.$watchAsObservable(prop).pluck('newValue').startWith(this[prop]);
    };

    ServerService.request('authenticate', {
        user: 'test',
        password: 'test'
    }).then(() => {
        window.router = new VueRouter({
            routes: [{
                path: '/map',
                component: MapView
            }, {
                path: '/missions',
                component: MissionsView
            }, {
                path: '/mission/:missionId',
                component: MissionView
            }, {
                path: '/sites',
                component: SitesView
            }, {
                path: '/site/:siteId',
                component: SiteView
            }, {
                path: '/region/:regionId',
                component: RegionView
            }, {
                path: '*',
                redirect: '/map'
            }]
        });

        const app = new Vue({
            router: window.router
        }).$mount('#app');
    });
});
