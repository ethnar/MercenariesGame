export default Vue.component('staff', {
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

});
