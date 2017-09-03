import {RegionsService} from '../../services/regions.js'
import '../common/navbar.js'

export const MapView = {
    data: () => ({
    }),

    subscriptions: () => ({
        regions: RegionsService.getRegionsStream()
    }),

    created () {
    },

    template: `
<div>
    <navbar></navbar>
    <div v-for="region in regions">
        <a :href="'#/region/' + region.id">{{region.name}}</a>
    </div>
</div>
`,
};
