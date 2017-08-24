define('views/site', [
    'components/navbar/navbar', 'components/region', 'components/tabs/tabs', 'components/staff/staff',
    'services/sites', 'services/staff', 'services/recruits', 'services/player', 'services/equipment'
], function (navbar, region, tabs, staff,
             SitesService, StaffService, RecruitsService, PlayerService, EquipmentService) {
    return {
        components: {
            navbar,
            region,
            tabs,
            staff
        },

        template: `
<div>
    <navbar></navbar>
    <header>Site:</header>
    <div v-if="site">
        {{site}}
        <div class="name">{{site.name}}</div>
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
                    <button @click="mode = 'recruit'">Recruit</button>
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
            <tab header="Equipment" v-if="site.owner === player.id">
                <div v-if="mode !== 'buy-eq'">
                    <button @click="mode = 'buy-eq'">Purchase new equipment</button>
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
            <tab header="Inventory" v-if="site.owner === player.id">
                Inventory list
            </tab>
        </tabs>
    </div>
</div>
`,
        data: () => ({
            mode: 'list'
        }),

        computed: {
            siteId () {
                return +this.$route.params.siteId; // TODO: raise Vue-router ticket
            }
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
        }
    };
});
