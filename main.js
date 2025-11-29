var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');
var roleMineralMiner = require('role.mineralminer');
var roleHealer = require('role.healer');
var roleRepairer = require('role.repair');
var roleWorker = require('role.worker');

var Auto_Spawn      = true
var Log             = true
var turrets         = true

var Constructer     = 1
var Upgrader        = 1
var Harvester       = 0
var Miner           = 1
var Transporter     = 1
var Mineral_Miner   = 0
var Healer          = 0
var Repairer        = 1
var Worker          = 0

var tower = Game.getObjectById("602416bf31c5a73659d7335b");

// Game.market.deal("60cdf51dbd2c46860d59d8ff", 3829, "E58S31");
module.exports.loop = function () {
    // if(turrets) {
    //     var targets
    //     targets = tower.room.find(FIND_HOSTILE_CREEPS);
    //     if(targets[0]) {
    //         tower.attack(targets[0]);
    //     }
    // }

    var needs = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS, {
            filter: function(object) {return object.hits < object.hitsMax;}});
    if(needs[0]) {
        Healer = 1
    }
    else {
        Healer = 0
    }

    var energy_net = Game.spawns.Spawn1.room.energyAvailable
    var corpse = [CARRY, CARRY, WORK, MOVE, MOVE]
    var minerCorpse = [CARRY, CARRY, WORK, MOVE, MOVE]
    if(Log) {
        console.log("Available Energy: " + energy_net)
    }

    if(energy_net <= 400){
        Harvester = 1;
    }
    else {
        Harvester = 0;
    }

    var i = (energy_net - 300) / 250
    if(i > 9){
        i = 9;
    }
    if(i >= 3){
        corpse.push(CARRY, CARRY, MOVE)
    }
    while(i >= 1) {
        i -= 1
        corpse.push(WORK, WORK, MOVE)
        minerCorpse.push(WORK, WORK, WORK)
    }

    if(Log) {
        var cont = Game.getObjectById("a2db077296e87b8")
        var upgradePercentage = Math.round((cont.progress / cont.progressTotal) * 100)
        console.log("---------------");
        console.log("Upgrading progress: " + upgradePercentage + "%")
        console.log(Math.round(cont.progress/1000) + "k/" + Math.round(cont.progressTotal/1000) + "k Energy")
        var remaining = Math.round(cont.progressTotal - cont.progress)
        console.log(remaining + " Energy remaining")
    }

    var mineral = Game.getObjectById("47af6164d20e3a3");

    // Terminal = Game.getObjectById("6058001ab84fa6de2a043ebb");
    //if(Terminal.store.getUsedCapacity(mineral.mineralType) < 100000){
    //    Mineral_Miner = 1;
    //}
    if(mineral.mineralAmount <= 0){
        Mineral_Miner = 0;
    }

    var deals = Game.market.getAllOrders({type: ORDER_BUY, resourceType: mineral.mineralType});
    var maxPrice = 0;
    for (let i = 0; i < deals.length; i++) {
        if (deals[i].price > maxPrice) {
            maxPrice = deals[i].price
        }
    }

    for (let i = 0; i < deals.length; i++) {
        if(deals[i].price == maxPrice) {
            if(Game.market.deal(deals[i].id, deals[i].remainingAmount, "E58S31") == 0) {
                console.log("Sold " + deals[i].remainingAmount + deals[i].resourceType + " for " + deals[i].price)
            }
        }
    }

    var a = (Constructer + Upgrader + Harvester + Miner + Transporter + Healer + Repairer) - 1
    if(Memory.creeps.length < a){
        Game.notify('Not Enough Creeps');
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');;
    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var miner = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var transporter = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    var mineralminer = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineralminer');
    var healer = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var worker = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

    if(Log == true){
        console.log("---------------");
        if(Constructer > 0){console.log('Upgrader: ' + upgrader.length + '/' + Upgrader);}
        if(Upgrader > 0){console.log('Builder: ' + builder.length + '/' + Constructer);}
        if(Harvester > 0){console.log('Harvester: ' + harvester.length + '/' + Harvester);}
        if(Miner > 0){console.log('Miner: ' + miner.length + '/' + Miner);}
        if(Transporter > 0){console.log('Transporter: ' + transporter.length + '/' + Transporter);}
        if(Mineral_Miner > 0){console.log('Mineral Miner: ' + mineralminer.length + '/' + Mineral_Miner);}
        if(Healer > 0){console.log('Healer: ' + healer.length + '/' + Healer);}
        if(Repairer > 0){console.log('Repairer: ' + repairer.length + '/' + Repairer);}
        if(Worker > 0){console.log('Workers: ' + worker.length + '/' + Worker);}
        console.log("---------------");
    }

    if(Auto_Spawn == true){
        if(harvester.length < Harvester) {
            var newName = 'Harvester ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {memory: {role: 'harvester'}});
        }
        if(upgrader.length < Upgrader) {
            var newName = 'Upgrader ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(corpse, newName, {memory: {role: 'upgrader'}})
        }
        if(miner.length < Miner) {
            var newName = 'Miner ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(minerCorpse, newName, {memory: {role: 'miner'}});
        }
        if(transporter.length < Transporter) {
            var newName = 'Transporter ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], newName, {memory: {role: 'transporter'}});
        }
        if(builder.length < Constructer) {
            var newName = 'Builder ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(corpse, newName, {memory: {role: 'builder'}});
        }
        if(mineralminer.length < Mineral_Miner) {
            var newName = 'Mineral Miner ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(corpse, newName, {memory: {role: 'mineralminer'}});
        }
        if(healer.length < Healer) {
            var newName = 'Healer ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE], newName, {memory: {role: 'healer'}});
        }
        if(repairer.length < Repairer) {
            var newName = 'Repairer ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY], newName, {memory: {role: 'repairer'}});
        }
        if(worker.length < Worker) {
            var newName = 'Worker ' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(corpse, newName, {memory: {role: 'worker'}});
        }
    }

    var nearestCreep = Game.spawns["Spawn1"].pos.findClosestByRange(FIND_MY_CREEPS);
    var distance = Game.spawns["Spawn1"].room.findPath(Game.spawns["Spawn1"].pos, nearestCreep.pos).length;
    if(distance <= 1){
        if(nearestCreep.ticksToLive < 50){
            Game.spawns["Spawn1"].recycleCreep(nearestCreep);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        if(creep.memory.role == 'mineralminer') {
            roleMineralMiner.run(creep, mineral.mineralType);
        }
        if(creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
    }
}