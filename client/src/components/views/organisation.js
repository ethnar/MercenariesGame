import {OrganisationsService} from '../../services/organisations.js'
import '../common/navbar.js'
import '../entities/worldview.js'

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
                .switchMap(organisationId => OrganisationsService.getOrganisationStream(organisationId)),
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
