define('components/staff/staff', [], function () {
    return {
        components: {
        },

        template: `
            <div>
                {{person}}
            </div>
        `,
        props: [
            'person'
        ],

        data: () => ({
        }),

        subscriptions () {
        },

        created () {
        }
    };
});
