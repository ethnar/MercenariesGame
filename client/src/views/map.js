define('views/map', [
    'services/regions',
    'components/navbar/navbar',
], (RegionService) => ({
    data: () => ({
    }),

    subscriptions: () => ({
        regions: RegionService.getRegionsStream()
    }),

    created () {
    },

    template: `
<div>
    <navbar></navbar>
    <div v-for="region in regions">
        <a :href="'#/region/' + region.id">{{region.name}}</a>
    </div>
</div>
`,
}));
