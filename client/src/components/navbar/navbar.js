define('components/navbar/navbar', ['services/player'], function (PlayerService) {
    return {
        name: 'navbar',
        template: `
<div class="navbar">
    <div class="nav">
        <a href="#/map">Map</a>
        <a href="#/missions">Missions</a>
        <a href="#/sites">Sites</a>
    </div>
    <div class="currency funds" v-if="funds">
        <span class="current">{{formatNumber(funds.value)}} $</span>
        <div class="extra">
            <span class="cap">&nbsp;</span>
            <span class="delta">{{formatDelta(funds.delta)}} $</span>
        </div>
    </div>
    <div class="currency intel" v-if="intel">
        <span class="current">
            {{formatNumber(intel.value)}} 
        </span>
        <div class="extra">
            <span class="cap">/ {{formatNumber(intel.cap)}}</span>
            <span class="delta">{{formatDelta(intel.delta)}}</span>
        </div>
    </div>
</div>
`,
        subscriptions: () => ({
            funds: PlayerService.getFundsStream(),
            intel: PlayerService.getIntelStream()
        }),

        methods: {
            formatDelta(number) {
                return (number >= 0 ? '+' : '-') + this.formatNumber(number);
            },
            formatNumber: number => {
                number = String(number);
                const ticks = Math.floor((number.length - 1) / 3);
                for (let i = 0; i < ticks; i++) {
                    number = number.replace(/([0-9]{3}($|'))/, '\'$1');
                }
                return number;
            }
        }
    };
});
