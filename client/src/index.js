require(['views/news', 'views/missions', 'views/sites', 'services/server'], function (NewsView, MissionsView, SitesView, ServerService) {
    Vue.use(VueRx, Rx);

    ServerService.request('authenticate', {
        user: 'ethnar',
        password: 'abc'
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
            }]
        });

        const app = new Vue({
            router: router
        }).$mount('#app');
    });
});
