const { SlashCommandBuilder } = require('discord.js')
const { glob_indexing } = require('../../boilerplate/fetch_indexing.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('computers')
    .setDescription('Get price information on all computer deals'),

  async execute (interaction) {
    await glob_indexing(interaction, 'computers')
  }
}

