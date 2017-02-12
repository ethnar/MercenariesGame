define('views/site', [
    'components/navbar', 'components/region', 'components/tabs/tabs', 'components/staff/staff', 'components/info/info',
    'services/sites', 'services/staff', 'services/recruits', 'services/news'
], function (navbar, region, tabs, staff, info,
             SitesService, StaffService, RecruitsService, NewsService) {
    return {
        components: {
            navbar,
            region,
            tabs,
            staff,
            info
        },

        template: `
<div>
    <navbar></navbar>
    <header>Site:</header>
    <div v-if="site">
        <div class="name">{{site.name}}</div>
        <region :regionId="site.region"></region>
        <div v-if="site.available">
            Price: {{site.price}}
            <button @click="purchase();">Purchase</button>
        </div>
        <tabs>
            <tab header="News" v-if="site.npc">
                <info v-for="item in news" :message="item">{{item}}</info>
            </tab>
            <tab header="Staff" v-if="site.owned">
                <div v-if="mode === 'list'">
                    <button @click="mode = 'recruit'">Recruit</button>
                    <div v-for="person in staff">
                        <staff :person="person"></staff>
                    </div>
                </div>
                <div v-if="mode === 'recruit'">
                    <button @click="mode = 'list'">Cancel</button>
                    <div v-for="person in recruits">
                        <staff :person="person"></staff>
                        <button @click="recruit(person.id);">Recruit</button>
                    </div>
                </div>
            </tab>
            <tab header="Equipment" v-if="site.owned || site.available">
                List of installed equipment
            </tab>
            <tab header="Inventory" v-if="site.owned">
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
                recruits: this.stream('siteId').flatMapLatest(siteId => {
                    return SitesService
                        .getSiteStream(siteId)
                        .flatMapLatest(site => {
                            return RecruitsService.getRecruitsStream(site.region);
                        });
                }),
                news:
                    this.stream('siteId')
                        .flatMapLatest(siteId =>
                            NewsService
                                .getRelatedStream('Site', siteId)
                        )
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

            purchase () {
                SitesService.purchase(this.siteId).then(response => {
                    if (!response.result) {
                        alert(response.message);
                    }
                });
            }
        }
    };
});
