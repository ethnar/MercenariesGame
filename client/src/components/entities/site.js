import {SitesService} from '../../services/sites.js'
import './site-holder.js'
import './region.js'

export default Vue.component('site', {
    props: [
        'siteId'
    ],

    subscriptions () {
        return {
            site: this.stream('siteId')
                .switchMap(siteId => SitesService.getSiteStream(siteId)),
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
    <site-holder :siteId="site.id"></site-holder>
    <region :region-id="site.region"></region>
</div>
`,
});
