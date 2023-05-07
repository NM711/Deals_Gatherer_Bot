const { SlashCommandBuilder } = require('discord.js')
const { glob_indexing } = require('../../boilerplate/fetch_indexing.js')

module.exports = {
    data: new SlashCommandBuilder()
            .setName("monitors")
            .setDescription("Get price information on all monitor deals!"),
    async execute(interaction){
        await glob_indexing(interaction, "monitors")
    }
}
