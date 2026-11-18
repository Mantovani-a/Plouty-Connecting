import assert from 'node:assert/strict';
import { professionalProfiles } from '../src/data/profilesData.js';
import {
  connectionIdsFor, connectionStatus, initialNetwork, migrateLegacyConnections,
  normalizeNetwork, requestsFor, transitionNetwork
} from '../src/utils/networkModel.js';

const producer = 'joao-carlos';
const buyer = 'escola-caminhos';
const initial = initialNetwork();
assert.equal(professionalProfiles.length, 14);
assert.equal(connectionStatus(initial, producer, buyer), 'none');
assert.ok(requestsFor(initial, producer, 'incoming').length > 0);
assert.ok(requestsFor(initial, producer, 'outgoing').length > 0);
assert.ok(requestsFor(initial, buyer, 'incoming').length > 0);
assert.ok(requestsFor(initial, buyer, 'outgoing').length > 0);

let network = transitionNetwork(initial, 'send', producer, buyer);
assert.equal(connectionStatus(network, producer, buyer), 'outgoing');
assert.equal(connectionStatus(network, buyer, producer), 'incoming');
assert.strictEqual(transitionNetwork(network, 'send', producer, buyer), network, 'Solicitação duplicada');
assert.strictEqual(transitionNetwork(network, 'send', buyer, producer), network, 'Solicitação cruzada duplicada');
assert.strictEqual(transitionNetwork(network, 'send', producer, producer), network, 'Solicitação para o próprio perfil');

network = transitionNetwork(network, 'cancel', producer, buyer);
assert.equal(connectionStatus(network, buyer, producer), 'none');
network = transitionNetwork(network, 'send', buyer, producer);
assert.equal(connectionStatus(network, producer, buyer), 'incoming');
network = transitionNetwork(network, 'decline', producer, buyer);
assert.equal(connectionStatus(network, producer, buyer), 'none');

network = transitionNetwork(network, 'send', producer, buyer);
network = transitionNetwork(network, 'accept', buyer, producer);
assert.equal(connectionStatus(network, producer, buyer), 'connected');
assert.equal(connectionStatus(network, buyer, producer), 'connected');
assert.ok(connectionIdsFor(network, producer).includes(buyer));
assert.ok(connectionIdsFor(network, buyer).includes(producer));
assert.strictEqual(transitionNetwork(network, 'send', producer, buyer), network, 'Solicitação para conexão existente');
assert.strictEqual(transitionNetwork(network, 'accept', buyer, producer), network, 'Aceite duplicado');

network = transitionNetwork(network, 'remove', producer, buyer);
assert.equal(connectionStatus(network, producer, buyer), 'none');
assert.ok(!connectionIdsFor(network, buyer).includes(producer));
assert.strictEqual(transitionNetwork(network, 'remove', producer, buyer), network, 'Remoção duplicada');

const normalized = normalizeNetwork({
  connections: [[producer, buyer], [buyer, producer], [producer, producer], ['desconhecido', buyer]],
  requests: [{ fromId: producer, toId: buyer }, { fromId: buyer, toId: producer }]
});
assert.equal(normalized.connections.length, 1);
assert.equal(normalized.requests.length, 0);

const migrated = migrateLegacyConnections({ [producer]: [buyer, buyer, producer] });
assert.equal(connectionStatus(migrated, producer, buyer), 'connected');
assert.equal(migrated.connections.filter(([a, b]) => a === producer && b === buyer || a === buyer && b === producer).length, 1);

console.log(`Rede válida: ${initial.connections.length} conexões e ${initial.requests.length} solicitações iniciais; envio, cancelamento, aceite, recusa, remoção, duplicidade e migração verificados.`);
