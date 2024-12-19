"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchHttpProvider = void 0;
const NETWORK_TIMEOUT = 'NETWORK_REQUEST_TIMEOUT';
/**
 * HttpProvider should be used to send rpc calls over http
 */
class FetchHttpProvider {
    host;
    withCredentials;
    timeout;
    headers;
    agent;
    connected;
    constructor(host, options) {
        this.host = host;
        this.withCredentials = options?.withCredentials || false;
        this.timeout = options?.timeout || 0;
        this.headers = options?.headers;
        this.agent = options?.agent;
        this.connected = false;
        this.host = host || 'http://localhost:8545';
    }
    prepareRequest(body) {
        return new Promise((resolve, reject) => {
            fetch(this.host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.headers?.reduce((prev, current) => ({ ...prev, [current.name]: current.value }), {}),
                },
                credentials: this.withCredentials ? 'include' : undefined,
                body,
            }).then(resolve, reject);
            if (this.timeout) {
                const e = new Error(NETWORK_TIMEOUT);
                setTimeout(reject, this.timeout, e);
            }
        });
    }
    send(payload, callback) {
        this.prepareRequest(JSON.stringify(payload))
            .then((response) => response?.json())
            .then((result) => {
            this.connected = true;
            callback(null, result);
        })
            .catch((e) => {
            if (e?.message === NETWORK_TIMEOUT) {
                callback(new Error('CONNECTION TIMEOUT: timeout of ' + this.timeout + ' ms achived'));
                return;
            }
            const error = new Error("CONNECTION ERROR: Couldn't connect to node " + this.host + '.');
            if (e) {
                error.code = e.code;
                error.reason = e.reason;
            }
            this.connected = false;
            callback(error);
        });
    }
    disconnect() {
        //NO OP
    }
    supportsSubscriptions() {
        return false;
    }
}
exports.FetchHttpProvider = FetchHttpProvider;
//# sourceMappingURL=FetchHTTPProvider.js.map