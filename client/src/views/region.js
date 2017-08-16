define('views/region', [
    'components/navbar', 'components/region', 'components/tabs/tabs', 'components/site/site', 'components/info/info',
    'services/regions', 'services/sites'
], function (navbar, region, tabs, site, info,
             RegionsService, SitesService) {
    return {
        components: {
            navbar,
            region,
            tabs,
            site,
            info
        },

        template: `
<div>
    <navbar></navbar>
    <header>Region:</header>
    <region :region-id="regionId"></region>
    <tabs>
        <tab header="Available Sites">
            <div v-for="site in availableSites">
                <site :site="site"></site>
            </div>
        </tab>
    </tabs>
</div>
`,
        data: () => ({
        }),

        computed: {
            regionId () {
                return +this.$route.params.regionId; // TODO: raise Vue-router ticket
            }
        },

        subscriptions () {
            return {
                availableSites:
                    this.stream('regionId')
                        .flatMapLatest(regionId =>
                            SitesService
                                .getAvailableSitesStream()
                                .map(sites => sites.filter(site => site.region === regionId))
                        )
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
