const { SlashCommandBuilder } = require('discord.js')
const { double_btn_row } = require('../../components/search_item_components.js')
const { fetchSearch } = require('../../boilerplate/fetch_indexing.js')

async function indexing (interaction) {
  const query = interaction.options.getString('query')
  let index = 0
  let i = 1
  console.log(`Queried: ${query}`)
  const refresh = async () => await fetchSearch(query, index)
  // first call
  let embeds = await refresh()

  const announce = () => double_btn_row(embeds, i, index)
  const paginatedEmbeds = (multiple, end = 10 * multiple) => embeds.slice(end - 10, end)
  const paginated = () => paginatedEmbeds(i)

  if (embeds.length > 0) {
    const reply = await interaction.reply({ embeds: paginated(), components: [announce()], ephemeral: true })
    const collector = reply.createMessageComponentCollector({ time: 500000 }) // 500 sec timeout
    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'load_more' && interaction.user.id) {
        i = i + 1

        if (i >= paginated().length) {
          index = index + 1
          i = 1
          embeds = await refresh()
        }
        await interaction.update({ embeds: paginated(), components: [announce()] })
      } else if (interaction.customId === 'load_previous' && interaction.user.id) {
        i = i - 1

        if (i <= 1 && index > 0) {
          index = index - 1
          i = 1
          embeds = await refresh()
        }
        await interaction.update({ embeds: paginated(), components: [announce()] })
      }
    })
  } else await interaction.reply({ content: `NO ITEMS FOUND WITH THE QUERY "${query}" !`, ephemeral: true })
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for products on the deals gatherer api.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('query prod')
    ),
  async execute (interaction) {
    await indexing(interaction)
  }
}
