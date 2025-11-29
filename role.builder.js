var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }
	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else{
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax});
                targets.sort((a,b) => a.hits - b.hits);
                var target = null;
                if(targets.length > 0) {
                    for(i = 0; i < targets.length; i++){
                        if(target == null){
                            if(targets[i].structureType != STRUCTURE_ROAD){
                                target = targets[i]
                                break;
                            }
                        }
                    }
                    if(target != null) {
                        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
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

module.exports = roleBuilder;