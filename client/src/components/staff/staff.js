define('components/staff/staff', ['services/staff'], function (StaffService) {
    return {
        components: {
        },

        template: `
            <div>
                <header>Staff list:</header>
                <div v-for="person in staff">{{person}}</div>
            </div>
        `,
        props: [
            'filter'
        ],

        data: () => ({
            staff: []
        }),

        subscriptions () {
            return {
                staff: this.stream('filter').flatMapLatest(filter => {
                    return StaffService.getStaffStream().map(staff => {
                        return staff.filter(filter);
                    });
                })
            }
        },

        created () {
        }
    };
});
