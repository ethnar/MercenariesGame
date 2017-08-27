define('views/site', [
    'services/sites',
    'services/staff',
    'services/recruits',
    'services/player',
    'services/equipment',
    'components/navbar/navbar',
    'components/region',
    'components/tabs/tabs',
    'components/staff/staff',
    'components/organisation/organisation',
], (SitesService, StaffService, RecruitsService, PlayerService, EquipmentService) => ({
    data: () => ({
        mode: 'list'
    }),

    computed: {
        siteId () {
            return +this.$route.params.siteId; // TODO: raise Vue-router ticket
        },

        ownSite() {
            return this.site.owner === this.player.id;
        },
    },

    subscriptions () {
        return {
            staff: this.stream('siteId').flatMapLatest(siteId => {
                return StaffService.getStaffStream().map(staff => {
                    return staff.filter(person => person.site === siteId);
                });
            }),
            site: this.stream('siteId').flatMapLatest(siteId => {
                return SitesService
                    .getSiteStream(siteId);
            }),
            equipment: this.stream('siteId').flatMapLatest(siteId => {
                return EquipmentService.getEquipmentStream(siteId);
            }),
            availableEquipment: this.stream('siteId').flatMapLatest(siteId => {
                return SitesService
                    .getSiteStream(siteId)
                    .map(site => site.region)
                    .distinctUntilChanged()
                    .flatMapLatest(region => {
                        return EquipmentService.getAvailableEquipmentStream(region);
                    });
            }),
            recruits: this.stream('siteId').flatMapLatest(siteId => {
                return SitesService
                    .getSiteStream(siteId)
                    .flatMapLatest(site => {
                        return RecruitsService.getRecruitsStream(site.region);
                    });
            }),
            player: PlayerService.getCurrentPlayerStream(),
        }
    },

    created () {
    },

    destroyed () {
    },

    methods: {
        recruit (recruitId) {
            RecruitsService.recruit(recruitId, this.siteId).then(response => {
                if (response.result) {
                    this.mode = 'list';
                } else {
                    alert(response.message);
                }
            });
        },

        purchaseSite () {
            SitesService.purchase(this.siteId);
        },

        purchaseEquipment (equipment) {
            EquipmentService.purchase(this.siteId, equipment.id).then(response => {
                if (!response.result) {
                    alert(response.message);
                }
            });
        },

        useIntel() {
            SitesService.investigate(this.site);
        }
    },

    template: `
<div>
    <navbar></navbar>
    <header>Site:</header>
    {{site}}
    <div v-if="site">
        <div class="name">{{site.name}}</div>
        <div class="occupied" v-if="site.occupied !== undefined">
            Owner:
            <span v-if="site.organisation">
                <organisation :organisation-id="site.organisation"></organisation>
            </span>
            <span v-if="site.owner">
                <player :player-id="site.owner"></player>
            </span>         
            <span v-if="!site.owner && !site.organisation">
                {{site.occupied ? 'Unknown' : 'None' }}
            </span>
        </div>
        <region :regionId="site.region"></region>
        <div v-if="site.occupied === false && site.price">
            Price: {{site.price}}
            <button @click="purchaseSite();">Purchase</button>
        </div>
        <div v-if="site.owner !== player.id">
            <button @click="useIntel();">Use intel ({{site.intelCost}})</button>            
        </div>
        <tabs>
            <tab header="Staff" v-if="staff !== null">
                <div v-if="mode !== 'recruit'">
                    <button v-if="ownSite" @click="mode = 'recruit'">Recruit</button>
                    <div v-for="person in staff">
                        <staff :person="person"></staff>
                    </div>
                </div>
                <div v-if="mode === 'recruit'">
                    <button @click="mode = ''">Cancel</button>
                    <div v-for="person in recruits">
                        <staff :person="person"></staff>
                        <button @click="recruit(person.id);">Recruit</button>
                    </div>
                </div>
            </tab>
            <tab header="Equipment" v-if="equipment">
                <div v-if="mode !== 'buy-eq'">
                    <button v-if="ownSite" @click="mode = 'buy-eq'">Purchase new equipment</button>
                    <div v-for="eq in equipment">
                        {{eq}}
                    </div>
                </div>
                <div v-if="mode === 'buy-eq'">
                    <button @click="mode = ''">Cancel</button>
                    <div v-for="equipment in availableEquipment">
                        {{equipment}}
                        <button @click="purchaseEquipment(equipment)">Purchase</button>
                    </div>
                </div>
            </tab>
            <tab header="Inventory" v-if="ownSite">
                Inventory list
            </tab>
        </tabs>
    </div>
</div>
`,
}));
