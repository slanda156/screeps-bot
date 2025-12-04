var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');


for (roomName in Game.rooms) {
    var room = Game.rooms[roomName];
    var controller = room.controller;
    if (!(controller && controller.my)) {
        continue;
    }
    var minerals = room.find(FIND_MINERALS);
    var storage = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });
}


module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}
