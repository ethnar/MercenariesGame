define('components/region', [
    'services/regions'
], (RegionsService) => Vue.component('region', {
    props: [
        'regionId'
    ],

    subscriptions () {
        return {
            name: this
                .stream('regionId')
                .flatMapLatest(regionId => RegionsService.getRegionStream(regionId))
                .map(region => region && region.name)
        }
    },

    created () {
    },

    template: `
<a :href="'#/region/' + regionId">
    {{name}}
</a>
`,
}));
