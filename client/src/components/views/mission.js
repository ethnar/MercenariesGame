import {MissionsService} from '../../services/missions.js'
import {SitesService} from '../../services/sites.js'
import {StaffService} from '../../services/staff.js'
import '../common/navbar.js'
import '../entities/site.js'
import '../entities/staff.js'

export const MissionView = {
    computed: {
        missionId () {
            return +this.$route.params.missionId;
        },

        emptySelection () {
            return Object.keys(this.selectedStaff).find(staffId => this.selectedStaff[staffId]);
        }
    },

    data: () => ({
        state: 'review',
        selectedSite: null,
        selectedStaff: {}
    }),

    subscriptions: function () {
        return {
            sites: SitesService.getOwnSitesStream(),
            staff: this.stream('selectedSite').switchMap(site => StaffService.getStaffStream().map(staff => {
                return staff.filter(person => site && person.site === site.id);
            })),
            mission: this.stream('missionId').switchMap(missionId => MissionsService.getMissionStream(missionId))
        };
    },

    methods: {
        selectStaff (staff) {
            Vue.set(this.selectedStaff, staff.id, true);
        },

        deselectStaff (staff) {
            Vue.set(this.selectedStaff, staff.id, false);
        },

        startMission () {
            const staffIds = Object.keys(this.selectedStaff)
                .filter(staffId => this.selectedStaff[staffId])
                .map(staffId => +staffId);
            MissionsService.startMission(this.missionId, this.selectedSite.id, staffIds).then(response => {
                if (response.result) {
                    window.router.push('/missions');
                } else {
                    alert(response.message);
                }
            });
        }
    },

    template: `
<div v-if="mission"> 
    <navbar></navbar>
    <div v-if="state === 'review'">
        <div>{{mission}}</div>
        <button v-if="!mission.inProgress && !mission.finished" @click="state = 'selectSite'">Accept Mission</button>
    </div>
    <div v-if="state === 'selectSite'">
        <div v-for="site in sites" class="site" @click="state = 'selectStaff'; selectedSite = site;">
            <site :site-id="site.id"/>
        </div>
    </div>
    <div v-if="state === 'selectStaff'">
        <header>Available staff:</header>
        <div v-for="person in staff" @click="selectStaff(person);" v-if="!selectedStaff[person.id]">
            <staff :person="person"></staff>
        </div>
        <header>Selected staff:</header>
        <div v-for="person in staff" @click="deselectStaff(person);" v-if="selectedStaff[person.id]">
            <staff :person="person"></staff>
        </div>
        <button @click="startMission();" :disabled="!emptySelection">Start mission</button>
    </div>
</div>
`,
};
