define('views/news', ['services/news', 'components/navbar'], function (NewsService, navbar) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <header>Recent news:</header>
    <div v-for="item in news">{{item}}</div>
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
