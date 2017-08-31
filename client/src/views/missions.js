import {MissionsService} from '../services/missions.js'
import '../components/common/navbar.js'

export const MissionsView = {
    data: () => ({
    }),

    subscriptions: () => ({
        currentMissions: MissionsService.getCurrentMissionsStream(),
        finishedMissions: MissionsService.getFinishedMissionsStream(),
    }),

    created () {
    },

    template: `
<div>
    <navbar></navbar>
    <header>Current missions:</header>
    <div v-for="mission in currentMissions">
        <a :href="'#/mission/' + mission.id">
            {{mission}}
        </a>
    </div>
    <header>Finished missions:</header>
    <div v-for="mission in finishedMissions">
        <a :href="'#/mission/' + mission.id">
            {{mission}}
        </a>
    </div>
</div>
`,
};
