define('views/site', [
    'components/navbar', 'components/region', 'components/tabs/tabs', 'services/sites'
], function (navbar, region, tabs, SitesService) {
    return {
        components: {
            navbar,
            region,
            tabs
        },

        template: `
<div>
    <navbar></navbar>
    <header>Site:</header>
    <div v-if="site">
        <div class="name">{{site.name}}</div>
        <region :regionId="site.region"></region>
        <tabs>
            <tab header="Staff">List of staff</tab>
            <tab header="Equipment">List of installed equipment</tab>
            <tab header="Inventory">Inventory list</tab>
        </tabs>
    </div>
</div>
`,
        data: () => ({
        }),

        computed: {
            siteId () {
                return +this.$route.params.siteId; // TODO: raise Vue-router ticket
            }
        },

        subscriptions () {
            return {
                site: this.$watchAsObservable('siteId').startWith(this.siteId).flatMapLatest(siteId => {
                    return SitesService.getSitesStream().map(sites => {
                        return sites.find(site => site.id === siteId);
                    });
                })
            }
        },

        created () {
        },

        destroyed () {
        }
    };
});
