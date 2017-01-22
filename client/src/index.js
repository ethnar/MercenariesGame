require(['views/news', 'views/missions', 'views/sites', 'views/site', 'services/server'], function (NewsView, MissionsView, SitesView, SiteView, ServerService) {
    Vue.use(VueRx, Rx);

    Vue.prototype.stream = function (prop) {
        return this.$watchAsObservable(prop).startWith(this[prop]);
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
