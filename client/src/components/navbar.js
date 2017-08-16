define('components/navbar', ['services/player'], function (PlayerService) {
    return {
        name: 'navbar',
        template: `
<div class="navbar">
    <div>
        <a href="#/map">Map</a>
        <a href="#/missions">Missions</a>
        <a href="#/sites">Sites</a>
    </div>
    <div class="funds">
        {{funds}}
    </div>
    <div class="intel">
        {{intel}}
    </div>
</div>
`,
        subscriptions: () => ({
            funds: PlayerService.getFundsStream(),
            intel: PlayerService.getIntelStream()
        })
    };
});
