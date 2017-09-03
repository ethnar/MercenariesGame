import {LoginView} from './components/views/login.js'
import {MapView} from './components/views/map.js'
import {MissionsView} from './components/views/missions.js'
import {MissionView} from './components/views/mission.js'
import {SitesView} from './components/views/sites.js'
import {SiteView} from './components/views/site.js'
import {RegionView} from './components/views/region.js'
import {OrganisationView} from './components/views/organisation.js'

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
