var roleMineralMiner = {

    /** @param {Creep} creep **/
    run: function(creep, mineralType) {
        if(creep.store.getUsedCapacity() == 0) {
            creep.memory.mining = true;
	    }
	    if( creep.store.getFreeCapacity() == 0) {
	        creep.memory.mining = false;
	    }
	    if(creep.memory.mining) {
            var minerals = creep.pos.findClosestByRange(FIND_MINERALS);
            if(creep.harvest(minerals) == ERR_NOT_IN_RANGE) {
                creep.moveTo(minerals);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TERMINAL ||
                                structure.structureType == STRUCTURE_FACTORY ||
                                structure.structureType == STRUCTURE_LAB
                            ) && structure.store.getUsedCapacity(mineralType) <  structure.store.getCapacity()*0.3;
                }
            });
            if(creep.transfer(targets[0], mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
	}
};

module.exports = roleMineralMiner;