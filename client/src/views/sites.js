define('views/sites', ['components/region', 'components/site/site', 'components/navbar', 'services/sites'], function (region, site, navbar, SitesService) {
    return {
        components: {
            site,
            navbar,
            region
        },

        template: `
<div>
    <navbar></navbar>
    <header>Sites:</header>
    <a v-for="site in sites" class="site" :href="'#/site/' + site.id">
        <site :site="site"/>
    </a>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            sites: SitesService.getOwnSitesStream()
        }),

        created () {
        },

        destroyed () {
        }
    };
});
