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
    <div v-if="region">
        <header>Region:</header>
        <region :region-id="regionId"></region>
        <button @click="useIntel();">Use intel ({{region.intelCost}})</button>
        <tabs>
            <tab header="Sites">
                <div v-for="site in sites">
                    <site :site="site"></site>
                </div>
            </tab>
        </tabs>
    </div>
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
                region: this.stream('regionId')
                    .flatMapLatest(regionId =>
                        RegionsService.getRegionStream(regionId)
                    ),
                sites:
                    this.stream('regionId')
                        .flatMapLatest(regionId =>
                            SitesService
                                .getSitesStream()
                                .map(sites => sites.filter(site => site.region === regionId))
                        )
            }
        },

        created () {
        },

        destroyed () {
        },

        methods: {
            useIntel() {
                RegionsService.investigate(this.region);
            }
        }
    };
});
