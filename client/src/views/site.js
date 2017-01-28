define('views/site', [
    'components/navbar', 'components/region', 'components/tabs/tabs', 'components/staff/staff',
    'services/sites', 'services/staff', 'services/recruits'
], function (navbar, region, tabs, staff,
             SitesService, StaffService, RecruitsService) {
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
        <div class="name">{{site.name}}</div>
        <region :regionId="site.region"></region>
        <tabs>
            <tab header="Staff">
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
                        <button @click="recruit(person.id);mode = 'list';">Recruit</button>
                    </div>
                </div>
            </tab>
            <tab header="Equipment">List of installed equipment</tab>
            <tab header="Inventory">Inventory list</tab>
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
                staff: StaffService.getStaffStream().map(staff => {
                    return staff.filter(person => person.site === this.siteId);
                }),
                recruits: this.stream('siteId').flatMapLatest(siteId => {
                    return SitesService.getSitesStream().map(sites => {
                        console.log(siteId);
                        console.log(sites);
                        return sites.find(site => site.id === siteId);
                    }).flatMapLatest(site => {
                        return RecruitsService.getRecruitsStream(site.region);
                    });
                }),
                site: this.stream('siteId').flatMapLatest(siteId => {
                    return SitesService.getSitesStream().map(sites => {
                        return sites.find(site => site.id === siteId);
                    });
                })
            }
        },

        created () {
        },

        destroyed () {
        },

        methods: {
            recruit (recruitId) {
                RecruitsService.recruit(recruitId, this.siteId).then(result => {
                    if (result !== true) {
                        alert(result);
                    }
                });
            }
        }
    };
});
