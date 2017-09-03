import {PoliticiansService} from '../../services/politicians.js'

export default Vue.component('politician', {
    props: [
        'politicianId',
    ],

    subscriptions() {
        return {
            politician: this
                .stream('politicianId')
                .switchMap(politicianId => PoliticiansService.getPoliticianStream(politicianId)),
        }
    },

    template: `
<span v-if="politician">
    {{politician.name}}
</span>
`,
});
