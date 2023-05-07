require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()
// joining current dir with the commands dir
const pathToCommandFolder = path.join(__dirname, 'commands')
// all sub directorys within the commands path are read
const pathToCommandSubFolders = fs.readdirSync(pathToCommandFolder)

for (const subFolder of pathToCommandSubFolders){
    // we join the pathToCommandFolder path with the sub folder path
    const subFolderPath = path.join(pathToCommandFolder, subFolder)
    // all js files are filtered
    const subFolderCommandFiles = fs.readdirSync(subFolderPath).filter(file => file.endsWith('js'))
    for (const file of subFolderCommandFiles){
        // subDirPath is joined with the js file in the loop
        const filePath = path.join(subFolderPath, file)
        // command is equal to each unnamed exported module within the js file
        const command = require(filePath)

        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command)
        }
        else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN)
