const world = require('../singletons/world');
const service = require('../singletons/service');
const misc = require('../singletons/misc');

let ids = {};

class Entity {
    constructor (args = {}) {
        const className = args.className || this.constructor.name;
        this.className = className;
        ids[className] = (ids[className] || 0) + 1;
        this.id = ids[className];

        this.relatedFacts = [];

        world.entities[className].push(this);
    }

    getId () {
        return this.id;
    }

    static getById (entityId) {
        const className = this.name;
        return world.entities[className].find(entity => entity.getId() === entityId);
    }

    getRelatedFacts () {
        return this.relatedFacts;
    }

    getLabel () {
        return 'No-label';
    }

    getLabelPayload () {
        return '{' + this.className + ':' + this.id + ':' + this.getLabel() + '}';
    }

    getSaveData () {
        return Entity.recursiveEncodeEntities(this);
    }

    destroy () {
        let idx = world.entities[this.className].indexOf(this);
        world.entities[this.className].splice(idx, 1);
    }

    getPayload() {
        throw new Error('Payload retrieve function not defined: ' + this.className);
    }

    updated(targetPlayer = null) {
        subscriptions.forEach((subs, connection) => {
            const entitySubscriptions = subs[this.className] || [];
            entitySubscriptions.forEach(subscription => {
                if (subscription.filter(this)) {
                    const player = service.getPlayer(connection);
                    if (!targetPlayer || targetPlayer === player) {
                        const payload = this.getPayload(player);
                        if (payload) {
                            service.sendUpdate(`update-${subscription.key}`, connection, payload);
                            subscription.ids[this.getId()] = true;
                        } else {
                            service.sendUpdate(`remove-${subscription.key}`, connection, this.getId());
                            delete subscription.ids[this.getId()];
                        }
                    }
                } else {
                    if (subscription.ids[this.getId()]) {
                        service.sendUpdate(`remove-${subscription.key}`, connection, this.getId());
                        delete subscription.ids[this.getId()];
                    }
                }
            });
        });
    }

    static buildFilteringFunction (filterObject) {
        return (entity) => {
            let matching = true;
            Object.keys(filterObject).forEach(key => {
                let expectedValues = filterObject[key];
                if (!Array.isArray(expectedValues)) {
                    expectedValues = [expectedValues];
                }
                const fnName = `get${misc.ucfirst(key)}`; // TODO: that's hackable, needs to use payload information only
                let value = entity[fnName] ? entity[fnName]() : entity[key];
                if (value && value.className) {
                    value = value.getId();
                }
                matching = matching && (expectedValues.indexOf(value) !== -1);
            });
            return matching;
        };
    }
}

const subscriptions = new Map();

function getSubscriptionsStorage(connection) {
    if (!subscriptions.get(connection)) {
        subscriptions.set(connection, {});

        connection.on('close', () => {
            subscriptions.delete(connection);
        });
    }
    return subscriptions.get(connection);
}

service.registerHandler('subscribe', (params, player, conn) => {
    if (!player) {
        return null;
    }

    const filterFunction = Entity.buildFilteringFunction(params.filter);

    const entities = world
        .getEntitiesArray(params.entity)
        .filter(filterFunction);

    const connectionSubscriptions = getSubscriptionsStorage(conn);
    connectionSubscriptions[params.entity] = connectionSubscriptions[params.entity] || [];
    connectionSubscriptions[params.entity].push({
        filter: filterFunction,
        key: params.key,
        ids: entities
            .map(entity => entity.getId())
            .reduce((acc, item) => Object.assign(acc, {[item]: true}), {}),
    });

    return entities
        .map(entity => entity.getPayload(player))
        .filter(entity => !!entity);
});

let classRegistry = {};
Entity.registerClass = classConstructor => {
    classRegistry[classConstructor.name] = classConstructor;
    world.entities[classConstructor.name] = [];
};

Entity.loadFromJson = data => {
    let entity = new classRegistry[data.className]();
    Object.keys(data).forEach(key => {
        entity[key] = data[key];
    });
    return entity;
};

Entity.recursiveEncodeEntities = object => {
    let result = Array.isArray(object) ? [] : {};
    Object.keys(object).forEach(key => {
        if (object[key] instanceof Entity) {
            result[key] = {
                className: object[key].className,
                id: object[key].id
            }
        } else if (typeof object[key] === 'object' && object[key]) {
            result[key] = Entity.recursiveEncodeEntities(object[key]);
        } else {
            result[key] = object[key];
        }
    });
    return result;
};

Entity.recursiveDecodeEntities = param => {
    if (typeof param === 'object' && param) {
        Object.keys(param).forEach(key => {
            if (param[key] && param[key].className && !(param[key] instanceof Entity)) {
                param[key] = world.entities[param[key].className].find(item => item.id === param[key].id);
            } else {
                Entity.recursiveDecodeEntities(param[key]);
            }
        });
    }
};

module.exports = Entity;
