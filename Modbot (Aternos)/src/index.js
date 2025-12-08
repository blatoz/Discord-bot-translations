import logger from './bot/Logger.js';
import {ShardingManager} from 'discord.js';
import config from './bot/Config.js';
import database from './database/Database.js';
import commandManager from './commands/CommandManager.js';

try {
    await logger.debug('Beállítások betöltése');
    await config.load();
    await logger.info('Adatbázishoz való csatlakozás');
    await database.connect();
    await logger.info('Adatbázis táblák létrehozása');
    await database.createTables();
    await database.runMigrations();
    await logger.notice('Slash parancsok globális regisztrálása');
    await commandManager.registerGlobalCommands();

    await logger.info('Shardok indítása');
    const manager = new ShardingManager(
        import.meta.dirname + '/shard.js',
        {
            token: config.data.authToken,
        }
    );

    manager.on('shardCreate', async shard => {
        shard.args = [shard.id, manager.totalShards];
        await logger.notice(`Shard ${shard.id} indítása`);


        shard.on('ready', () => {
            logger.info(`Shard ${shard.id} csatlakozott a Discord Gateway-hoz.`);
        });
    });

    const shards = await manager.spawn();
    await logger.info(`Indított shardok száma: ${shards.size}`);
} catch (error) {
    try {
        await logger.critical('Shard Manager hibázott', error);
    } catch (e) {
        console.error('Hibás indítási folyamat, monitorozási rendszernek nem sikerült küldeni a kritikus hibát', e);
    }
    process.exit(1);
}
