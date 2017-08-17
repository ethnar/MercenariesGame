require(['views/login', 'views/map', 'views/missions', 'views/mission/mission', 'views/sites', 'views/site', 'views/region', 'services/server'],
    function (LoginView, MapView, MissionsView, MissionView, SitesView, SiteView, RegionView, ServerService) {
    Vue.use(VueRx, Rx);

    Vue.prototype.stream = function (prop) {
        return this.$watchAsObservable(prop).pluck('newValue').startWith(this[prop]);
    };

    window.router = new VueRouter({
        routes: [{
            path: '/login',
            component: LoginView
        }, {
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
