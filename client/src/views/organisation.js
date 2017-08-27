define('views/organisation', [
    'services/organisations',
    'components/navbar/navbar',
], (OrganisationsService) => ({
    data: () => ({}),

    subscriptions() {
        return {
            organisation: this
                .stream('organisationId')
                .flatMapLatest(organisationId => OrganisationsService.getOrganisationStream(organisationId)),
        };
    },

    created() {
    },

    template: `
<div>
    <navbar></navbar>
    <header>Organisation:</header>
    <div v-if="organisation">
        {{organisation.name}}
        <worldview :data="organisation.worldview" />
    </div>
</div>
`,

}));
