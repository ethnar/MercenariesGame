define('components/politician/politician', [
    'services/politicians',
], (PoliticianService) => Vue.component('politician', {
    props: [
        'politicianId',
    ],

    subscriptions() {
        return {
            politician: this
                .stream('politicianId')
                .flatMapLatest(politicianId => PoliticianService.getPoliticianStream(politicianId)),
        }
    },

    template: `
<span v-if="politician">
    {{politician.name}}
</span>
`,
}));
