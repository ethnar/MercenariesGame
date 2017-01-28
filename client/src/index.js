require(['views/news', 'views/missions', 'views/mission/mission', 'views/sites', 'views/site', 'services/server'],
    function (NewsView, MissionsView, MissionView, SitesView, SiteView, ServerService) {
    Vue.use(VueRx, Rx);

    Vue.prototype.stream = function (prop) {
        return this.$watchAsObservable(prop).pluck('newValue').startWith(this[prop]);
    };

    ServerService.request('authenticate', {
        user: 'test',
        password: 'test'
    }).then(() => {
        const router = new VueRouter({
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
                path: '*',
                redirect: '/news'
            }]
        });

        const app = new Vue({
            router: router
        }).$mount('#app');
    });
});
