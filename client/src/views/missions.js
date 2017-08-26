define('views/missions', ['components/navbar/navbar', 'services/missions'], function (navbar, MissionsService) {
    return {
        components: {
            navbar
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
        data: () => ({
        }),

        subscriptions: () => ({
            currentMissions: MissionsService.getCurrentMissionsStream(),
            finishedMissions: MissionsService.getFinishedMissionsStream(),
        }),

        created () {
        }
    };
});
