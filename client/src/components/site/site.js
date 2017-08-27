define('components/site/site', [
    'services/sites',
    'components/region',
], (SitesService) => Vue.component('site', {
    props: [
        'siteId'
    ],

    subscriptions () {
        return {
            site: this.stream('siteId')
                .flatMapLatest(siteId => SitesService.getSiteStream(siteId)),
        }
    },

    created () {
    },

    destroyed () {
    },

    template: `
<div class="component-site" v-if="site">
    <a :href="'#/site/' + site.id" class="link">
        View
    </a>
    <div class="name">{{site.name}}</div>
    <region :region-id="site.region"></region>
</div>
`,
}));
