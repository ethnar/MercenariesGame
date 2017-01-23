define('views/missions', ['components/navbar', 'services/missions'], function (navbar, MissionsService) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <header>Current missions:</header>
    <header>Known missions:</header>
    <div v-for="item in knownMissions">{{item}}</div>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
            knownMissions: MissionsService.getKnownMissionsStream(),
            currentMissions: MissionsService.getCurrentMissionsStream()
        }),

        created () {
        }
    };
});
