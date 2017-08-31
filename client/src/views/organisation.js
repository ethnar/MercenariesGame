import {OrganisationsService} from '../services/organisations.js'
import '../components/common/navbar.js'
import '../components/entities/worldview.js'

export const OrganisationView = {
    computed: {
        organisationId () {
            return +this.$route.params.organisationId;
        }
    },

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
};
