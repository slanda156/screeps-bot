var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.room.find(FIND_MY_CREEPS, {
            filter: function(object) {return object.hits < object.hitsMax;}});
        target.sort((a,b) => a.hits - b.hits);
        if(creep.heal(target[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
        }
	}
};

module.exports = roleHealer;