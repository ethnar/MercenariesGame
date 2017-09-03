import {SitesService} from '../../services/sites.js'
import {StaffService} from '../../services/staff.js'
import {RecruitsService} from '../../services/recruits.js'
import {PlayerService} from '../../services/player.js'
import {EquipmentService} from '../../services/equipment.js'
import '../common/navbar.js'
import '../generic/tabs.js'
import '../entities/organisation.js'
import '../entities/staff.js'
import '../entities/region.js'
import '../entities/site-holder.js'

export const SiteView = {
    data: () => ({
        mode: 'list',
        TYPES: STATICS.SITES.OFFERS,
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
        const siteStream = this.stream('siteId').switchMap(siteId => SitesService.getSiteStream(siteId));
        return {
            staff: this.stream('siteId').switchMap(siteId => {
                return StaffService.getStaffStream().map(staff => {
                    return staff.filter(person => person.site === siteId);
                });
            }),
            site: siteStream,
            equipment: this.stream('siteId').switchMap(siteId => {
                return EquipmentService.getEquipmentStream(siteId);
            }),
            availableEquipment: siteStream
                .map(site => site.region)
                .distinctUntilChanged()
                .switchMap(region => {
                    return EquipmentService.getAvailableEquipmentStream(region);
                }),
            recruits: siteStream
                .switchMap(site => {
                    return RecruitsService.getRecruitsStream(site.region);
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
    <div v-if="site">
        <div class="name">{{site.name}}</div>
        <site-holder :siteId="site.id"></site-holder>
        <region :regionId="site.region"></region>
        <div v-if="site.occupied === false && site.price">
            Price: {{site.price}}
            <button @click="purchaseSite();">Purchase</button>
        </div>
        <div v-if="site.owner !== player.id">
            <button @click="useIntel();">Use intel ({{site.intelCost}})</button>            
        </div>
        <tabs>
            <tab header="Offers" v-if="site.wares">
                <div v-for="(wares, type) in site.wares">
                    <div v-for="ware in wares">
                        <div v-if="type == TYPES.WEAPONS">Weapon: {{ware}}</div>
                        <div v-if="type == TYPES.PERSONNEL">Staff: {{ware}}</div>
                        <div v-if="type == TYPES.GENERAL">Equipment: {{ware}}</div>
                    </div>
                </div>
            </tab>
            <tab header="Staff" v-if="site.staff">
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
            <tab header="Equipment" v-if="site.equipment">
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
};
