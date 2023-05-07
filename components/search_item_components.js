const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports.embed = (prod) => 
        new EmbedBuilder()
        .setColor("#000000")
        .setTitle(prod.productName)
        .setURL(prod.linkToProduct)
        .setThumbnail(prod.productImage)
        .addFields(
            { name: "Brand", value: prod.brand, inline: true },
            { name: "Current Price", value: prod.currentProductPrice || "none", inline: true }
            )


module.exports.load_more_btn = (paginatedEmbeds) =>
        new ButtonBuilder()
        .setCustomId("load_more")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Load More")
        .setDisabled(paginatedEmbeds.length === 0)

module.exports.load_previous_btn = (index, i) => 
        new ButtonBuilder()
        .setCustomId("load_previous")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Load Previous")
        .setDisabled(i - 1 <= 0 && index === 0)


module.exports.double_btn_row = (embeds, i, index) => 
            new ActionRowBuilder()
            .setComponents(this.load_previous_btn(index, i), this.load_more_btn(embeds), this.showPage(index))

module.exports.no_more_items = () => 
            new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("NO MORE ITEMS!")

module.exports.showPage = (index) => 
            new ButtonBuilder()
            .setCustomId("display_page")
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`Current Page ${index}`)
            .setDisabled(true)
