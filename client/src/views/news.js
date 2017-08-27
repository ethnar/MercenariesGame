define('views/news', [
    'services/news',
    'components/navbar/navbar',
    'components/info/info'
], (NewsService) => ({
    data: () => ({
    }),

    subscriptions: () => ({
        news: NewsService.getNewsStream()
    }),

    created () {
    },

    template: `
<div>
    <navbar></navbar>
    <header>Recent news:</header>
    <info v-for="item in news" :message="item">{{item}}</info>
</div>
`,
}));
