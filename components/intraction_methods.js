const interactionBlueprint = method => interaction => async item => await interaction[method](item)

module.exports.interactionUpdate = interactionBlueprint('update')

module.exports.interactionReply = interactionBlueprint('reply')
