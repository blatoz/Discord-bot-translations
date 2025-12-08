import logger from './bot/Logger.js';
import config from './bot/Config.js';
import database from './database/Database.js';
import bot from './bot/Bot.js';
import DiscordEventManager from './events/discord/DiscordEventManager.js';
import RestEventManagerEventManager from './events/rest/RestEventManager.js';
import commandManager from './commands/CommandManager.js';
import IntervalManager from './interval/IntervalManager.js';

try {
    await logger.debug('Beállítások betöltése');
    await config.load();
    await logger.info('Adatbázishoz való csatlakozás');
    await database.connect();
    await logger.notice('Bejelentkezés a Discordba');
    await bot.start();
    await logger.info('Online');

    await logger.debug('Eseményfigyelők betöltése');
    new DiscordEventManager().subscribe();
    new RestEventManagerEventManager().subscribe();
    await logger.debug('Intervallumok beállítása');
    new IntervalManager().schedule();
    await logger.notice('Guild parancsok frissítése');
    await commandManager.updateCommandIds();
    await commandManager.updateGuildCommands();
    await logger.info('Indítás kész');
} catch (error) {
    try {
        await logger.critical('Shard hibázott', error);
    } catch (e) {
        console.error('Hibás indítási folyamat, monitorozási rendszernek nem sikerült küldeni a kritikus hibát', e);
    }
    process.exit(1);
}
