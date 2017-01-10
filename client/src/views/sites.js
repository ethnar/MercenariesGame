define('views/sites', ['components/navbar'], function (navbar) {
    return {
        components: {
            navbar
        },

        template: `
<div>
    <navbar></navbar>
    <header>Sites:</header>
</div>
`,
        data: () => ({
        }),

        subscriptions: () => ({
        }),

        created () {
        }
    };
});
