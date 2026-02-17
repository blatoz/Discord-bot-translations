import EventListener from '../EventListener.js';
import logger from '../../bot/Logger.js';

export default class RateLimitEventListener extends EventListener {

    async execute(details) {
        await logger.warn({
            message: 'A bot elérte a ratelimitet',
            details
        });
    }

    get name() {
        return 'rateLimited';
    }
}