import * as debug from 'debug';
import { Logger, LogEntryError, LogQueryRow} from '../tools/logger';

const logger = new Logger();

logger.open().then(data => console.log('fin:', data));