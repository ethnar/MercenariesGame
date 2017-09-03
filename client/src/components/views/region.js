import {RegionsService} from '../../services/regions.js'
import {SitesService} from '../../services/sites.js'
import {MissionsService} from '../../services/missions.js'
import '../common/navbar.js'
import '../generic/tabs.js'
import '../entities/region.js'
import '../entities/site.js'
import '../entities/mission.js'

export const RegionView = {
    data: () => ({
    }),

    computed: {
        regionId () {
            return +this.$route.params.regionId; // TODO: raise Vue-router ticket
        }
    },

    subscriptions () {
        return {
            region:
                this.stream('regionId')
                    .switchMap(regionId =>
                        RegionsService.getRegionStream(regionId)
                    ),
            sites:
                this.stream('regionId')
                    .switchMap(regionId =>
                        SitesService
                            .getSitesStream()
                            .map(sites => sites.filter(site => site.region === regionId))
                    ),
            missions:
                this.stream('regionId')
                    .switchMap(regionId =>
                        MissionsService.getRegionMissionsStream(regionId)
                    ),
        }
    },

    created () {
    },

    destroyed () {
    },

    methods: {
        useIntel() {
            RegionsService.investigate(this.region);
        },

        takeMission(mission) {
            MissionsService.reserveMission(mission.id).then(() => {
                window.location.hash = `/mission/${mission.id}`;
            })
        },
    },

    template: `
<div>
    <navbar></navbar>
    <div v-if="region">
        <header>Region:</header>
        <region :region-id="regionId"></region>
        <button @click="useIntel();">Use intel ({{region.intelCost}})</button>
        <tabs>
            <tab header="Missions">
                <div v-for="mission in missions">
                    <mission :mission-id="mission.id"></mission>
                    <button @click="takeMission(mission)">Take</button>
                </div>
            </tab>
            <tab header="Sites">
                <div v-for="site in sites">
                    <site :site-id="site.id"></site>
                </div>
            </tab>
        </tabs>
    </div>
</div>
`,
};
