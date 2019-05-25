import * as debug from 'debug';
import { Logger, LogEntryError, LogQueryRow} from '../tools/logger';

const logger = new Logger();

logger.open().then(async data => {
    console.log('fin:', data);
    const log2: any = logger;
    await log2.errors(['some text', 'another text']);
});