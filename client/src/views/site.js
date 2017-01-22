define('views/site', ['components/navbar', 'components/region', 'services/sites'], function (navbar, region, SitesService) {
    return {
        components: {
            navbar,
            region
        },

        template: `
<div>
    <navbar></navbar>
    <header>Site:</header>
    <div v-if="site">
        <div class="name">{{site.name}}</div>
        <region :regionId="site.region"></region>
        <div class="staffCount">Staff: {{site.staffCount}}</div>
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
