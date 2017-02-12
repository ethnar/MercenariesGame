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
    <div v-for="site in sites">
        <site :site="site"/>
    </div>
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
