import {PlayerService} from '../../services/player.js'

export default Vue.component('player', {
    props: [
        'playerId',
    ],

    subscriptions() {
        return {
            player: this
                .stream('playerId')
                .switchMap(playerId => PlayerService.getPlayerStream(playerId)),
        }
    },

    template: `
<span v-if="player">
    {{player}}
</span>
`,
});
