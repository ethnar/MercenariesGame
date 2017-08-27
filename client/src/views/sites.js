define('views/sites', [
    'services/sites',
    'components/region',
    'components/site/site',
    'components/navbar/navbar',
], (SitesService) => ({
    data: () => ({
    }),

    subscriptions: () => ({
        sites: SitesService.getOwnSitesStream()
    }),

    created () {
    },

    destroyed () {
    },

    template: `
<div>
    <navbar></navbar>
    <header>Sites:</header>
    <div v-for="site in sites">
        <site :site-id="site.id"/>
    </div>
</div>
`,
}));
