import {LoginView} from './views/login.js'
import {MapView} from './views/map.js'
import {MissionsView} from './views/missions.js'
import {MissionView} from './views/mission.js'
import {SitesView} from './views/sites.js'
import {SiteView} from './views/site.js'
import {RegionView} from './views/region.js'
import {OrganisationView} from './views/organisation.js'

Vue.use(VueRx, Rx);

Vue.prototype.stream = function (prop) {
    return this.$watchAsObservable(prop).pluck('newValue').startWith(this[prop]);
};

window.router = new VueRouter({
    routes: [{
        path: '/login',
        component: LoginView
    }, {
        path: '/map',
        component: MapView
    }, {
        path: '/missions',
        component: MissionsView
    }, {
        path: '/mission/:missionId',
        component: MissionView
    }, {
        path: '/sites',
        component: SitesView
    }, {
        path: '/site/:siteId',
        component: SiteView
    }, {
        path: '/region/:regionId',
        component: RegionView
    }, {
        path: '/organisation/:organisationId',
        component: OrganisationView
    }, {
        path: '*',
        redirect: '/map'
    }]
});

const app = new Vue({
    router: window.router
}).$mount('#app');
