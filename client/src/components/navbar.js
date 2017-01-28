define('components/navbar', ['services/player'], function (PlayerService) {
    return {
        name: 'navbar',
        template: `
<div class="navbar">
    <div>
        <a href="#/news">News</a>
        <a href="#/missions">Missions</a>
        <a href="#/sites">Sites</a>
    </div>
    <div class="funds">
        {{funds}}
    </div>
</div>
`,
        subscriptions: () => ({
            funds: PlayerService.getFundsStream()
        })
    };
});
