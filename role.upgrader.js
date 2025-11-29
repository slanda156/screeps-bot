var roleUpgrader = {

    run: function(creep) {
        if(!creep.memory.mining && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mining = true;
        }
        if(creep.memory.mining && creep.store.getFreeCapacity() == 0) {
            creep.memory.mining = false;
        }
            
        if(creep.room.controller.level == 8){
            creep.memory.maxController = true;
        }
        else{
            creep.memory.maxController = false;
        }
            
        if(creep.room.controller.ticksToDowngrade < 150000){
            creep.memory.upgrade = true;
        }
        if(creep.room.controller.ticksToDowngrade > 190000){
            creep.memory.upgrade = false;
        }
            
        if(!creep.memory.mining) {
            if(creep.memory.maxController){
                if(creep.memory.upgrade){
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    } 
                }
            }
            else{
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        else {
            var storages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                                    structure.structureType == STRUCTURE_STORAGE
                        ) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(storages.length > 0) {
                if(creep.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[0]);
                }
            }
            else {
                var sources = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources);
                }
            }
        }
    }
};

module.exports = roleUpgrader;