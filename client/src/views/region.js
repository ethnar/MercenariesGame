define('views/region', [
    'components/navbar', 'services/regions'
], function (navbar, RegionsService) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <div v-if="region">{{region.name}}</div>
</div>
`,
        computed: {
            regionId () {
                return +this.$route.params.regionId; // TODO: shouldn't need to use $route here
            }
        },

        subscriptions () {
            return {
                region: this
                    .stream('regionId')
                    .flatMapLatest(regionId => RegionsService.getRegionStream(regionId))
            }
        },

        created () {
        },

        destroyed () {
        },

        methods: {
        }
    };
});
