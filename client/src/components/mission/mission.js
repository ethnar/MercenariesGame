define('components/mission/mission', [
    'services/missions',
    'components/region',
    'components/site/site',
    'components/politician/politician',
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
    Target: <site :site-id="mission.site"></site>
    Contact: <politician :politician-id="mission.owner"></politician>
</div>
`,
}));
