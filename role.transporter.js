var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.empty && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.empty = true;
	    }
	    if(creep.memory.empty && creep.store.getFreeCapacity() == 0) {
	        creep.memory.empty = false;
	    }
	    if(creep.memory.empty) {
            storage = Game.getObjectById("3207edcc9f68a9a");
            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_TOWER ||
                                    structure.structureType == STRUCTURE_LINK ||
                                    structure.structureType == STRUCTURE_LAB ||
                                    structure.structureType == STRUCTURE_POWER_SPAWN ||
                                    structure.structureType == STRUCTURE_NUKER
                                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            if(targets.length <= 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TERMINAL ||
                                    structure.structureType == STRUCTURE_FACTORY
                                ) && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 20000;
                    }
                });
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0]);
                }
            }
            if(targets.length <= 0) {
                creep.memory.empty = true
            }
        }
	}
};

module.exports = roleTransporter;