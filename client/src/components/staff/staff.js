define('components/staff/staff', [
], () => Vue.component('staff', {
    props: [
        'person'
    ],

    data: () => ({
    }),

    subscriptions () {
    },

    created () {
    },

    template: `
<div>
    {{person}}
</div>
    `,

}));
