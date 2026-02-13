const fs = require('fs');
const {reloadConfig} = require('./functions/configuration');
const {syncCommandsIfNeeded} = require('../main');

module.exports.commands = [
    {
        command: 'help',
        description: 'Ezt az üzenet mutatja',
        run: function (inputElement) {
            let allCommandString = `Üdv! Jelenleg ${inputElement.cliCommands.length} parancs van betöltve.\n\n`;
            for (const command of inputElement.cliCommands) {
                if (command.module) allCommandString = allCommandString + `[${command.module}] ${command.originalName || command.command}: ${command.description}\n`;
                else allCommandString = allCommandString + `${command.originalName || command.command}: ${command.description}\n`;
            }
            console.log(allCommandString);
        }
    },
    {
        command: 'license',
        description: 'Licensz megjelenítése.',
        run: function () {
            const license = fs.readFileSync(`${__dirname}/../LICENSE`);
            console.log(license.toString());
        }
    },
    {
        command: 'reload',
        description: 'Bot konfiguráció újratöltése.',
        run: async function (inputElement) {
            if (inputElement.client.logChannel) await inputElement.client.logChannel.send('🔄 Kofiguráció újra töltése cli mondta');
            reloadConfig(inputElement.client).then(async () => {
                if (inputElement.client.logChannel) await inputElement.client.logChannel.send('✅ Konfiguráció sikeresen újratölöttöt.');
                console.log('Sikeresen újratöltve, parancsok szinkronizálása...');
                await syncCommandsIfNeeded();
                console.log('Parancsok szinkronizlva, konfiguráció sikeresen újratöltve.');
            }).catch(async () => {
                if (inputElement.client.logChannel) await inputElement.client.logChannel.send('⚠️️ Konfiguráció újratöltése sikertelen. Bot leállítása');
                console.log('Újratöltése sikertelen. Kilépés');
                process.exit(1);
            });
        }
    },
    {
        command: 'modules',
        description: 'Megmutatja az összes modult a botban',
        run: async function (inputElement) {
            let message = '=== MODULOK ===';
            for (const moduleName in inputElement.client.modules) {
                message = message + `\n• ${moduleName}: ${inputElement.client.modules[moduleName].enabled ? 'Engedélyezve' : 'Letiltva'}`;
            }
            console.log(message);
        }
    }
];
