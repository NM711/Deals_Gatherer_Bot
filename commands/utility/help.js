const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const helpEmbed = new EmbedBuilder()
  .setColor('#FFFFFF')
  .setTitle('Available Commands')
  .setDescription('Command names and their slash values')
  .setFields(
    { name: 'computers', value: '/computers, gets all available computer deals.' },
    { name: 'monitors', value: '/monitors, gets all available monitors deals.' },
    { name: 'search', value: '/search + input, search for a specific product.' }
  )

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of all available commands.'),
  async execute (interaction) {
    await interaction.reply({ embeds: [helpEmbed] })
  }
}
