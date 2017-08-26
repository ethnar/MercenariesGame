const Entity = require('./entity');
const Worldview = require('./worldview');
const world = require('../singletons/world');
const service = require('../singletons/service');
const crypto = require('crypto');
const misc = require('../singletons/misc');
const errorResponse = require('../functions/error-response');

const hash = method => string => crypto.createHash(method).update(string).digest('hex');

const shasum = hash('sha1');
const md5 = hash('md5');

const authTokens = {};

class Player extends Entity {
    constructor (name, password, npc) {
        super();

        this.name = name;
        this.password = Player.passwordHash(password);
        this.npc = !!npc;
        this.worldview = new Worldview(50);

        this.knownFacts = {};
        this.funds = 0;
        this.fundsDelta = 0;
        this.intel = 0;
        this.intelDelta = 100;
        this.intelCap = 100000;
        this.siteKnowledge = {};
        this.regionKnowledge = {};
        //this.politiciansKnowledge = {};
        this.sites = [];
    }

    static passwordHash (password) {
        return shasum(password + '-mercenaries-game');
    }

    addSite (site) {
        this.sites.push(site);
        this.siteKnowledge[site.id] = {
            familiarity: 10,
            site
        };
        site.updated(this);
    }

    cycle (cycles) {
        if (cycles.regular) {
            this.gatherIntelligence();
        }
    }

    gatherIntelligence () {
        this.addIntel(this.getIntelDelta() * 100);
    }

    getFunds () {
        return this.funds;
    }

    getFundsDelta () {
        return this.fundsDelta;
    }

    getIntel () {
        return this.intel;
    }

    getIntelDelta () {
        return this.intelDelta;
    }

    addIntel (intel) {
        this.intel = Math.min(this.intel + intel, this.intelCap);
        this.updated(this);
    }

    useIntel (intel) {
        if (this.intel >= intel) {
            this.intel -= intel;
            this.updated(this);
            return true;
        }
        return false;
    }

    investigateRegion(region) {
        const knowledge = this.regionKnowledge[region.id] || {
            familiarity: 0,
            region
        };
        this.regionKnowledge[region.id] = knowledge;
        if (knowledge.familiarity < 10) {
            const intelNeeded = misc.getIntelCost('region', knowledge.familiarity);
            if (this.useIntel(intelNeeded)) {
                knowledge.familiarity = knowledge.familiarity + 1;
                region.updated(this);

                const sites = [...region.getSites()];

                sites.sort((a, b) => {
                    return b.getVisibility() - a.getVisibility();
                });

                let reveal = Math.ceil(sites.length * (knowledge.familiarity + Math.random() * 0.2) / 10);
                reveal = Math.min(reveal, sites.length);

                for (let i = 0; i < reveal; i++) {
                    if (this.getSiteFamiliarity(sites[i]) < 1) {
                        this.revealSite(sites[i], 1);
                    }
                }
                return true;
            }
        }
        return false;
    }

    investigateSite(site) {
        const knowledge = this.siteKnowledge[site.id] || {
            familiarity: 0,
            site
        };
        this.siteKnowledge[site.id] = knowledge;
        if (knowledge.familiarity < 10) {
            const intelNeeded = misc.getIntelCost('site', knowledge.familiarity);
            if (this.useIntel(intelNeeded)) {
                knowledge.familiarity = knowledge.familiarity + 1;
                site.updated(this);
                return true;
            }
        }
        return false;
    }

    investigatePolitician(politician) {

    }

    revealSite(site, familiarity = 10) {
        this.siteKnowledge[site.getId()] = {
            familiarity,
            site
        };
        site.updated(this);
        if (site.getRelatedMission()) {
            site.getRelatedMission().updated();
        }
    }

    addFunds (funds) {
        this.funds += funds;
        this.updated(this);
    }

    pay (funds) {
        if (this.funds >= funds) {
            this.funds -= funds;
            this.updated(this);
            return true;
        }
        return false;
    }

    getSites () {
        return this.sites;
    }

    getKnownSites () {
        return misc.toArray(this.siteKnowledge).map(item => item.site);
    }

    getSiteFamiliarity (site) {
        return this.siteKnowledge[site.id] ? this.siteKnowledge[site.id].familiarity : 0;
    }

    getRegionFamiliarity (region) {
        return this.regionKnowledge[region.id] ? this.regionKnowledge[region.id].familiarity : 0;
    }

    getStaff () {
        let result = [];
        this.getSites().forEach(site => {
            result = result.concat(site.getStaff())
        });
        return result;
    }

    getCoveredRegions () {
        let regions = {};
        this.getSites().forEach(site => {
            regions[site.getRegion().getId()] = site.getRegion();
        });
        return Object.keys(regions).map(id => regions[id]);
    }

    isCoveringRegion (region) {
        return !!this.getSites().find(site => site.getRegion() === region);
    }

    getName () {
        return this.name;
    }

    getKnownFacts () {
        return this.knownFacts;
    }

    startedMission (mission) {
    }

    finishedMission (mission) {
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === Player.passwordHash(password) && this.name === name;
    }

    getPayload (player) {
        let result = {
            id: this.getId(),
            name: this.getName(),
        };

        if (player === this) {
            result = Object.assign(result, {
                funds: this.getFunds(),
                intel: this.getIntel(),
                fundsDelta: this.getFundsDelta(),
                intelDelta: this.getIntelDelta(),
                intelCap: this.intelCap,
            });
        }
        return result;
    }
}

service.registerHandler('authenticate-token', (params, previousPlayer, conn) => {
    const auth = authTokens[params.token];
    if (!auth) {
        return errorResponse('Unrecognised token');
    }

    if (auth.expires <= new Date().getTime()) {
        return errorResponse('Expired token');
    }

    service.setPlayer(conn, auth.player);

    return {
        player: auth.player.getId(),
        success: true
    };
}, true);

service.registerHandler('authenticate', (params, previousPlayer, conn) => {
    let player = world.getEntitiesArray('Player').find(player => {
        return player.verifyUsernameAndPassword(params.user, params.password);
    });
    if (player) {
        service.setPlayer(conn, player);
    }
    const token = md5(player.name + new Date().getTime());
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    authTokens[token] = {
        player,
        expires: expires.getTime()
    };
    return {
        token,
        player: player.getId(),
        success: !!player
    };
}, true);

Entity.registerClass(Player);
module.exports = Player;
