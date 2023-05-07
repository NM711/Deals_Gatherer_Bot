const { embed, no_more_items, double_btn_row, } = require('../components/search_item_components.js')

module.exports.fetchSearch = async (query, index) => {
    try {
        const response = await fetch(`http://localhost:3000/api/all?search=${query}&index=${index}&key=${process.env.DEALS_GATHERER_KEY}`)
        const data = await response.json()
        const embeds = []
        for (const prod of data) {
            embeds.push(embed(prod))
        }

        return embeds
    }
    catch (err) {
        console.log("SEARCH FETCH ERR:", err)
        throw err
    }
}

module.exports.fetch_endpoint = async (name, index) => {
    try {
        const response = await fetch(`http://localhost:3000/api/${name}?index=${index}&key=${process.env.DEALS_GATHERER_KEY}`)
        const data = await response.json()
        const embeds = []
        for (const prod of data) {
            embeds.push(embed(prod))
        }
        return embeds
    }
    catch (err) {
        console.log("FETCH ERR:", err)
        throw err
    }
}

module.exports.glob_indexing = async (interaction, endpointName) => {
    let index = 0;
    let i = 1
    const refresh = async () => await this.fetch_endpoint(endpointName, index)
    let embeds = await refresh()
    const announce = () => double_btn_row(embeds, i, index)
    const paginatedEmbeds = (multiple, end = 10 * multiple) => embeds.slice(end - 10, end)
    const paginated = () => paginatedEmbeds(i)
    const reply = await interaction.reply({ embeds: paginated(), components: [announce()], ephemeral: true })
    const collector = await reply.createMessageComponentCollector({ time: 500000 }) // 500 sec timeout 
    collector.on('collect', async (interaction) => {

        if (interaction.customId === "load_more" && interaction.user.id) {
            i = i + 1
            if (i >= paginated().length - 1) {
                index = index + 1
                i = 1
                embeds = await refresh()
            }
            if (paginated().length !== 0) {
                await interaction.update({ embeds: paginated(), components: [announce()] })
            } else await interaction.update({ embeds: [no_more_items()], components: [announce()] })
        }
        else if (interaction.customId === "load_previous" && interaction.user.id) {
            i = i - 1

            if (i <= 1 && index > 0) {
                index = index - 1
                i = 1
                embeds = await refresh()
            }
            await interaction.update({ embeds: paginated(), components: [announce()] })
        }

    })

}
