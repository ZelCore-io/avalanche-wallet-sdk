"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMWebSocketProvider = void 0;
const ethers_1 = require("ethers");
const SOCKET_RECONNECT_TIMEOUT = 1000;
class EVMWebSocketProvider {
    provider;
    wsUrl;
    wallets = [];
    constructor(wsUrl) {
        let provider = new ethers_1.ethers.providers.WebSocketProvider(wsUrl);
        this.provider = provider;
        this.wsUrl = wsUrl;
        this.addListeners();
    }
    setEndpoint(wsUrl) {
        this.destroyConnection();
        let provider = new ethers_1.ethers.providers.WebSocketProvider(wsUrl);
        this.provider = provider;
        this.wsUrl = wsUrl;
        this.addListeners();
    }
    trackWallet(wallet) {
        if (this.wallets.includes(wallet)) {
            return;
        }
        this.wallets.push(wallet);
    }
    removeWallet(wallet) {
        if (!this.wallets.includes(wallet)) {
            return;
        }
        let index = this.wallets.indexOf(wallet);
        this.wallets.splice(index, 1);
    }
    async destroyConnection() {
        this.provider._websocket.onclose = () => { };
        await this.provider.destroy();
    }
    async reconnect() {
        // Clear the current onclose handler so that we dont attempt a reconnection
        await this.destroyConnection();
        let wsProvider = new ethers_1.ethers.providers.WebSocketProvider(this.wsUrl);
        this.provider = wsProvider;
    }
    addListeners() {
        let provider = this.provider;
        provider.on('block', () => {
            this.onBlock();
        });
        // Save default function so we can keep calling it
        let defaultOnOpen = provider._websocket.onopen;
        let defaultOnClose = provider._websocket.onclose;
        provider._websocket.onopen = (ev) => {
            if (defaultOnOpen)
                defaultOnOpen(ev);
        };
        provider._websocket.onclose = (ev) => {
            if (defaultOnClose)
                defaultOnClose(ev);
            setTimeout(() => {
                this.reconnect();
            }, SOCKET_RECONNECT_TIMEOUT);
        };
    }
    removeListeners() {
        this.provider.off('block', this.onBlock);
    }
    onBlock() {
        // Update wallet balances
        this.wallets.forEach((w) => {
            w.updateAvaxBalanceC();
        });
    }
}
exports.EVMWebSocketProvider = EVMWebSocketProvider;
//# sourceMappingURL=EVMWebSocketProvider.js.map