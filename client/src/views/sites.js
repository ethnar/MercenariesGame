import {SitesService} from '../services/sites.js'
import '../components/common/navbar.js'
import '../components/entities/site.js'
import '../components/entities/region.js'

export const SitesView = {
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
};
