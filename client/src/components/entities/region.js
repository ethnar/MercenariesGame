import {RegionsService} from '../../services/regions.js'

export default Vue.component('region', {
    props: [
        'regionId'
    ],

    subscriptions () {
        return {
            name: this
                .stream('regionId')
                .flatMapLatest(regionId => RegionsService.getRegionStream(regionId))
                .map(region => region && region.name)
        }
    },

    created () {
    },

    template: `
<a :href="'#/region/' + regionId">
    {{name}}
</a>
`,
});
