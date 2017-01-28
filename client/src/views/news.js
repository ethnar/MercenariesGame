define('views/news', ['services/news', 'components/navbar', 'components/info/info'], function (NewsService, navbar, info) {
    return {
        components: {
            navbar,
            info
        },

        template: `
<div>
    <navbar></navbar>
    <header>Recent news:</header>
    <info v-for="item in news" :message="item">{{item}}</info>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            news: NewsService.getNewsStream()
        }),

        created () {
        }
    };
});
