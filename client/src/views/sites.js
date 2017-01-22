define('views/sites', ['components/region', 'components/navbar', 'services/sites'], function (region, navbar, SitesService) {
    return {
        components: {
            navbar,
            region
        },

        template: `
<div>
    <navbar></navbar>
    <header>Sites:</header>
    <a v-for="site in sites" class="site" :href="'#/site/' + site.id">
        <div class="name">{{site.name}}</div>
        <region :region-id="site.region"></region>
        <div class="staffCount">Staff: {{site.staffCount}}</div>
    </a>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            sites: SitesService.getSitesStream()
        }),

        created () {
        },

        destroyed () {
        }
    };
});
