define('components/site/site', ['components/region', 'services/sites'], function (region, SitesService) {
    return {
        components: {
            region
        },

        template: `
<div class="component-site">
    <a :href="'#/site/' + site.id">
        <div class="name">{{site.name}}</div>
        <region :region-id="site.region"></region>
        <div class="staffCount">Staff: {{site.staffCount}}</div>
    </a>
</div>
`,
        props: [
            'site'
        ],

        subscriptions () {
        },

        created () {
        },

        destroyed () {
        }
    };
});
