define('components/mission/mission', [
    'services/missions',
    'components/region',
    'components/site/site'
], (MissionsService) => Vue.component('mission', {
    props: [
        'missionId'
    ],

    subscriptions () {
        return {
            mission: this.stream('missionId')
                .flatMapLatest(missionId => MissionsService.getMissionStream(missionId)),
        }
    },

    created () {
    },

    destroyed () {
    },

    template: `
<div class="component-mission" v-if="mission">
    <div class="description">{{mission.description}}</div>
    <region :region-id="mission.region"></region>
    <site :site-id="mission.site"></site>
    <human :human-id="mission.owner"></human>
</div>
`,
}));
