define('views/missions', ['components/navbar', 'services/missions'], function (navbar, MissionsService) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <header>Current missions:</header>
    <header>Available missions:</header>
</div>
`,
        data: () => ({
            availableMissions: MissionsService.getAvailableMissionsStream(),
            currentMissions: MissionsService.getCurrentMissionsStream()
        }),

        subscriptions: () => ({
        }),

        created () {
        }
    };
});
