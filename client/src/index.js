require(['views/news', 'services/server'], function (NewsView, ServerService) {
    Vue.use(VueRx, Rx);

    ServerService.request('authenticate', {
        user: 'ethnar',
        password: 'abc'
    }).then(() => {
        const router = new VueRouter({
            routes: [{
                path: '/news',
                component: NewsView
            }]
        });

        const app = new Vue({
            router: router
        }).$mount('#app');
    });
});
