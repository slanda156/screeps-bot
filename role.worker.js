var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.mining && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mining = true;
	    }
	    if(creep.memory.mining && creep.store.getFreeCapacity() == 0) {
	        creep.memory.mining = false;
	    }
	    if(creep.memory.mining) {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER||
                                structure.structureType == STRUCTURE_LINK||
                                structure.structureType == STRUCTURE_STORAGE
                                ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
	}
};

module.exports = roleWorker;