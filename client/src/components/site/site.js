define('components/site/site', ['components/region', 'services/sites'], function (region, SitesService) {
    return {
        components: {
            region
        },

        template: `
<div>
    <div class="name">{{site.name}}</div>
    <region :region-id="site.region"></region>
    <div class="staffCount">Staff: {{site.staffCount}}</div>
</div>
`,
        props: [
            'siteId'
        ],

        subscriptions () {
            return {
                site: this.stream('siteId').flatMapLatest(siteId => SitesService.getSiteStream(siteId))
            }
        },

        created () {
        },

        destroyed () {
        }
    };
});
