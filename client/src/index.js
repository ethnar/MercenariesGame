require([
    'services/server',
    'views/news', 'views/missions', 'views/mission/mission', 'views/sites', 'views/site', 'views/region'
], function (
    ServerService,
    NewsView, MissionsView, MissionView, SitesView, SiteView, RegionView
) {
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
                path: '/news',
                component: NewsView
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
                redirect: '/news'
            }]
        });

        const app = new Vue({
            router: window.router
        }).$mount('#app');
    });
});
