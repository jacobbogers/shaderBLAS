export interface LogEntryError {
    module: string;
    section: string;
    text: string;
};

export interface LogQueryRow {
    type: 'error' | 'notify' | 'debug' | 'trace' | 'error';
    time: Date,
    module: string;
    section: string;
    text: string;
}


export class Logger extends EventTarget {
    private name: string;
    private version: number;
    private ops: string[];
    private error: Error;
    private currentEvent: Event;
    private db: IDBDatabase;

    constructor() {
        super();
        this.name = 'logs';
        this.version = 5;
        this.ops = [];
    }

    private _lastOps() {
        return this.ops[this.ops.length - 1];
    }

    open() {
        let req: IDBOpenDBRequest;
        let id: number; // timeout id
        const event = `${Math.random()}`; // internal event random to prevent collision
        try {
            req = self.indexedDB.open(this.name, this.version);
        }
        catch (err) {
            this.error = err;
            this.ops.push('error');
            this.error = err;
            this.dispatchEvent(new Event(event));
        }
        req.onblocked = e => {
            this.ops.push('blocked');
            this.currentEvent = e;
            this.dispatchEvent(new Event(event));
        };
        req.onupgradeneeded = e => {
            clearTimeout(id);
            const { oldVersion, newVersion } = e;
            const db = this.db = req.result;
            if (oldVersion === 0) { // first Time
                const errorStore = db.createObjectStore('logs-errors', { autoIncrement: true });
                errorStore.createIndex('time', 'time');
                const traceStore = db.createObjectStore('logs-trace', { autoIncrement: true });
                traceStore.createIndex('time', 'time');
                const warningStore = db.createObjectStore('logs-warning', { autoIncrement: true });
                warningStore.createIndex('time', 'time');
                const debugStore = db.createObjectStore('logs-debug', { autoIncrement: true });
                debugStore.createIndex('time', 'time');
            }
            if ((oldVersion === 0 && newVersion >= 2) || (newVersion === 2)) {
                console.log('upgrade to 2');
            }
            if ((oldVersion === 0 && newVersion >= 3) || (newVersion === 3)) {
                console.log('upgrade to 3');
            }
            this.currentEvent = e;
            this.ops.push('upgradeneeded');
            this.dispatchEvent(new Event(event));
        };

        req.onsuccess = e => {
            this.currentEvent = e;
            this.ops.push('success');
            this.db = req.result;
            this.dispatchEvent(new Event(event));
        }
        req.onerror = e => {
            this.currentEvent = e;
            this.ops.push('error');
            this.dispatchEvent(new Event(event));
        }

        const createListener = (resolve: (value?: {} | PromiseLike<{}>) => void) => (event: Event) => {

            if (this._lastOps() === 'success') {
                resolve([this.db, null]);
                return;
            }
            if (this._lastOps() === 'blocked') {
                id = setTimeout(() => {
                    resolve([null, 'timeout waiting in blocked']);
                }, 5000);
            }
            if (this._lastOps() === 'error') {
                clearTimeout(id);
                resolve([null, this.error]);
            }
        };

        let listener: (event: Event) => void;

        function removeListener() {
            this.removeListener(event, listener);
        }

        return new Promise(resolve => {
            listener = createListener(resolve);
            this.addEventListener(event, listener); 
        });
    }
}
