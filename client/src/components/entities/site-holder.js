import {SitesService} from '../../services/sites.js'
import './player.js'
import './region.js'

export default Vue.component('site-holder', {
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
<div class="occupied" v-if="site.occupied !== undefined">
    Owner:
    <span v-if="site.organisation">
        <organisation :organisation-id="site.organisation"></organisation>
    </span>
    <span v-if="site.owner">
        <player :player-id="site.owner"></player>
    </span>         
    <span v-if="!site.owner && !site.organisation">
        {{site.occupied ? 'Unknown' : 'None' }}
    </span>
</div>
`,
});
