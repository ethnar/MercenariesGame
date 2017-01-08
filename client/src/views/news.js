define('views/news', ['services/news'], function (NewsService) {
    return {
        template: `
<div>
    <header>Recent news:</header>
    <div v-for="item in news">{{item}}</div>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            news: NewsService.getNewsStream().scan((acc, item) => acc.concat([item]), [])
        }),

        created () {
        }
    };
});
