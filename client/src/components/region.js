define('components/region', ['services/regions'], function (RegionsService) {
    return {
        name: 'region',
        template: `
<a :href="'#/region/' + regionId">
    {{name}}
</a>
`,
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
        }
    };
});
