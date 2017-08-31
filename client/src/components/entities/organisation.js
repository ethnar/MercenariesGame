import {OrganisationsService} from '../../services/organisations.js'

export default Vue.component('organisation', {
    props: [
        'organisationId',
    ],

    subscriptions () {
        return {
            organisation: this
                .stream('organisationId')
                .flatMapLatest(organisationId => OrganisationsService.getOrganisationStream(organisationId))
        }
    },

    created () {
    },

    template: `
<a :href="'#/organisation/' + organisationId" v-if="organisation">
    {{organisation.name}}
</a>
`,
});
