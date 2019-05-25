import { drawBufferInfo } from "twgl.js";

export interface LogEntryError {
    module: string;
    section: string;
    time: Date;
    text: string;
};

export interface LogQueryRow {
    type: 'error' | 'notify' | 'debug' | 'trace' | 'error';
    time: Date,
    module: string;
    section: string;
    text: string;
}


function addLoggers(obj: Logger) {
    const modules: string[] = [];
    const sections: string[] = [];

    /*function minMaxIdStore(msgtype: string){
        const transaction = obj.db.transaction([`logs-${msgtype}`], "readwrite");
        return new Promise(resolve => {
            let count = 0;
            transaction.oncomplete = () => {
                resolve([true, null]);
            }
            transaction.onerror = err => {
                resolve([null, err]);
            }
            const objectStore = transaction.objectStore(`logs-${msgtype}`);
            const request = objectStore.
            request.onsuccess = e => {
                count = request.result;
                if (count > obj.limit * 2){
                    objectStore.delete()
                }
            }
        });
    }*/

    function addTostore(msgtype: string, text: string[]) {
        const transaction = obj.db.transaction([`logs-${msgtype}`], "readwrite");
        const time = new Date();
        const lastModule = modules[modules.length - 1] || '';
        const lastSection = sections[sections.length - 1] || '';
        let path: string = '';
        if (lastModule) {
            if (lastSection) {
                path = `${lastModule}/${lastSection}`;
            }
            else {
                path = `${lastModule}/`;
            }
        }
        return new Promise(resolve => {
            transaction.oncomplete = () => {
                resolve([true, null]);
            }
            transaction.onerror = err => {
                resolve([null, err]);
            }
            const objectStore = transaction.objectStore(`logs-${msgtype}`);
            for (let i = 0; i < text.length; i++) {
                const objectStoreRequest = objectStore.add({
                    module: lastModule,
                    section: lastSection,
                    time,
                    text: text[i]
                });
            }
        });
    }

    Object.defineProperties(obj, {
        setModule: {
            value: (module: string) => {
                modules.push(module);
            },
            enumeration: false,
            configurable: false
        },
        setSection: {
            value: (section: string) => {
                sections.push(section);
            },
            enumeration: false,
            configurable: false
        },
        errors: {
            value: (text: string[]) => {
                return addTostore('errors', text); // promise
            },
            enumeration: false,
            configurable: false
        },
        popSection: {
            enumeration: false,
            configurable: false,
            value: () => {
                sections.pop();
            },

        },
        popModule: {
            enumeration: false,
            configurable: false,
            value: () => {
                modules.pop();
            },
        }
    });
}


export class Logger extends EventTarget {
    private name: string;
    private version: number;
    private ops: string[];
    private error: Error;
    private currentEvent: Event;
    
    public limit: number;
    public db: IDBDatabase;


    constructor() {
        super();
        this.name = 'logs';
        this.version = 5;
        this.ops = [];
    }

    private _lastOps() {
        return this.ops[this.ops.length - 1];
    }

    open(limit: number = 300) {
        this.limit = 300;
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
                const errorStore = db.createObjectStore('logs-error', { autoIncrement: true });
                errorStore.createIndex('time', 'time');
                const traceStore = db.createObjectStore('logs-trace', { autoIncrement: true });
                traceStore.createIndex('time', 'time');
                const warningStore = db.createObjectStore('logs-warn', { autoIncrement: true });
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
            addLoggers(this);
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
                    resolve([null, 'timeout of 5sec waiting in blocked']);
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
