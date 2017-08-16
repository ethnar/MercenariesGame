define('views/map', ['services/regions', 'components/navbar'], function (RegionService, navbar) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <div v-for="region in regions">
        <a :href="'#/region/' + region.id">{{region.name}}</a>
    </div>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            regions: RegionService.getRegionsStream()
        }),

        created () {
        }
    };
});
